# Skill: Git Workflow

## Mandatory Rules

- Small, focused commits
- Descriptive commit messages
- Branch names are prefixed with type (e.g., `feat/`, `fix/`, `test/`, `chore/`)
- Branch names start with the ticket number (e.g. `feat/FBMVP-1234-myFeature`, `feat/SVC-1234-myFeature`)

## Preferred Patterns

- Conventional commits
- Squash before merge

## Validation

- [ ] Commits are atomic
- [ ] Commit messages follow conventions
- [ ] No merge commits in main branches
- [ ] Pull requests reviewed and approved before merge
- [ ] Branches deleted after merge
- [ ] CI checks pass before merge
- [ ] No uncommitted changes before pushing
- [ ] Rebases used to keep branches up to date
- [ ] No force pushes to shared branches
- [ ] Tags used for releases
- [ ] Conflicts resolved before merging
- [ ] Branch names follow conventions
- [ ] No large binary files in commits
- [ ] No sensitive information in commit history
- [ ] Use feature branches for new work
- [ ] Use pull requests for code reviews
- [ ] Use gitignore to exclude unnecessary files
- [ ] Use stash for temporary changes
- [ ] Use hooks for pre-commit checks
