# CI/CD Setup Guide

This guide walks you through setting up the GitHub Actions CI/CD pipeline with Vercel deployment for the Trip Scanner frontend.

## Overview

The CI/CD pipeline includes:
- **Continuous Integration**: Build, type-check, and lint on every push/PR
- **Preview Deployments**: Automatic preview URLs for pull requests
- **Production Deployment**: Automatic deployment to Vercel on merge to master
- **Security Scanning**: Weekly security audits and dependency checks
- **Dependency Updates**: Automated dependency updates via Dependabot

## Prerequisites

- GitHub repository for the project
- Vercel account (sign up at https://vercel.com)
- Node.js 20+ installed locally
- Vercel CLI installed (`npm install -g vercel`)

## Step 1: Vercel Setup (5 minutes)

### 1.1 Install Vercel CLI

```bash
npm install -g vercel
``` 

### 1.2 Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### 1.3 Link Project

```bash
cd /Users/jalil/work/trip-scanner-frontend
vercel link
```

This command will:
- Ask you to select your Vercel scope (personal account or team)
- Create a new project or link to an existing one
- Generate a `.vercel/project.json` file with your project IDs

### 1.4 Configure Environment Variables in Vercel

```bash
# Production environment variable
vercel env add VITE_API_BASE_URL production
# When prompted, enter: https://trip-scanner-prod.herokuapp.com

# Preview environment variable (for PR previews)
vercel env add VITE_API_BASE_URL preview
# When prompted, enter: https://trip-scanner-staging.herokuapp.com
```

### 1.5 Get Vercel IDs

```bash
cat .vercel/project.json
```

You'll see output like:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxx"
}
```

**Save these IDs** - you'll need them for GitHub Secrets.

### 1.6 Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions - Trip Scanner"
4. Set scope to "Full Account"
5. Click "Create"
6. **Copy the token** - you'll need it for GitHub Secrets

## Step 2: GitHub Secrets Configuration (5 minutes)

### 2.1 Navigate to GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" tab
3. In the left sidebar, expand "Secrets and variables"
4. Click "Actions"

### 2.2 Add Required Secrets

Click "New repository secret" for each of the following:

| Secret Name | Value | How to Get It |
|-------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel token | From Step 1.6 above |
| `VERCEL_ORG_ID` | Your org ID | From `.vercel/project.json` (orgId field) |
| `VERCEL_PROJECT_ID` | Your project ID | From `.vercel/project.json` (projectId field) |
| `PRODUCTION_API_URL` | Backend production URL | Example: `https://trip-scanner-prod.herokuapp.com` |
| `PREVIEW_API_URL` | Backend staging URL (optional) | Example: `https://trip-scanner-staging.herokuapp.com` |

### 2.3 Verify Secrets

After adding all secrets, you should see them listed (values will be hidden).

## Step 3: Branch Protection Rules (5 minutes)

### 3.1 Create Branch Protection Rule

1. Go to repository Settings → Branches
2. Click "Add branch protection rule"
3. Enter "master" as the branch name pattern

### 3.2 Configure Protection Rules

Enable the following options:

- ☑ **Require a pull request before merging**
  - ☑ Require approvals: 1
  - ☑ Dismiss stale pull request approvals when new commits are pushed

- ☑ **Require status checks to pass before merging**
  - ☑ Require branches to be up to date before merging
  - Search and add these status checks:
    - `Quality Checks (ubuntu-latest, 20.x)`
    - `Quality Checks (ubuntu-latest, 22.x)`

- ☑ **Require conversation resolution before merging**

- ☑ **Do not allow bypassing the above settings**

Click "Create" to save the rule.

## Step 4: GitHub Environment Setup (5 minutes)

### 4.1 Create Production Environment

1. Go to repository Settings → Environments
2. Click "New environment"
3. Name: `production`
4. Click "Configure environment"

### 4.2 Configure Environment Protection Rules (Optional)

For additional safety, you can add:
- Required reviewers (1 person must approve deployments)
- Wait timer (delay before deployment starts)

### 4.3 Set Deployment Branch

- Under "Deployment branches", select "Selected branches"
- Add `master` as the only allowed branch

Click "Save protection rules".

## Step 5: Verification (10 minutes)

### 5.1 Create Test Branch

```bash
git checkout -b test/ci-pipeline
```

### 5.2 Make a Small Change

```bash
echo "# CI/CD Pipeline Setup Complete" >> CI_CD_SETUP.md
git add CI_CD_SETUP.md
git commit -m "test: Verify CI/CD pipeline"
```

### 5.3 Push and Create Pull Request

```bash
git push origin test/ci-pipeline
```

Then:
1. Go to GitHub and create a Pull Request
2. Verify that the CI workflow runs automatically
3. Verify that the Preview Deployment workflow runs
4. Check for a comment on the PR with the preview URL
5. Click the preview URL to test the deployment

### 5.4 Merge and Verify Production Deployment

1. Once all checks pass, merge the Pull Request
2. Go to Actions tab and watch the "Production Deployment" workflow
3. Verify it completes successfully
4. Check the deployment summary in the workflow run
5. Visit your production URL to confirm the site is live

## Step 6: First Manual Deployment (Optional)

If you want to trigger a deployment immediately:

```bash
# Push directly to master (if branch protection allows)
git checkout master
git pull
git push

# Or manually trigger via GitHub Actions UI:
# 1. Go to Actions tab
# 2. Select "Production Deployment" workflow
# 3. Click "Run workflow"
# 4. Select "master" branch
# 5. Click "Run workflow"
```

## Workflow Triggers

### CI Workflow (`.github/workflows/ci.yml`)
**Triggers:**
- Every push to any branch
- Pull requests to master, main, or develop

**Actions:**
- Type checking with TypeScript
- Linting with ESLint
- Build verification
- Bundle size reporting

**Duration:** ~2-5 minutes

### Preview Deployment (`.github/workflows/preview.yml`)
**Triggers:**
- Pull requests opened, updated, or reopened to master/main

**Actions:**
- Quality checks (type check + lint)
- Deploy to Vercel preview environment
- Post comment with preview URL

**Duration:** ~3-7 minutes

### Production Deployment (`.github/workflows/production.yml`)
**Triggers:**
- Pushes to master branch
- Manual trigger via GitHub Actions UI

**Actions:**
- Full quality checks
- Deploy to Vercel production
- Create deployment summary
- Create issue on failure

**Duration:** ~3-7 minutes

### Security Scan (`.github/workflows/security.yml`)
**Triggers:**
- Pushes to master/main
- Pull requests to master/main
- Weekly schedule (Sundays at midnight)
- Manual trigger

**Actions:**
- npm audit for vulnerabilities
- Check for outdated packages
- Generate security report

**Duration:** ~1-3 minutes

## Troubleshooting

### Issue: Workflow fails with "VERCEL_TOKEN not found"

**Solution:**
1. Go to Settings → Secrets → Actions
2. Verify that `VERCEL_TOKEN` exists
3. If missing, add it with the token from https://vercel.com/account/tokens

### Issue: Preview deployment succeeds but shows old backend URL

**Solution:**
```bash
# Update Vercel environment variable
vercel env add VITE_API_BASE_URL preview
# Enter the correct staging backend URL

# Or update in Vercel dashboard:
# Project Settings → Environment Variables → Edit VITE_API_BASE_URL (Preview)
```

### Issue: Build fails with type checking errors

**Solution:**
```bash
# Run locally to see errors
npm run build

# Fix TypeScript errors
npx tsc -b

# Commit and push fixes
git add .
git commit -m "fix: Resolve type checking errors"
git push
```

### Issue: Status checks not showing in PR

**Solution:**
1. Verify workflows are committed to `.github/workflows/` directory
2. Check that workflow YAML syntax is valid
3. Look for workflow run errors in the Actions tab
4. Ensure branch protection rules include the correct check names

### Issue: Vercel deployment succeeds but site shows 404

**Solution:**
1. Check `vercel.json` has the rewrite rule for SPA routing:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
2. Redeploy after fixing

## Rollback Procedures

### Option 1: Vercel Dashboard Rollback (30 seconds)

1. Go to https://vercel.com
2. Select your project
3. Click "Deployments" tab
4. Find the previous successful deployment
5. Click "..." menu
6. Click "Promote to Production"

### Option 2: Git Revert (5 minutes)

```bash
# Find the bad commit
git log --oneline -n 10

# Revert it (creates new commit)
git revert <commit-sha>

# Push to trigger redeployment
git push origin master
```

### Option 3: Vercel CLI Rollback (1 minute)

```bash
# List deployments
vercel ls

# Promote a specific deployment
vercel promote <deployment-url>
```

## Monitoring

### GitHub Actions

Monitor workflow runs:
- Go to repository → Actions tab
- View recent workflow runs
- Check success rate and duration
- Download logs for failed runs

### Vercel Dashboard

Monitor deployments:
- Go to https://vercel.com
- Select your project
- View deployment history
- Check build logs
- Monitor performance metrics

### Dependabot

Monitor dependency updates:
- Go to repository → Security → Dependabot
- Review open pull requests
- Approve and merge updates weekly

## Cost

### Vercel
- **Hobby Plan**: Free
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Perfect for personal projects

### GitHub Actions
- **Public Repository**: Free unlimited minutes
- **Private Repository**: 2,000 minutes/month free
  - This CI/CD uses ~5-8 minutes per deployment
  - ~250-400 deployments/month within free tier

## Next Steps

1. ✅ Set up Vercel account and link project
2. ✅ Configure GitHub Secrets
3. ✅ Add branch protection rules
4. ✅ Create production environment
5. ✅ Verify with test PR
6. ⏭️ Set up backend CI/CD (separate repository)
7. ⏭️ Configure monitoring (Sentry, etc.)
8. ⏭️ Add tests and update CI workflow

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review workflow logs in GitHub Actions
3. Check Vercel deployment logs
4. Refer to the main CI/CD plan: `/Users/jalil/.claude/plans/deep-leaping-hamster.md`

## Files Created

This setup created the following files:
- `.github/workflows/ci.yml` - CI checks
- `.github/workflows/preview.yml` - PR preview deployments
- `.github/workflows/production.yml` - Production deployments
- `.github/workflows/security.yml` - Security scanning
- `.github/dependabot.yml` - Automated dependency updates
- `vercel.json` - Vercel deployment configuration
- `CI_CD_SETUP.md` - This setup guide (you are here)

All workflows are production-ready and follow GitHub Actions and Vercel best practices.
