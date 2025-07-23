# JWT Authentication Setup Guide for WordPress

## Overview
This guide will help you properly configure JWT (JSON Web Token) authentication on your WordPress site to work with your Next.js application.

## Step 1: Install JWT Authentication Plugin

1. **Install the Plugin**:
   - Go to your WordPress admin: `https://distropass.wpcomstaging.com/wp-admin`
   - Navigate to **Plugins → Add New**
   - Search for "JWT Authentication for WP-API"
   - Install and activate the plugin by Enrique Chavez

   **OR**

   - Download from: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
   - Upload via **Plugins → Add New → Upload Plugin**

## Step 2: Configure wp-config.php

Add these lines to your `wp-config.php` file (before `/* That's all, stop editing! */`):

```php
// JWT Authentication Configuration
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-jwt-key-here-make-it-long-and-random');
define('JWT_AUTH_CORS_ENABLE', true);
```

**Important**: Replace `your-super-secret-jwt-key-here-make-it-long-and-random` with a strong, unique secret key. You can generate one at: https://api.wordpress.org/secret-key/1.1/salt/

## Step 3: Configure .htaccess (Apache) or Nginx

### For Apache (.htaccess):
Add this to your `.htaccess` file in the WordPress root:

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

### For Nginx:
Add this to your Nginx configuration:

```nginx
# JWT Authentication - Pass Authorization header
location / {
    try_files $uri $uri/ /index.php?$args;
    
    # Pass Authorization header
    fastcgi_pass_header Authorization;
}

# Enable CORS
add_header Access-Control-Allow-Origin "*" always;
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS, DELETE, PUT" always;
add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
```

## Step 4: Test JWT Configuration

1. **Test the JWT endpoint**:
   ```bash
   curl -X POST https://distropass.wpcomstaging.com/wp-json/jwt-auth/v1/token \
     -H "Content-Type: application/json" \
     -d '{
       "username": "your-username",
       "password": "your-password"
     }'
   ```

2. **Expected Response**:
   ```json
   {
     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     "user_email": "user@example.com",
     "user_nicename": "username",
     "user_display_name": "Display Name"
   }
   ```

## Step 5: Test Token Validation

1. **Test token validation**:
   ```bash
   curl -X POST https://distropass.wpcomstaging.com/wp-json/jwt-auth/v1/token/validate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
   ```

2. **Expected Response**:
   ```json
   {
     "code": "jwt_auth_valid_token",
     "data": {
       "status": 200
     }
   }
   ```

## Step 6: Test WordPress User API

1. **Test user data endpoint**:
   ```bash
   curl -X GET https://distropass.wpcomstaging.com/wp-json/wp/v2/users/me \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
   ```

2. **Expected Response**:
   ```json
   {
     "id": 123,
     "username": "username",
     "email": "user@example.com",
     "first_name": "First",
     "last_name": "Last",
     "display_name": "Display Name",
     "avatar_urls": {...},
     "roles": ["customer"]
   }
   ```

## Step 7: Update Environment Variables

Add the JWT secret to your Next.js `.env.local`:

```env
# WordPress JWT Configuration
WORDPRESS_JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

## Troubleshooting

### Common Issues:

1. **"JWT is not configured properly"**:
   - Check that `JWT_AUTH_SECRET_KEY` is defined in `wp-config.php`
   - Ensure the JWT plugin is activated
   - Verify the secret key is not empty

2. **"Authorization header not found"**:
   - Check `.htaccess` or Nginx configuration
   - Ensure the Authorization header is being passed through

3. **CORS errors**:
   - Add CORS headers to your server configuration
   - Enable `JWT_AUTH_CORS_ENABLE` in `wp-config.php`

4. **Token validation fails**:
   - Ensure the same secret key is used for both generation and validation
   - Check that the token hasn't expired

### Debug Steps:

1. **Check plugin status**:
   - Go to **Plugins** in WordPress admin
   - Ensure "JWT Authentication for WP-API" is active

2. **Check wp-config.php**:
   - Verify `JWT_AUTH_SECRET_KEY` is defined
   - Ensure it's a strong, unique key

3. **Check server logs**:
   - Look for any PHP errors related to JWT
   - Check for authorization header issues

## Next Steps

Once JWT is properly configured:

1. Your Next.js app will be able to fetch WordPress user data
2. Profile editing will work through the WordPress API
3. All authentication will be properly secured with JWT tokens

## Contact

If you need help with server configuration, contact your hosting provider or WordPress administrator. 