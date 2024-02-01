#!/bin/sh

s3cmd sync --acl-public --preserve --recursive --exclude-from=.gitignore ./ s3://www.contractorpermie.com/

# Turns out I'm using Fastly not Cloudfront so don't need this
# aws cloudfront create-invalidation --distribution-id E1ZW5KU8M6GM50 \
# --invalidation-batch "{ \"Paths\": { \"Quantity\": 1, \"Items\": [ \"/*\" ] }, \"CallerReference\": \"`date +%s`\" }"