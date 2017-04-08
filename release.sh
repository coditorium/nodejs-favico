#!/bin/bash

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Specify version"
  exit 1
fi

echo "Releasing version: $VERSION"
cd ./favico && npm version $VERSION && \
cd ../favico-cli && npm version $VERSION && \
git add -A && git commit -am "Release: $VERSION" && git tag "v$VERSION" && git push && git push --tags && \
echo "Releases: $VERSION";
