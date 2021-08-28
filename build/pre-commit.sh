#!/bin/bash
#
# =================== how to use ====================
# cp ./build/pre-commit.sh ./.git/hooks/pre-commit
# chmod 777 ./.git/hooks/pre-commit
# git commit -h
# git commit -n -m 'pass hook' #bypass pre-commit and commit-msg hooks
# ==================== end ==========================

# Determine if a file list is passed
if [ "$#" -ne 0 ]
then
    exit 0
fi

gulp_path=$(cd `dirname $0`; pwd)"/node_modules/.bin/gulp"
prettier_path=$(cd `dirname $0`; pwd)"/node_modules/.bin/prettier"

# for js
jsfiles=$(git diff --cached --name-only --diff-filter=ACM "*.js" "*.jsx" "*.vue" "*.css" "*.less" | tr '\n' ' ')
[ -z "$jsfiles" ] && exit 0

# format iview
$gulp_path iview --gulpfile gulpfile.js

# Prettify all staged .js files
echo "$jsfiles" | xargs $prettier_path --config .prettierrc.js --ignore-path .prettierignore --write

# Add back the modified/prettified files to staging
echo "$jsfiles" | xargs git add

git update-index -g

exit $?
