# CAN BE USED TO CONFIGURE ENVS
#!/bin/bash
set -ex

BRANCH_NAME="$1"

if [ "$BRANCH_NAME" == "production" ]; then
  echo "Building production..."
  npm run test
elif [ "$BRANCH_NAME" == "staging" ]; then
  echo "Building staging..."
  npm run test
elif [ "$BRANCH_NAME" == "sandbox" ]; then
  echo "Building sandbox..."
  npm run test
else
  echo "Building $BRANCH_NAME..."
  npm run test
fi

unset BRANCH_NAME

npm run build

