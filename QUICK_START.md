# 🎯 Simple 3-Step Deployment

## Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: **tasktogether**
3. Leave everything else unchecked
4. Click **"Create repository"**
5. **SAVE the commands shown** - you'll need them!

---

## Step 2: Deploy to Vercel (5 minutes)

### A. Import Your Code
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **tasktogether**
4. Click **"Import"**

### B. Add Environment Variables

Click **"Environment Variables"** and add these 4 variables:

**Get from Supabase** (https://supabase.com → Your Project → Settings → API):
```
SUPABASE_URL = [Your Project URL]
SUPABASE_ANON_KEY = [Your anon public key]
SUPABASE_SERVICE_ROLE_KEY = [Your service_role secret key]
```

**Get from Resend** (https://resend.com/api-keys → Create API Key):
```
RESEND_API_KEY = [Your Resend API key]
```

### C. Deploy
Click **"Deploy"** and wait 2-3 minutes ✨

---

## Step 3: Deploy Backend (5 minutes)

Open your terminal/command line:

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link project (get YOUR_PROJECT_REF from Supabase Settings → General)
supabase link --project-ref YOUR_PROJECT_REF

# 4. Deploy function
supabase functions deploy server

# 5. Set email secret
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

---

## ✅ You're Done!

Your app is now live at: `https://tasktogether-xxx.vercel.app`

### Test It:
- Visit your Vercel URL
- Try logging in as admin: `admin@tasktogether.com` / `Admin123!`
- Register a volunteer
- Create an opportunity

---

## 🆘 Quick Troubleshooting

**Build failed on Vercel?**
- Double-check environment variables (no extra spaces!)
- Make sure Framework is set to "Vite"

**Backend not working?**
- Make sure you ran `supabase functions deploy server`
- Check Supabase Functions logs for errors

**Emails not sending?**
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for delivery status

---

## 📚 Full Guides Available:
- `/README.md` - Complete project documentation
- `/DEPLOYMENT_GUIDE.md` - Detailed step-by-step deployment
- `/DEMO_DATA_GUIDE.md` - Managing example data

**Need help?** Email: tasktogethercontact@gmail.com

*Created by i2 scholar Kaitlyn Cleaveland* 🌟
