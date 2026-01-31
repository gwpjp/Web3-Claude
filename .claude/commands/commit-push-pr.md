# Commit, Push, and Create PR

Commit the current changes, push to remote, and create a pull request.

## Current State

**Branch:** $git branch --show-current$

**Status:**
$git status --short$

**Recent commits:**
$git log --oneline -5$

**Staged diff:**
$git diff --cached --stat$

**Unstaged diff:**
$git diff --stat$

## Instructions

1. Review the status and diffs above
2. If there are changes:
   - Stage all changes with `git add -A`
   - Create a descriptive commit message based on the changes
   - Commit with `git commit -m "<message>"`
3. Push to the current branch with `git push -u origin $(git branch --show-current)`
4. Create a PR using the GitHub CLI if available: `gh pr create --fill`
   - If gh is not installed, provide instructions for creating PR manually
5. Report the PR URL or next steps

## Commit Message Format

Use conventional commits:

- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code refactoring
- `style:` for formatting changes
- `docs:` for documentation
- `chore:` for maintenance tasks
