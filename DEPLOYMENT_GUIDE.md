# 🚀 Quick Deployment Checklist

Follow these steps in order to deploy TaskTogether to production.

## ✅ Pre-Deployment (Do Once)

### 1. GitHub Setup
- [ ] Go to https://github.com/new
- [ ] Repository name: `tasktogether`
- [ ] Make it **Public** or **Private** (your choice)
- [ ] **DO NOT** check "Add a README file"
- [ ] **DO NOT** check "Add .gitignore"
- [ ] Click "Create repository"
- [ ] **COPY** the commands shown on the next page (you'll need them)

Example commands you'll see:
```bash
git remote add origin https://github.com/YOUR_USERNAME/tasktogether.git
git branch -M main
git push -u origin main
```

### 2. Get Your Supabase Credentials
- [ ] Go to https://supabase.com/dashboard
- [ ] Select your project
- [ ] Click ⚙️ **Settings** (bottom left)
- [ ] Click **API** in the sidebar
- [ ] **Copy these values** (keep them somewhere safe):
  - Project URL (looks like: `https://xxxxx.supabase.co`)
  - `anon` `public` key (long string starting with `eyJ...`)
  - `service_role` `secret` key (longer string, also starts with `eyJ...`)

### 3. Get Your Resend API Key
- [ ] Go to https://resend.com/api-keys
- [ ] Click "Create API Key"
- [ ] Name: "TaskTogether Production"
- [ ] Permission: "Sending access"
- [ ] Click "Add"
- [ ] **COPY the API key** (you can't see it again!)

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

You'll need to run these commands in your local project folder. If you're using Figma Make, you may need to download the code first.

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TaskTogether platform"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/tasktogether.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - [ ] Visit https://vercel.com/new
   - [ ] Sign in with your Vercel account
   - [ ] Click "Import Git Repository"

2. **Import Repository**
   - [ ] Find `tasktogether` in the list
   - [ ] Click "Import"

3. **Configure Project**
   - [ ] Framework Preset: **Vite** (should auto-detect)
   - [ ] Root Directory: `./` (leave as is)
   - [ ] Build Command: `pnpm build` (should auto-fill)
   - [ ] Output Directory: `dist` (should auto-fill)
   - [ ] Install Command: `pnpm install` (should auto-fill)

4. **Add Environment Variables**
   Click "Environment Variables" and add these **4 variables**:

   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | Paste your Supabase Project URL |
   | `SUPABASE_ANON_KEY` | Paste your Supabase anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Paste your Supabase service_role key |
   | `RESEND_API_KEY` | Paste your Resend API key |

   **⚠️ IMPORTANT:** Make sure there are no extra spaces when pasting!

5. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait 2-3 minutes for build to complete
   - [ ] 🎉 Your site is live!

### Step 3: Deploy Backend (Supabase Edge Function)

The backend server needs to be deployed separately:

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```
   This will open a browser window for authentication.

3. **Find Your Project Reference**
   - Go to Supabase Dashboard → Project Settings → General
   - Copy the "Reference ID" (looks like `abcdefghijk`)

4. **Link Your Project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   Replace `YOUR_PROJECT_REF` with the Reference ID you copied.

5. **Deploy the Function**
   ```bash
   supabase functions deploy server
   ```

6. **Set Environment Secrets**
   ```bash
   supabase secrets set RESEND_API_KEY=your_resend_api_key_here
   ```

## 🧪 Testing Your Deployment

### Test These Features:

1. **Homepage**
   - [ ] Visit your Vercel URL (looks like `https://tasktogether-xxx.vercel.app`)
   - [ ] Check that the homepage loads correctly
   - [ ] Click around the navigation

2. **Volunteer Registration**
   - [ ] Go to "Get Started" → "Volunteer Registration"
   - [ ] Fill out the form
   - [ ] Submit and check for success message

3. **Admin Login**
   - [ ] Go to "Login" → "Admin Login"
   - [ ] Use: `admin@tasktogether.com` / `Admin123!`
   - [ ] Check that dashboard loads

4. **Super Admin Login**
   - [ ] Go to "Login" → "Admin Login"  
   - [ ] Use: `superadmin@tasktogether.com` / `SuperAdmin123!`
   - [ ] Check that super admin dashboard loads
   - [ ] Try approving a senior home registration

5. **Email Testing**
   - [ ] Approve a volunteer from admin dashboard
   - [ ] Check if email is sent (check spam folder too)

## 🔧 Common Issues & Solutions

### "Build Failed" on Vercel
- Check that all environment variables are set correctly
- Make sure there are no typos in variable names
- Verify the build command is `pnpm build`

### "Function Not Found" Error
- Make sure you deployed the Supabase edge function
- Check that the function is named `make-server-1a1315c2`
- Run `supabase functions list` to verify

### Emails Not Sending
- Verify your `RESEND_API_KEY` is correct
- Check Resend dashboard for error logs
- For production, verify a domain in Resend

### Can't Login as Admin
- The default credentials are stored in `/utils/supabase/info.tsx`
- Try the Super Admin credentials first
- Check browser console for errors

## 📝 Post-Deployment Tasks

- [ ] **Change default passwords** for admin accounts
- [ ] **Test all major features** (registration, approval, opportunities)
- [ ] **Delete example data** once you have real data (see `/DEMO_DATA_GUIDE.md`)
- [ ] **Set up custom domain** in Vercel (optional)
- [ ] **Configure email domain** in Resend for production emails
- [ ] **Set up monitoring** to track errors (Vercel provides this)

## 🎯 Next Steps

1. **Share your link** with beta testers
2. **Monitor the Vercel dashboard** for errors
3. **Check Supabase logs** for backend issues
4. **Collect feedback** and iterate

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Resend Docs:** https://resend.com/docs
- **Email Support:** tasktogethercontact@gmail.com

---

**Good luck with your deployment! 🚀**

*Created by i2 scholar Kaitlyn Cleaveland*
