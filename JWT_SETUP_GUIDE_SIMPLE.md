# 🚀 Complete Domain Transfer & JWT Setup Guide

## What We're Doing
Setting up the PERFECT architecture:
- **Frontend**: Vercel (Next.js) with `floradistro.com` domain
- **Backend**: Proper WordPress hosting with JWT authentication
- **Result**: Fast, professional, fully working site

---

## 🏗️ PHASE 1: Set Up New WordPress Hosting

### Step 1: Choose & Sign Up for Hosting
1. **Go to SiteGround.com** (recommended)
2. **Click "WordPress Hosting"**
3. **Choose "StartUp" plan** ($3.99/month)
4. **Enter domain**: `floradistro.com` (we'll configure this later)
5. **Complete signup and payment**

### Step 2: Request WordPress Migration
1. **In SiteGround dashboard, find "Migrator Tool"**
2. **Choose "WordPress.com Migration"**
3. **Enter your current site**: `https://distropass.wpcomstaging.com`
4. **Provide WordPress.com login credentials**
5. **Click "Start Migration"**
6. **Wait 24-48 hours for completion**

✅ **You'll get an email when migration is complete**

---

## 🌐 PHASE 2: Domain Configuration

### Step 1: Set Up Subdomain for WordPress
1. **In SiteGround cPanel, go to "Subdomains"**
2. **Create subdomain**: `api.floradistro.com`
3. **Point it to your WordPress installation**

### Step 2: Transfer Domain from Squarespace
1. **In Squarespace, go to Settings > Domains**
2. **Find `floradistro.com` and click "Transfer Domain"**
3. **Get transfer authorization code**
4. **In SiteGround, go to "Domain Registration"**
5. **Choose "Transfer Domain"**
6. **Enter `floradistro.com` and auth code**
7. **Complete transfer process** (takes 5-7 days)

### Step 3: Configure DNS
While transfer is processing:
1. **In Squarespace DNS settings for `floradistro.com`**:
   - **A Record**: `@` → Vercel IP (get from Vercel dashboard)
   - **CNAME**: `api` → your SiteGround server
2. **In Vercel dashboard**:
   - **Add domain**: `floradistro.com`
   - **Add domain**: `www.floradistro.com`

---

## 🔌 PHASE 3: WordPress JWT Setup

### Step 1: Install JWT Plugin
1. **Go to**: `https://api.floradistro.com/wp-admin`
2. **Login with your WordPress credentials**
3. **Click "Plugins" → "Add New"**
4. **Search**: `JWT Authentication for WP-API`
5. **Install and activate** the plugin by Enrique Chavez

### Step 2: Edit wp-config.php
1. **In SiteGround cPanel, click "File Manager"**
2. **Navigate to your WordPress folder**
3. **Find and edit `wp-config.php`**
4. **Add BEFORE** `/* That's all, stop editing! */`:

```php
// JWT Authentication Configuration
define('JWT_AUTH_SECRET_KEY', '?K_kxY(.+~+P=| kRb#cR*jc<[=~Wa;9Z};j6,%Td^>k,CCycuHI{+Jym!{w9kiW');
define('JWT_AUTH_CORS_ENABLE', true);
```

5. **Save the file**

### Step 3: Edit .htaccess
1. **In File Manager, find `.htaccess`** (enable "Show Hidden Files")
2. **Add at the TOP**:

```apache
# JWT Authentication
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]

# Enable CORS for JWT
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, DELETE, PUT"
    Header always set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
</IfModule>

```

3. **Save the file**

---

## ⚙️ PHASE 4: Update Your Next.js App

### Step 1: Update Environment Variables
1. **In your project, edit `.env.local`**:

```env
WORDPRESS_API_URL=https://api.floradistro.com
NEXT_PUBLIC_WORDPRESS_URL=https://api.floradistro.com
```

### Step 2: Deploy to Vercel
1. **In terminal, run**:
```bash
npm run build
git add .
git commit -m "Update WordPress API URL for production"
git push
```

2. **Vercel will auto-deploy**

### Step 3: Add Environment Variables to Vercel
1. **In Vercel dashboard → Settings → Environment Variables**
2. **Add**:
   - `WORDPRESS_API_URL` = `https://api.floradistro.com`
   - `NEXT_PUBLIC_WORDPRESS_URL` = `https://api.floradistro.com`
3. **Redeploy**

---

## 🧪 PHASE 5: Test Everything

### Step 1: Test JWT Authentication
Run this in terminal (replace with your WordPress login):

```bash
curl -X POST https://api.floradistro.com/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your-username",
    "password": "your-password"
  }'
```

✅ **Should return a JWT token**

### Step 2: Test Your Website
1. **Go to**: `https://floradistro.com`
2. **Try logging in**
3. **Go to profile page**
4. **Edit profile information**

✅ **Everything should work perfectly!**

---

## 📋 TIMELINE

### Immediate (Today):
- [ ] Sign up for SiteGround hosting
- [ ] Request WordPress migration
- [ ] Configure Vercel with floradistro.com

### 1-2 Days:
- [ ] WordPress migration completes
- [ ] Set up JWT authentication
- [ ] Test everything

### 5-7 Days:
- [ ] Domain transfer completes
- [ ] Final DNS configuration
- [ ] Go live with floradistro.com

---

## 💰 COSTS

- **SiteGround Hosting**: $3.99/month
- **Domain Transfer**: ~$15 (one-time)
- **Vercel**: Free (for your usage)
- **Total**: ~$4/month ongoing

---

## 🚨 TROUBLESHOOTING

### "Migration failed":
- Contact SiteGround support with your WordPress.com login
- They'll manually migrate for free

### "Domain transfer stuck":
- Check Squarespace for transfer approval email
- Contact SiteGround domain support

### "JWT still not working":
- Double-check wp-config.php and .htaccess edits
- Ensure plugin is activated
- Contact SiteGround support to verify server configuration

### "Website not loading":
- Check DNS propagation at whatsmydns.net
- Verify Vercel domain configuration
- Wait up to 48 hours for DNS changes

---

## ✅ SUCCESS CHECKLIST

### Phase 1 - Hosting:
- [ ] SiteGround account created
- [ ] WordPress migration requested
- [ ] Migration completed successfully

### Phase 2 - Domain:
- [ ] Subdomain `api.floradistro.com` created
- [ ] Domain transfer initiated from Squarespace
- [ ] Vercel configured with floradistro.com

### Phase 3 - JWT:
- [ ] JWT plugin installed and activated
- [ ] wp-config.php updated with JWT config
- [ ] .htaccess updated with JWT rules

### Phase 4 - Next.js:
- [ ] Environment variables updated
- [ ] Code deployed to Vercel
- [ ] Vercel environment variables set

### Phase 5 - Testing:
- [ ] JWT curl test returns token
- [ ] Website loads at floradistro.com
- [ ] Login/registration works
- [ ] Profile editing works without errors

## 🎉 FINAL RESULT

- **Frontend**: Lightning-fast Next.js on Vercel
- **Backend**: Full WordPress control on proper hosting
- **Domain**: Professional floradistro.com
- **Authentication**: Working JWT with profile editing
- **Cost**: Under $5/month total

**Perfect professional setup! 🚀** 