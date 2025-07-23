# WordPress/WooCommerce Setup Guide
**Complete Step-by-Step Implementation**

Following the ground rules:
- WordPress = data layer only
- JWT for auth (stateless)
- REST API only (no PHP templates)
- Next.js as complete frontend

## 1. WordPress Setup & Hardening

### 1.1 Fresh WordPress Installation
```bash
# Requirements
- PHP 8.2+
- MySQL 8.0+
- HTTPS enabled
- Fresh WordPress + WooCommerce install
```

### 1.2 Install Required Plugins

**JWT Authentication for WP REST API**
```bash
# Option 1: WordPress Admin
# Go to Plugins → Add New → Search "JWT Authentication for WP REST API"
# Install and activate

# Option 2: Composer
composer require tmeister/jwt-authentication-for-wp-rest-api

# Option 3: Manual
# Download from: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
```

**WooCommerce**
```bash
# Install WooCommerce plugin
# Complete the setup wizard
# Create API keys in WooCommerce → Settings → Advanced → REST API
```

### 1.3 WordPress Configuration

**Add to `wp-config.php`:**
```php
<?php
// JWT Authentication
define( 'JWT_AUTH_SECRET_KEY', 'your-super-secret-jwt-key-here-make-it-long-and-complex' );
define( 'JWT_AUTH_CORS_ENABLE', true );

// Optional: JWT expiration (default 7 days)
define( 'JWT_AUTH_EXPIRE', WEEK_IN_SECONDS );

// CORS Headers (replace with your actual Next.js domain)
define( 'CORS_ALLOW_ORIGIN', 'https://your-nextjs-site.com' );
```

**Add to `.htaccess` (Apache):**
```apache
# JWT Authorization header
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]

# CORS headers
Header always set Access-Control-Allow-Origin "https://your-nextjs-site.com"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
Header always set Access-Control-Allow-Credentials "true"
```

**For Nginx:**
```nginx
# Add to your server block
location / {
    # CORS headers
    add_header Access-Control-Allow-Origin "https://your-nextjs-site.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

### 1.4 Functions.php Configuration

**Add to your theme's `functions.php`:**
```php
<?php
// Enhanced CORS support
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        $allowed_origins = [
            'https://your-nextjs-site.com',
            'http://localhost:3000', // For development
        ];
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        
        return $value;
    });
});

// Rate limiting for JWT endpoint (security)
add_action('wp_loaded', function() {
    if (strpos($_SERVER['REQUEST_URI'], '/jwt-auth/v1/token') !== false) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $attempts = get_transient("jwt_attempts_$ip") ?: 0;
        
        if ($attempts > 5) {
            wp_die('Too many login attempts. Please try again later.', 'Rate Limited', ['response' => 429]);
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            set_transient("jwt_attempts_$ip", $attempts + 1, 300); // 5 minutes
        }
    }
});

// Clean up JWT attempts on successful login
add_filter('jwt_auth_token_before_dispatch', function($data, $user) {
    $ip = $_SERVER['REMOTE_ADDR'];
    delete_transient("jwt_attempts_$ip");
    return $data;
}, 10, 2);
```

## 2. WooCommerce API Setup

### 2.1 Create API Keys
1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Configure:
   - **Description**: `Next.js Frontend App`
   - **User**: Select an admin user
   - **Permissions**: `Read/Write` (or `Read` for security)
4. **Generate API Key**
5. **IMPORTANT**: Copy and save the Consumer Key and Consumer Secret

### 2.2 Test API Access
```bash
# Test WooCommerce API
curl -u "ck_your_key:cs_your_secret" \
  https://your-wordpress-site.com/wp-json/wc/v3/products

# Test JWT endpoint
curl -X POST https://your-wordpress-site.com/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

## 3. Next.js Environment Configuration

### 3.1 Environment Variables
**Create/update `.env.local`:**
```env
# WordPress API Configuration
NEXT_PUBLIC_WP_API=https://your-wordpress-site.com
NEXT_PUBLIC_WOOCOMMERCE_STORE_URL=https://your-wordpress-site.com

# WooCommerce API Credentials (server-side only)
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# Public WooCommerce credentials (if needed client-side)
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# Enable real WordPress integration
NEXT_PUBLIC_USE_WOOCOMMERCE=true

# Your site URL
NEXT_PUBLIC_SITE_URL=https://your-nextjs-site.com
```

## 4. Testing the Complete Flow

### 4.1 Test Authentication
```bash
# 1. Register a test user in WordPress admin
# 2. Test JWT login
curl -X POST https://your-wp-site.com/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"testpassword"}'

# Expected response:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_id": 2,
  "user_email": "test@example.com",
  "user_display_name": "Test User"
}
```

### 4.2 Test User Profile
```bash
# Use the token from login
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-wp-site.com/wp-json/wp/v2/users/me
```

### 4.3 Test WooCommerce Integration
```bash
# Test customer creation
curl -X POST https://your-wp-site.com/wp-json/wc/v3/customers \
  -u "ck_key:cs_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newcustomer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "username": "newcustomer@example.com",
    "password": "password123"
  }'

# Test orders endpoint
curl -u "ck_key:cs_secret" \
  https://your-wp-site.com/wp-json/wc/v3/orders?customer=2
```

## 5. Security Checklist

### 5.1 WordPress Security
- [ ] Strong JWT secret key (64+ characters)
- [ ] HTTPS enabled and enforced
- [ ] Rate limiting on JWT endpoint
- [ ] Regular WordPress/plugin updates
- [ ] Strong admin passwords
- [ ] Limit login attempts
- [ ] Hide WordPress version info

### 5.2 API Security
- [ ] WooCommerce API keys use minimum required permissions
- [ ] CORS properly configured for your domain only
- [ ] API rate limiting enabled
- [ ] Regular API key rotation
- [ ] Monitor API usage logs

### 5.3 Next.js Security
- [ ] Environment variables properly configured
- [ ] No sensitive data in client-side code
- [ ] JWT tokens stored securely (httpOnly cookies in production)
- [ ] Input validation on all forms
- [ ] CSRF protection enabled

## 6. Production Deployment

### 6.1 WordPress Production
```bash
# 1. Deploy WordPress to production server
# 2. Update wp-config.php with production settings
# 3. Configure production CORS origins
# 4. Set up SSL certificates
# 5. Configure caching (Redis/Memcached)
# 6. Set up database backups
```

### 6.2 Next.js Production
```bash
# 1. Update environment variables for production
# 2. Deploy to Vercel/Netlify/your hosting
# 3. Configure custom domain
# 4. Set up monitoring and error tracking
```

## 7. Troubleshooting

### Common Issues

**CORS Errors**
```bash
# Check browser console for specific CORS errors
# Verify WordPress CORS headers are set correctly
# Ensure your domain is whitelisted
```

**JWT Authentication Failed**
```bash
# Verify JWT_AUTH_SECRET_KEY is set in wp-config.php
# Check that JWT plugin is activated
# Ensure .htaccess rules are applied
# Test JWT endpoint directly with curl
```

**WooCommerce API Errors**
```bash
# Verify API credentials are correct
# Check user permissions for API key
# Test endpoints with curl/Postman
# Review WooCommerce logs
```

**Registration Issues**
```bash
# Check WordPress user registration settings
# Verify WooCommerce customer creation works
# Test with different email addresses
# Check for plugin conflicts
```

### Debug Mode
**Enable WordPress debugging:**
```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

**Check logs:**
```bash
# WordPress logs
tail -f /path/to/wordpress/wp-content/debug.log

# Server logs
tail -f /var/log/apache2/error.log  # Apache
tail -f /var/log/nginx/error.log    # Nginx
```

## 8. Next Steps & Expansion

### Optional Enhancements
1. **Points/Rewards System**: Install WooCommerce Points & Rewards plugin
2. **Subscriptions**: Install WooCommerce Subscriptions plugin
3. **Advanced Analytics**: Set up WooCommerce Analytics
4. **Email Marketing**: Integrate with Mailchimp/Klaviyo
5. **Push Notifications**: Set up web push for order updates

### Performance Optimization
1. **Caching**: Redis/Memcached for WordPress
2. **CDN**: CloudFlare for static assets
3. **Database**: Optimize WooCommerce database tables
4. **API**: Implement API response caching

This setup provides a complete, production-ready WordPress/WooCommerce backend with proper JWT authentication, CORS configuration, and security measures. 