#!/usr/bin/env bash
# Align and sign an Android APK with APK Signature Scheme v1 + v2 + v3.
#
# Do not use jarsigner alone. Android 11+ rejects targetSdk >= 30 APKs that
# have only JAR (v1) signing. zipalign must run BEFORE apksigner.
#
# Usage:
#   scripts/sign_apk.sh <input.apk> <output.apk>
#
# Required environment (never commit these values or the keystore file):
#   JKSP_KEYSTORE    path to the PKCS12/JKS keystore
#   JKSP_STOREPASS   keystore password
# Optional:
#   JKSP_KEYALIAS    key alias (default: jksp)
#   JKSP_KEYPASS     key password (default: same as JKSP_STOREPASS)
#   ANDROID_HOME / ANDROID_SDK_ROOT  SDK root containing build-tools/
#   ZIPALIGN / APKSIGNER             explicit tool paths
set -euo pipefail

usage() {
  echo "Usage: $0 <input.apk> <output.apk>" >&2
  echo "Requires JKSP_KEYSTORE and JKSP_STOREPASS. See script header." >&2
  exit 2
}

[[ $# -eq 2 ]] || usage
IN=$1
OUT=$2
[[ -f "$IN" ]] || { echo "input APK not found: $IN" >&2; exit 1; }
[[ -n "${JKSP_KEYSTORE:-}" && -f "${JKSP_KEYSTORE}" ]] || {
  echo "JKSP_KEYSTORE must point at an existing keystore file" >&2
  exit 1
}
[[ -n "${JKSP_STOREPASS:-}" ]] || {
  echo "JKSP_STOREPASS is required" >&2
  exit 1
}
ALIAS=${JKSP_KEYALIAS:-jksp}
export JKSP_STOREPASS
export JKSP_KEYPASS=${JKSP_KEYPASS:-$JKSP_STOREPASS}

find_build_tool() {
  local name=$1 env_override=$2
  if [[ -n "${!env_override:-}" && -x "${!env_override}" ]]; then
    echo "${!env_override}"
    return 0
  fi
  if command -v "$name" >/dev/null 2>&1; then
    command -v "$name"
    return 0
  fi
  local root=${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}
  if [[ -n "$root" && -d "$root/build-tools" ]]; then
    local ver tool
    ver=$(ls -1 "$root/build-tools" | sort -V | tail -n1)
    tool="$root/build-tools/$ver/$name"
    if [[ -x "$tool" ]]; then
      echo "$tool"
      return 0
    fi
  fi
  echo "Cannot find $name. Install Android SDK build-tools or set $env_override / ANDROID_HOME." >&2
  exit 1
}

ZIPALIGN_BIN=$(find_build_tool zipalign ZIPALIGN)
APKSIGNER_BIN=$(find_build_tool apksigner APKSIGNER)

WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT
cp "$IN" "$WORKDIR/in.apk"

# Drop any previous JAR signature so apksigner writes a fresh v1 + v2 + v3 set.
# Other META-INF files (gradle metadata, kotlin, etc.) are left in place.
if command -v zip >/dev/null 2>&1; then
  mapfile -t SIG_FILES < <(zipinfo -1 "$WORKDIR/in.apk" | grep -E '^META-INF/[^/]+\.(SF|RSA|DSA|EC)$|^META-INF/MANIFEST\.MF$' || true)
  if [[ ${#SIG_FILES[@]} -gt 0 ]]; then
    zip -q -d "$WORKDIR/in.apk" "${SIG_FILES[@]}"
  fi
else
  python3 - "$WORKDIR/in.apk" <<'PY'
import sys, zipfile, os, tempfile, shutil
src = sys.argv[1]
drop = []
with zipfile.ZipFile(src) as z:
    for n in z.namelist():
        base = n.split("/")[-1]
        if n.startswith("META-INF/") and n.count("/") == 1 and (
            base == "MANIFEST.MF" or base.endswith((".SF", ".RSA", ".DSA", ".EC"))
        ):
            drop.append(n)
    if not drop:
        sys.exit(0)
    fd, tmp = tempfile.mkstemp(suffix=".apk")
    os.close(fd)
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, "w") as zout:
        for info in zin.infolist():
            if info.filename in drop:
                continue
            zout.writestr(info, zin.read(info.filename))
    shutil.move(tmp, src)
PY
fi

"$ZIPALIGN_BIN" -f -p 4 "$WORKDIR/in.apk" "$WORKDIR/aligned.apk"
"$ZIPALIGN_BIN" -c -p 4 "$WORKDIR/aligned.apk"

mkdir -p "$(dirname "$OUT")"
"$APKSIGNER_BIN" sign \
  --ks "$JKSP_KEYSTORE" \
  --ks-key-alias "$ALIAS" \
  --ks-pass env:JKSP_STOREPASS \
  --key-pass env:JKSP_KEYPASS \
  --v1-signing-enabled true \
  --v2-signing-enabled true \
  --v3-signing-enabled true \
  --out "$OUT" \
  "$WORKDIR/aligned.apk"

"$APKSIGNER_BIN" verify --verbose --print-certs "$OUT"
"$ZIPALIGN_BIN" -c -p 4 "$OUT"
echo "signed $OUT ($(wc -c < "$OUT") bytes)"
