# Git Setup Guide

## Initial Setup

### 1. Initialize Git Repository
```bash
git init
```

### 2. Add All Files
```bash
git add .
```

### 3. Create Initial Commit
```bash
git commit -m "Initial commit: GelKrupa Electronics website"
```

### 4. Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `gelkrupa-electronics` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 5. Link to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/gelkrupa-electronics.git
```

### 6. Push to GitHub
```bash
# For first push
git branch -M main
git push -u origin main
```

## What Will Be Uploaded

✅ **Included in Git:**
- Source code (`src/`)
- Configuration files (`package.json`, `vite.config.js`, etc.)
- README and documentation
- Public assets (logo, placeholder images)
- Data files (`src/data/*.json`)

❌ **Excluded from Git (in .gitignore):**
- `node_modules/` - Dependencies (can be reinstalled)
- `dist/` - Build output (generated from source)
- `.env` - Environment variables (sensitive)
- `.kiro/` - Kiro AI files (optional)
- `public/uploads/` - Uploaded images (optional)
- `.vscode/` - Editor settings
- Log files and temporary files

## Important Notes

### About `public/uploads/`
Currently excluded from Git. If you want to include sample images:
1. Remove `public/uploads/` from `.gitignore`
2. Or create a `public/uploads/.gitkeep` file to track the folder

### About `.kiro/`
Contains Kiro AI spec files. If you want to include these:
1. Remove `.kiro/` from `.gitignore`

### About Lock Files
`package-lock.json` is currently included. This ensures consistent dependencies.

## Future Updates

### After Making Changes
```bash
# Check what changed
git status

# Add specific files
git add src/components/MyComponent.jsx

# Or add all changes
git add .

# Commit with message
git commit -m "Add new feature: XYZ"

# Push to GitHub
git push
```

### Create a New Branch
```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Push branch to GitHub
git push -u origin feature/new-feature
```

### Pull Latest Changes
```bash
git pull origin main
```

## Recommended .gitignore Adjustments

### If You Want to Track Uploads
Remove this line from `.gitignore`:
```
public/uploads/
```

### If You Want to Track Kiro Files
Remove this line from `.gitignore`:
```
.kiro/
```

### If You Want to Ignore Lock Files
Add these lines to `.gitignore`:
```
package-lock.json
yarn.lock
pnpm-lock.yaml
```

## Security Checklist Before Pushing

- [ ] No API keys or secrets in code
- [ ] Default admin password documented (to be changed in production)
- [ ] `.env` file is in `.gitignore`
- [ ] No sensitive customer data in JSON files
- [ ] No personal information in uploaded images

## After Pushing to GitHub

1. **Add Repository Description** on GitHub
2. **Add Topics/Tags**: `react`, `nodejs`, `ecommerce`, `electronics`, `mcb`
3. **Set Repository Visibility**: Public or Private
4. **Add Collaborators** if needed
5. **Enable GitHub Pages** if you want to host the site
6. **Set up GitHub Actions** for CI/CD (optional)

## Troubleshooting

### If you accidentally committed sensitive files:
```bash
# Remove from Git but keep locally
git rm --cached .env

# Commit the removal
git commit -m "Remove sensitive file"

# Push
git push
```

### If you need to change commit message:
```bash
# Change last commit message
git commit --amend -m "New commit message"

# Force push (only if not pushed yet or working alone)
git push --force
```

### If you want to start fresh:
```bash
# Remove Git history
rm -rf .git

# Start over
git init
```

---

**Ready to push to GitHub!** 🚀
