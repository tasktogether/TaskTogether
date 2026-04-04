# 🌐 TaskTogether Domain Setup Guide

## Quick Start Checklist

- [ ] Purchase domain
- [ ] Get DNS records from Resend
- [ ] Add DNS records to your domain provider
- [ ] Verify domain in Resend
- [ ] Update server code with your custom domain
- [ ] Test email sending

---

## Step 1: Purchase Your Domain

### Recommended Domain Options:
1. **tasktogether.org** (~$12/year) - Best for non-profits
2. **tasktogether.com** (~$12/year) - Most common
3. **tasktogether.app** (~$15/year) - Modern feel

### Where to Buy:

#### Option A: Namecheap (Recommended)
1. Go to https://www.namecheap.com/
2. Search for "tasktogether.org" (or .com, .app)
3. Add to cart → Create account → Pay
4. **Keep this tab open** - you'll need it for DNS setup

#### Option B: Cloudflare Registrar
1. Go to https://www.cloudflare.com/
2. Create account → Domain Registration
3. Search & purchase domain
4. DNS management is automatic and free

#### Option C: Google Domains
1. Go to https://domains.google/
2. Search & purchase domain
3. Simple DNS management interface

---

## Step 2: Set Up Email Sending with Resend

### A. Add Domain to Resend

1. Log into https://resend.com/
2. Click **Domains** in left sidebar
3. Click **+ Add Domain**
4. Enter your domain (e.g., `tasktogether.org`)
5. Click **Add**

### B. Copy DNS Records

Resend will show you 4 DNS records. **Copy each one** - you'll add them to your domain provider.

**Example records** (yours will be different):

```
Record 1: Domain Verification
Type: TXT
Name: @ (or root)
Value: resend-domain-verify=abc123xyz456...

Record 2: SPF (Spam Prevention)
Type: TXT
Name: @ (or root)
Value: v=spf1 include:spf.resend.com ~all

Record 3: DKIM (Email Signing)
Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com

Record 4: Email Bounce Handling
Type: MX
Name: @ (or root)
Value: feedback-smtp.resend.com
Priority: 10
```

---

## Step 3: Add DNS Records to Your Domain

### For Namecheap:

1. Go to **Dashboard** → **Domain List**
2. Click **Manage** next to your domain
3. Go to **Advanced DNS** tab
4. Click **Add New Record** for each record:

**TXT Records (add 2):**
```
Type: TXT Record
Host: @
Value: [paste from Resend]
TTL: Automatic
```

**CNAME Record:**
```
Type: CNAME Record
Host: resend._domainkey
Value: resend._domainkey.resend.com
TTL: Automatic
```

**MX Record:**
```
Type: MX Record
Host: @
Value: feedback-smtp.resend.com
Priority: 10
TTL: Automatic
```

5. Click **Save All Changes**

---

### For Cloudflare:

1. Dashboard → Select your domain
2. Click **DNS** → **Records**
3. Click **+ Add record** for each:

**TXT Records:**
```
Type: TXT
Name: @ (leave as @)
Content: [paste value]
Proxy status: DNS only (gray cloud)
TTL: Auto
```

**CNAME Record:**
```
Type: CNAME
Name: resend._domainkey
Target: resend._domainkey.resend.com
Proxy status: DNS only
TTL: Auto
```

**MX Record:**
```
Type: MX
Name: @
Mail server: feedback-smtp.resend.com
Priority: 10
TTL: Auto
```

---

### For Google Domains:

1. Go to **My domains**
2. Click **DNS** next to your domain
3. Scroll to **Custom resource records**
4. Add each record:

**TXT Records:**
```
Name: @ (leave blank)
Type: TXT
TTL: 1H
Data: [paste value]
```

**CNAME Record:**
```
Name: resend._domainkey
Type: CNAME
TTL: 1H
Data: resend._domainkey.resend.com
```

**MX Record:**
```
Name: @ (leave blank)
Type: MX
TTL: 1H
Data: 10 feedback-smtp.resend.com
```

---

## Step 4: Verify Domain in Resend

1. **Wait 10-15 minutes** for DNS propagation
2. Go back to Resend → **Domains**
3. Click **Verify** button next to your domain
4. If it fails, wait another 15 minutes and try again
5. When successful, you'll see a ✅ green checkmark

**Troubleshooting:**
- DNS can take up to 48 hours (usually 15-30 mins)
- Make sure you copied values exactly (no extra spaces)
- Check you're editing the correct domain
- Try the "Check DNS" tool: https://mxtoolbox.com/

---

## Step 5: Update Your Code

Once your domain is verified, update the email sender in your server code:

### Update `/supabase/functions/server/index.tsx`

Find this line (around line 229):
```typescript
from: 'TaskTogether <tasktogethercontact@gmail.com>',
```

Replace with:
```typescript
from: 'TaskTogether <noreply@tasktogether.org>',
```

**Or use these email addresses:**
- `noreply@tasktogether.org` - For automated emails
- `hello@tasktogether.org` - For general contact
- `support@tasktogether.org` - For support emails
- `admin@tasktogether.org` - For admin notifications

You can create multiple email addresses on your domain - they all work!

---

## Step 6: Test Email Sending

1. Go to your TaskTogether app
2. Register a new volunteer account
3. As an admin, approve the volunteer
4. Check if the email arrives
5. ✅ Success! Your custom domain emails are working

---

## Common Issues & Fixes

### ❌ "DNS records not found"
**Fix:** Wait longer (up to 1 hour), then verify again

### ❌ "Invalid DNS record"
**Fix:** 
- Remove quotes around TXT values
- Use `@` for root domain records
- Remove trailing dots from values

### ❌ "Domain not verified"
**Fix:** All 4 records must be added correctly. Double-check each one.

### ❌ "Email bouncing"
**Fix:** Make sure MX record has priority 10 and correct value

---

## After Setup is Complete

### Update Contact Info
Update these places with your new email:
- Footer (already shows `tasktogethercontact@gmail.com`)
- Contact forms
- About page
- Support documentation

### Professional Email Setup (Optional)
You can also:
1. Set up `hello@tasktogether.org` to forward to your Gmail
2. Create `admin@tasktogether.org` for admin correspondence
3. Use `support@tasktogether.org` for help requests

---

## Cost Breakdown

- **Domain**: $12-15/year
- **Resend**: FREE for 3,000 emails/month, then $20/mo for 50k emails
- **DNS**: FREE with Cloudflare, included with most registrars

**Total**: ~$12-15/year for small-scale operation

---

## Need Help?

If you get stuck:
1. Check DNS propagation: https://dnschecker.org/
2. Verify MX records: https://mxtoolbox.com/
3. Resend docs: https://resend.com/docs/dashboard/domains/introduction
4. Contact Resend support: https://resend.com/support

---

## Once You Have Your Domain

**Tell me which domain you purchased** and I'll:
1. ✅ Update the email sender to match your domain
2. ✅ Update any hardcoded contact emails
3. ✅ Give you the exact DNS records to copy/paste
4. ✅ Help troubleshoot if verification fails

**Good luck! 🚀**
