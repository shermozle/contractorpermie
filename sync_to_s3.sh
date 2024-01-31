#!/bin/sh

s3cmd sync --acl-public --preserve --recursive --exclude-from=.gitignore ./ s3://contractorpermie.com/
aws cloudfront create-invalidation --distribution-id E1ZW5KU8M6GM50 \
--invalidation-batch "{ \"Paths\": { \"Quantity\": 1, \"Items\": [ \"/*\" ] }, \"CallerReference\": \"`date +%s`\" }"