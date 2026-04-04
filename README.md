# TaskTogether

A multi-tenant volunteer platform connecting volunteers with seniors. Built with React, Tailwind CSS, and Supabase.

## Features

- 🏠 Multi-tenant senior home management
- 👥 Volunteer application & approval workflow
- 📅 Opportunity scheduling & management
- 📖 Story sharing system
- 🔐 Role-based authentication (Volunteers, Admins, Super Admins)
- 📧 Automated email notifications
- 📱 Fully responsive design

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS v4
- **Animation:** Framer Motion
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Routing:** React Router v7
- **Build Tool:** Vite
- **UI Components:** Radix UI, Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- Supabase account (free tier works)
- Resend account for email functionality (free tier works)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/tasktogether.git
cd tasktogether
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables (see Deployment section)

4. Start the development server:
```bash
pnpm dev
```

## Deployment to Vercel

### Step 1: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
2. Name it `tasktogether` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the commands shown under "push an existing repository from the command line"

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `tasktogether` repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`

5. **IMPORTANT:** Add Environment Variables (click "Environment Variables"):

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
```

6. Click "Deploy"

### Step 3: Get Your Environment Variables

#### Supabase Variables:
1. Go to your Supabase project dashboard (https://supabase.com/dashboard)
2. Click "Project Settings" (gear icon)
3. Go to "API" section
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

#### Resend API Key:
1. Go to https://resend.com/api-keys
2. Create a new API key
3. Copy it → `RESEND_API_KEY`

### Step 4: Configure Email Sender

In `/src/app/utils/emailService.ts`, update line 6:
```typescript
from: 'TaskTogether <onboarding@resend.dev>', // Change to your verified domain
```

**For production:** You need to verify a domain in Resend. Use `onboarding@resend.dev` for testing.

### Step 5: Deploy Supabase Edge Functions

The backend server needs to be deployed to Supabase:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
(Find YOUR_PROJECT_REF in Supabase project settings)

4. Deploy the edge function:
```bash
supabase functions deploy server
```

5. Set the environment secrets:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

## Post-Deployment Checklist

- [ ] Test volunteer registration flow
- [ ] Test admin login (default: admin@tasktogether.com / Admin123!)
- [ ] Test super admin login (default: superadmin@tasktogether.com / SuperAdmin123!)
- [ ] Verify email notifications are working
- [ ] Test senior home registration
- [ ] Test opportunity creation and volunteer assignment
- [ ] Test story submission and approval

## Default Login Credentials

**Super Admin:**
- Email: superadmin@tasktogether.com
- Password: SuperAdmin123!

**Senior Home Admin:**
- Email: admin@tasktogether.com
- Password: Admin123!

**⚠️ IMPORTANT:** Change these passwords immediately after first login in production!

## Environment Variables Reference

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret!) | Supabase Dashboard → Settings → API |
| `RESEND_API_KEY` | Resend API key for emails | Resend Dashboard → API Keys |

## Managing Example Data

The app includes example stories and opportunities for demonstration. To remove them:

1. **Stories:** Delete from the Stories management page (Super Admin)
2. **Opportunities:** Delete from Admin Dashboard → Opportunities
3. **For production builds:** Empty the arrays in:
   - `/src/app/context/StoriesContext.tsx` (MOCK_STORIES)
   - `/src/app/context/AppContext.tsx` (MOCK_OPPORTUNITIES)

See `/DEMO_DATA_GUIDE.md` for detailed instructions.

## Support

For questions or issues:
- Email: tasktogethercontact@gmail.com
- GitHub Issues: [Create an issue](https://github.com/YOUR_USERNAME/tasktogether/issues)

## Credits

Created by **i2 scholar Kaitlyn Cleaveland**

## License

MIT License - see LICENSE file for details

---

Made with ❤️ for connecting volunteers with seniors
