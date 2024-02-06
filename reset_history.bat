git checkout --orphan latest_branch
git add --all -- :!reset_history.bat
git commit -am "Initial commit"
git branch -D main
git branch -m main
git push -f origin main
git branch --set-upstream-to=origin/main main
git gc --aggressive --prune=all