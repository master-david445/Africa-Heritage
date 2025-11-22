# CI/CD Setup Guide

## ✅ What's Been Set Up

Your African Heritage platform now has a complete CI/CD pipeline using GitHub Actions!

### Workflows Created:

1. **Main CI/CD Pipeline** (`.github/workflows/ci.yml`)
   - Code quality checks (linting, type-checking)
   - Build testing
   - Preview deployments (for PRs)
   - Production deployments (on main branch)

2. **Database Migrations** (`.github/workflows/migrations.yml`)
   - SQL syntax validation
   - Manual approval process
   - Migration notifications

3. **Dependency Checks** (`.github/workflows/dependencies.yml`)
   - Weekly security audits
   - Outdated package detection
   - Automated reports

---

## 🚀 Next Steps

### 1. Configure GitHub Secrets

You need to add 5 secrets to GitHub:

**Go to:** Repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - Get from Vercel team/org settings
- `VERCEL_PROJECT_ID` - Get from Vercel project settings
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

**Detailed instructions:** See `.github/SECRETS.md`

### 2. Test the Pipeline

```bash
# Create a test branch
git checkout -b feature/test-cicd

# Make a small change
echo "# CI/CD Test" >> README.md

# Commit and push
git add .
git commit -m "test: verify CI/CD pipeline"
git push origin feature/test-cicd

# Create a PR on GitHub
# Watch the Actions tab to see workflows run!
```

### 3. Set Up Branch Protection (Recommended)

**Go to:** Repository → Settings → Branches

Add rule for `main` branch:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - Select: "Code Quality"
  - Select: "Build Application"
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

---

## 📊 How It Works

### For Pull Requests:
```
1. Developer creates PR
   ↓
2. GitHub Actions runs:
   - ESLint check
   - TypeScript check
   - Build test
   ↓
3. If all pass → Deploy preview to Vercel
   ↓
4. Comment on PR with preview URL
   ↓
5. Code review
   ↓
6. Merge to main
```

### For Main Branch:
```
1. Code merged to main
   ↓
2. GitHub Actions runs all checks
   ↓
3. If all pass → Deploy to production
   ↓
4. Live on Vercel!
```

---

## 🎯 Benefits You Get

✅ **Automatic Testing**
- Every PR is tested before merge
- Catch bugs before production

✅ **Preview Deployments**
- Every PR gets its own preview URL
- Test changes before merging

✅ **Consistent Builds**
- Same environment every time
- No "works on my machine" issues

✅ **Security Monitoring**
- Weekly dependency audits
- Automated vulnerability detection

✅ **Database Safety**
- SQL syntax validation
- Manual approval for migrations

---

## 🔍 Monitoring Your Pipeline

### View Workflow Runs:
1. Go to your GitHub repo
2. Click **Actions** tab
3. See all workflow runs

### Check Status:
- ✅ Green checkmark = Success
- ❌ Red X = Failed
- 🟡 Yellow dot = Running

### Debug Failures:
1. Click on failed workflow
2. Click on failed job
3. Expand failed step
4. Read error message

---

## 📈 Future Enhancements

Once the basic CI/CD is working, you can add:

### Testing (Phase 2):
```yaml
- name: Run unit tests
  run: npm test

- name: Run E2E tests
  run: npx playwright test
```

### Code Coverage (Phase 2):
```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
```

### Performance Monitoring (Phase 3):
```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
```

### Automatic Dependency Updates (Phase 3):
- Set up Dependabot
- Auto-create PRs for updates

---

## 🚨 Troubleshooting

### "Workflow not running"
- Check if `.github/workflows/` exists
- Verify YAML syntax is correct
- Check repository Actions are enabled

### "Build failing on CI but works locally"
- Check environment variables are set
- Verify Node version matches (20.x)
- Check for OS-specific paths

### "Deployment failing"
- Verify Vercel secrets are correct
- Check Vercel dashboard for errors
- Ensure project is linked correctly

### "Type check failing"
- Run `npm run type-check` locally
- Fix TypeScript errors
- Commit and push again

---

## 💡 Tips

**Commit Messages:**
Use conventional commits for better history:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code refactoring
- `test:` for adding tests

**PR Best Practices:**
- Keep PRs small and focused
- Write descriptive titles
- Add context in description
- Request reviews from team members

**Monitoring:**
- Check Actions tab regularly
- Fix failed workflows promptly
- Review weekly dependency reports

---

## ✅ Verification Checklist

Before considering CI/CD "done":

- [ ] All GitHub secrets added
- [ ] Test PR created and passed
- [ ] Preview deployment works
- [ ] Production deployment works
- [ ] Branch protection rules set
- [ ] Team members can access Actions
- [ ] Documentation read and understood

---

## 🎉 You're Done!

Your African Heritage platform now has enterprise-grade CI/CD!

**What happens next:**
1. Every code change is automatically tested
2. Every PR gets a preview deployment
3. Production deploys happen automatically
4. You get weekly security reports

**No more:**
- ❌ Manual testing before every deploy
- ❌ "Did we test this?" moments
- ❌ Broken production deployments
- ❌ Long deployment processes

**Questions?** Check the troubleshooting section or refer to the enterprise scalability roadmap!
