# GitHub Secrets Required for CI/CD

This document lists all the GitHub secrets you need to configure for the CI/CD pipeline to work.

## Required Secrets

### Vercel Deployment

1. **VERCEL_TOKEN**
   - **Description:** Vercel authentication token
   - **How to get:**
     1. Go to https://vercel.com/account/tokens
     2. Click "Create Token"
     3. Give it a name (e.g., "GitHub Actions")
     4. Copy the token

2. **VERCEL_ORG_ID**
   - **Description:** Your Vercel organization/team ID
   - **How to get:**
     1. Go to https://vercel.com/[your-username]/settings
     2. Look for "Team ID" or "Organization ID"
     3. Copy the ID (format: `team_xxxxx` or similar)

3. **VERCEL_PROJECT_ID**
   - **Description:** Your project's unique ID
   - **How to get:**
     1. Go to your project settings in Vercel
     2. Look for "Project ID" in the General tab
     3. Copy the ID

### Supabase (Build-time)

4. **NEXT_PUBLIC_SUPABASE_URL**
   - **Description:** Your Supabase project URL
   - **Example:** `https://xxxxx.supabase.co`
   - **Where:** Supabase Dashboard → Settings → API

5. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - **Description:** Public anonymous key for Supabase
   - **Where:** Supabase Dashboard → Settings → API → Project API keys

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:
   - Name: (e.g., `VERCEL_TOKEN`)
   - Value: (paste the token/ID)
5. Click **Add secret**

## Verification Checklist

After adding all secrets, verify:

- [ ] VERCEL_TOKEN is set
- [ ] VERCEL_ORG_ID is set
- [ ] VERCEL_PROJECT_ID is set
- [ ] NEXT_PUBLIC_SUPABASE_URL is set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is set

## Testing the Setup

1. Push a commit to a `feature/test` branch
2. Create a pull request
3. Check the "Actions" tab in GitHub
4. Verify all workflow jobs pass

## Troubleshooting

### "Vercel token is invalid"
- Regenerate the token in Vercel
- Update the `VERCEL_TOKEN` secret

### "Build failed: Missing environment variables"
- Check that Supabase secrets are set correctly
- Verify the values are correct (no extra spaces)

### "Deployment failed"
- Check Vercel dashboard for detailed errors
- Verify project ID is correct
- Ensure your Vercel account has permissions

## Security Notes

- **Never** commit secrets to the repository
- **Never** log secrets in workflow runs
- **Rotate** tokens periodically (every 6 months)
- **Use** environment protection for production deployments
