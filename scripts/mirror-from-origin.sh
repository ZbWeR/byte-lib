#!/usr/bin/env bash
# Mirror git refs from Cursor Origin into GitHub.
# Origin is the source of truth. GitHub is a downstream copy of branches and tags.
set -euo pipefail

SOURCE_URL="${MIRROR_SOURCE_URL:-https://origin.cursor.com/git/zbwer/byte-lib.git}"
DEST_URL="${MIRROR_DEST_URL:?MIRROR_DEST_URL is required}"
WORKFLOW_PATH="${MIRROR_WORKFLOW_PATH:-.github/workflows/mirror-from-origin.yml}"
DEFAULT_BRANCH="${MIRROR_DEFAULT_BRANCH:-main}"

workdir="$(mktemp -d)"
cleanup() {
  rm -rf "$workdir"
}
trap cleanup EXIT

git clone --bare "$SOURCE_URL" "$workdir/source.git"
cd "$workdir/source.git"

has_workflow=0
if git cat-file -e "${DEFAULT_BRANCH}:${WORKFLOW_PATH}" 2>/dev/null; then
  has_workflow=1
fi

dest_push() {
  git push --force "$DEST_URL" "$@"
}

if [[ "$has_workflow" -eq 1 ]]; then
  dest_push --prune '+refs/heads/*:refs/heads/*' '+refs/tags/*:refs/tags/*'
  echo "Mirrored all Origin heads and tags to GitHub (Origin ${DEFAULT_BRANCH} already contains ${WORKFLOW_PATH})."
  exit 0
fi

# Keep GitHub's default branch until Origin also carries this workflow.
# Otherwise the first scheduled run would overwrite GitHub main and delete itself.
refspecs=()
while IFS= read -r ref; do
  branch="${ref#refs/heads/}"
  if [[ "$branch" == "$DEFAULT_BRANCH" ]]; then
    continue
  fi
  refspecs+=("+${ref}:${ref}")
done < <(git for-each-ref --format='%(refname)' refs/heads)

if [[ "${#refspecs[@]}" -gt 0 ]]; then
  dest_push "${refspecs[@]}"
fi

if git show-ref --quiet --tags; then
  dest_push '+refs/tags/*:refs/tags/*'
fi

echo "Mirrored Origin branches except ${DEFAULT_BRANCH}; Origin ${DEFAULT_BRANCH} does not yet contain ${WORKFLOW_PATH}."
