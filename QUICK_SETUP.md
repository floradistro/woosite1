# ⚡ Quick WordPress Setup Test

## 🚨 Current Issue: Environment Variables Missing

The "Failed to fetch" error means your WordPress backend isn't configured yet. Here's how to fix it:

## 1. Create `.env.local` file

Create a file called `.env.local` in your project root with:

```bash
# Your WordPress site URL
NEXT_PUBLIC_WP_API=https://your-wordpress-site.com

# WooCommerce API Keys (generate these in WordPress admin)
WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
```

## 2. Quick WordPress Setup Options

### Option A: Use Existing WordPress Site
If you have a WordPress site:
1. Install WooCommerce plugin
2. Install "JWT Authentication for WP-API" plugin  
3. Add to `wp-config.php`: `define('JWT_AUTH_SECRET_KEY', 'your-secret-key');`
4. Generate WooCommerce API keys in admin

### Option B: Local WordPress (Fastest for Testing)
1. Download Local by Flywheel or use XAMPP
2. Install WordPress + WooCommerce
3. Install JWT Authentication plugin
4. Use ``http://localhost/your-site` as API URL

### Option C: Test with Demo Site (Quick Test)
For immediate testing, you can temporarily use:
```bash
NEXT_PUBLIC_WP_API=https://demo.woothemes.com
WOOCOMMERCE_CONSUMER_KEY=ck_demo_key
WOOCOMMERCE_CONSUMER_SECRET=cs_demo_secret
```
*(This won't save real data but will test the connection)*

## 3. Test the Integration

1. Save your `.env.local` file
2. Restart your dev server: `npm run dev`
3. Visit `/test-wordpress` to verify connection
4. Try signing up at `/auth/signin`

## 4. If Still Getting Errors

- Check browser console for CORS errors
- Verify WordPress URL is accessible
- Make sure WooCommerce is active
- Ensure JWT plugin is installed and configured

The signup page is now **100% real** and will create actual WordPress users once your backend is configured! 