# Common Workflows
## African Heritage Platform

Quick reference for common development tasks.

---

## 🚀 Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/feature-name

# 2. Make changes
# ... code ...

# 3. Test locally
npm run dev
# Test manually in browser

# 4. Run build test
npm run build

# 5. Commit
git add .
git commit -m "feat: add feature-name"

# 6. Push and create PR
git push origin feature/feature-name
# Create PR on GitHub
```

---

## 🗄️ Database Migration Workflow

```bash
# 1. Create migration file
# Create new file in scripts/ directory
# scripts/00X_migration_name.sql

# 2. Write migration
"""sql
-- Add new column
ALTER TABLE table_name ADD COLUMN new_column TYPE;

-- Create index
CREATE INDEX idx_table_column ON table_name(column);

-- Update RLS policies
CREATE POLICY "policy_name"
  ON table_name
  FOR SELECT
  TO authenticated
  USING (condition);
"""

# 3. Test in local Supabase
# Apply via Supabase dashboard SQL editor

# 4. Document migration
# Add to migration log

# 5. Apply to production
# Run via Supabase dashboard or CLI
```

---

## 🐛 Fixing a Bug

```bash
# 1. Create hotfix branch
git checkout -b hotfix/bug-description

# 2. Reproduce bug
# ... verify bug exists ...

# 3. Fix bug
# ... code changes ...

# 4. Test fix
npm run dev
# Verify bug is fixed

# 5. Run build
npm run build

# 6. Commit and push

```bash
git commit -m "fix: resolve bug-description"
git push origin hotfix/bug-description
```

# 7. Deploy (after PR approval)
```

---

## 🧪 Testing Workflow

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# E2E tests
npx playwright test

# E2E tests in UI mode
npx playwright test --ui
```

---

## 📦 Deployment Workflow

```bash
# Staging deployment
git push origin staging
# Auto-deploys to Vercel staging

# Production deployment
git checkout main
git merge staging
git push origin main
# Auto-deploys to Vercel production

# Manual deployment (if needed)
vercel --prod
```

---

## 🔄 Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all packages (minor/patch)
npm update

# Update to latest (major versions)
npm install package-name@latest

# After updates, test
npm run build
npm run dev
```

---

## 📊 Monitoring & Debugging

```bash
# View Vercel logs
vercel logs

# View Supabase logs
# Go to Supabase Dashboard → Logs

# View Sentry errors
# Go to Sentry Dashboard

# Check build status
vercel inspect [deployment-url]
```

---

## 🔐 Environment Variables

```bash
# Local (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Vercel (via dashboard or CLI)
vercel env add VARIABLE_NAME
vercel env pull # Download to local
```

---

## 🎨 Component Creation

```typescript
// 1. Create component file
// components/my-component.tsx

'use client'

import { useState } from 'react'

interface MyComponentProps {
  // Props
}

export function MyComponent({ }: MyComponentProps) {
  // Component logic
  
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// 2. Export (if needed)
export default MyComponent

// 3. Use component
import MyComponent from '@/components/my-component'
```

---

## 🔧 Troubleshooting Common Issues

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build

# Clear node_modules
rm -rf node_modules
npm install
```

### Database Connection Issues

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test connection
# Create test API route
```

### Styling Not Loading

```bash
# Restart dev server
# Check next.config.mjs
# Clear browser cache
```

---

**Last Updated:** 2025-11-22
