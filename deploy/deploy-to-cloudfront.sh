#!/bin/bash
# ./deploy-to-cloudfront.sh <--dryrun> bucket/path E3MCDWO76SJMEA
# deploy the site to s3, and invalidate it in cloudfront.
# if --dryrun is passed as the first argument, do a dry run instead

set -e

dry_run=""
case "$1" in
    --dryrun)
        dry_run="--dryrun"
        shift
        ;;
esac

bucket="$1"
distribution="$2"

# older versions of the aws tool don't enable cloudfront by default, so we need to enable it.
aws configure set preview.cloudfront true

# sync our cacheable resources
aws s3 sync $dry_run ./build/ "s3://$bucket" --exclude="index.html" \
    --metadata-directive REPLACE \
    --cache-control max-age=3600,public

# sync our final things
aws s3 sync $dry_run ./build/ "s3://$bucket" --include="index.html" 

# check id to make sure it exists, route stdout to /dev/null since it's not necessary
aws cloudfront get-distribution --id "$distribution" >> /dev/null

# create-invalidation doesn't provide dry-run so simulate it
if [[ -z "$dry_run" ]]
then
    aws cloudfront create-invalidation --distribution-id "$distribution" --paths '/*'
else
    echo "aws cloudfront create-invalidation --distribution-id $distribution --paths '/*'"
fi

