# Pre-Commit Review Checklist

## Overview
Before committing changes, inspect your working tree to catch accidental modifications, debug code, or unintended files. This brief checklist helps ensure clean, intentional commits.

## Quick Review Process

### 1. Check Working Tree Status
```bash
git status
```

**Look for:**
- Untracked files that shouldn't be committed (build artifacts, IDE configs, secrets)
- Modified files you didn't intend to change
- Staged vs. unstaged changes

### 2. Review the Diff
```bash
git diff
```

**Inspect for:**
- **Debug code:** `console.log()`, `debugger`, temporary test data
- **Commented code:** Remove rather than comment out
- **Whitespace changes:** Unnecessary trailing spaces or blank line changes
- **Secrets:** API keys, tokens, passwords, or sensitive data
- **Accidental changes:** Files modified by IDE auto-formatting or refactoring tools
- **TODO comments:** Ensure they're intentional and tracked

### 3. Review Staged Changes
```bash
git diff --staged
```

Verify exactly what will be included in the commit.

## Best Practices

- **Commit small, focused changes** — One logical change per commit
- **Review before staging** — Catch issues before `git add`
- **Use `.gitignore`** — Prevent common accidental commits
- **Read your own diff** — Fresh eyes catch mistakes
- **Test before committing** — Run `npm test` or `npm run lint` if applicable

## Common Pitfalls

❌ **Don't commit:**
- `node_modules/` or other dependencies
- `.env` files with secrets
- IDE-specific files (`.vscode/`, `.idea/`)
- Build outputs (`dist/`, `coverage/`)
- Personal notes or scratch files
- Merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)

## Integration with CI/CD

Remember that commits to `main` trigger automatic deployment. Always review changes carefully before pushing to ensure:
- Tests pass locally (`npm test`)
- Linting passes (`npm run lint`)
- No breaking changes are introduced

## Quick Reference

```bash
# Full review workflow
git status                  # What's changed?
git diff                    # Review unstaged changes
git add <files>             # Stage intentional changes
git diff --staged           # Review what will be committed
git commit -m "message"     # Commit with clear message
```

---

**Remember:** A few seconds of review prevents hours of debugging and rollback work later.
