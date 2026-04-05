#!/usr/bin/env bash
# Usage:
#   ./build-and-push.sh                        # full deploy: all services
#   ./build-and-push.sh --dry                  # build only (local, no push)
#   ./build-and-push.sh --only <svc>           # deploy one service: backend | pozz-app | pozz-public | poss-admin
#   ./build-and-push.sh --bump minor           # or major (default: patch)
#
# Full deploy flow (in order):
#   1. git add -A + commit pending changes
#   2. Bump docker/VERSION (patch by default), stamp all targeted service tags in docker-compose.yml
#   3. git add -A + commit + push  ← Portainer reads compose from GitHub, so this must come first
#   4. docker build --platform linux/amd64 + push image + :latest tag to GHCR
#   5. curl -X POST <PORTAINER_WEBHOOK>  ← triggers Portainer to pull updated compose and redeploy

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.yml"
VERSION_FILE="${SCRIPT_DIR}/VERSION"
PREFIX="ghcr.io/husainf4l"
PORTAINER_WEBHOOK="https://docker.aqlaan.com/api/stacks/webhooks/9fb9d21d-4500-4139-b262-e39b145236c0"

PUSH=true
ONLY=""
BUMP="patch"

# ── Parse args ──────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry)    PUSH=false; shift ;;
    --only)   ONLY="$2"; shift 2 ;;
    --bump)   BUMP="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# ── Bump version ─────────────────────────────────────────────────────────────
bump_version() {
  local current
  current=$(cat "${VERSION_FILE}")
  IFS='.' read -r major minor patch <<< "${current}"
  case "${BUMP}" in
    major) major=$((major + 1)); minor=0; patch=0 ;;
    minor) minor=$((minor + 1)); patch=0 ;;
    patch) patch=$((patch + 1)) ;;
    *) echo "Unknown bump type: ${BUMP}"; exit 1 ;;
  esac
  echo "${major}.${minor}.${patch}" > "${VERSION_FILE}"
  echo "${major}.${minor}.${patch}"
}

# ── Stamp only targeted service(s) in docker-compose.yml ─────────────────────
stamp_versions() {
  local ver="$1"
  if [[ -z "${ONLY}" || "${ONLY}" == "backend" ]]; then
    sed -i.bak "s|${PREFIX}/pozz-backend:[^ ]*|${PREFIX}/pozz-backend:${ver}|g" "${COMPOSE_FILE}"
  fi
  if [[ -z "${ONLY}" || "${ONLY}" == "pozz-app" ]]; then
    sed -i.bak "s|${PREFIX}/pozz-app:[^ ]*|${PREFIX}/pozz-app:${ver}|g" "${COMPOSE_FILE}"
  fi
  if [[ -z "${ONLY}" || "${ONLY}" == "pozz-public" ]]; then
    sed -i.bak "s|${PREFIX}/pozz-public:[^ ]*|${PREFIX}/pozz-public:${ver}|g" "${COMPOSE_FILE}"
  fi
  if [[ -z "${ONLY}" || "${ONLY}" == "poss-admin" ]]; then
    sed -i.bak "s|${PREFIX}/poss-admin:[^ ]*|${PREFIX}/poss-admin:${ver}|g" "${COMPOSE_FILE}"
  fi
  rm -f "${COMPOSE_FILE}.bak"
}

# ── Build image(s) ────────────────────────────────────────────────────────────
build_images() {
  local ver="$1"

  if [[ -z "${ONLY}" || "${ONLY}" == "backend" ]]; then
    echo "▶ Building pozz-backend:${ver} …"
    docker build --platform linux/amd64 \
      -t "${PREFIX}/pozz-backend:${ver}" \
      -t "${PREFIX}/pozz-backend:latest" \
      -f "${ROOT_DIR}/backend/PozzBackend/Dockerfile" \
      "${ROOT_DIR}/backend/PozzBackend"
  fi

  if [[ -z "${ONLY}" || "${ONLY}" == "pozz-app" ]]; then
    echo "▶ Building pozz-app:${ver} …"
    docker build --platform linux/amd64 \
      -t "${PREFIX}/pozz-app:${ver}" \
      -t "${PREFIX}/pozz-app:latest" \
      -f "${ROOT_DIR}/frontend/pozz-app/Dockerfile" \
      "${ROOT_DIR}/frontend/pozz-app"
  fi

  if [[ -z "${ONLY}" || "${ONLY}" == "pozz-public" ]]; then
    echo "▶ Building pozz-public:${ver} …"
    docker build --platform linux/amd64 \
      -t "${PREFIX}/pozz-public:${ver}" \
      -t "${PREFIX}/pozz-public:latest" \
      -f "${ROOT_DIR}/frontend/pozz-public/Dockerfile" \
      "${ROOT_DIR}/frontend/pozz-public"
  fi

  if [[ -z "${ONLY}" || "${ONLY}" == "poss-admin" ]]; then
    echo "▶ Building poss-admin:${ver} …"
    docker build --platform linux/amd64 \
      -t "${PREFIX}/poss-admin:${ver}" \
      -t "${PREFIX}/poss-admin:latest" \
      -f "${ROOT_DIR}/frontend/poss-admin/Dockerfile" \
      "${ROOT_DIR}/frontend/poss-admin"
  fi
}

# ── Push image(s) ─────────────────────────────────────────────────────────────
push_images() {
  local ver="$1"

  if [[ -z "${ONLY}" || "${ONLY}" == "backend" ]]; then
    docker push "${PREFIX}/pozz-backend:${ver}"
    docker push "${PREFIX}/pozz-backend:latest"
  fi

  if [[ -z "${ONLY}" || "${ONLY}" == "pozz-app" ]]; then
    docker push "${PREFIX}/pozz-app:${ver}"
    docker push "${PREFIX}/pozz-app:latest"
  fi

  if [[ -z "${ONLY}" || "${ONLY}" == "pozz-public" ]]; then
    docker push "${PREFIX}/pozz-public:${ver}"
    docker push "${PREFIX}/pozz-public:latest"
  fi

  if [[ -z "${ONLY}" || "${ONLY}" == "poss-admin" ]]; then
    docker push "${PREFIX}/poss-admin:${ver}"
    docker push "${PREFIX}/poss-admin:latest"
  fi
}

# ── Main ──────────────────────────────────────────────────────────────────────
VERSION=$(cat "${VERSION_FILE}")

if [[ "${PUSH}" == "true" ]]; then
  # Step 1: commit any pending code changes
  cd "${ROOT_DIR}"
  git add -A
  git diff --cached --quiet || git commit -m "chore: pre-release changes"

  # Step 2: bump version and stamp compose
  VERSION=$(bump_version)
  echo "▶ Version → ${VERSION}"
  stamp_versions "${VERSION}"

  # Step 3: commit + push (Portainer reads compose from GitHub)
  git add -A
  git commit -m "chore: release v${VERSION}"
  git push

  # Step 4: build & push images
  build_images "${VERSION}"
  push_images "${VERSION}"

  # Step 5: trigger Portainer webhook
  echo "▶ Triggering Portainer webhook …"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${PORTAINER_WEBHOOK}")
  echo "   Portainer responded: ${STATUS}"

  echo "✅ Released v${VERSION}"
else
  # Dry run: local build only, no git commits, no push, no webhook
  echo "▶ Dry run — building locally (no push) — version ${VERSION}"
  build_images "${VERSION}"
  echo "✅ Dry build complete."
fi
