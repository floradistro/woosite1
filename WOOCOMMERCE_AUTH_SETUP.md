# WooCommerce Authentication Integration Setup

This guide explains how to set up the WooCommerce authentication system that integrates user login, registration, profile management, order tracking, and payment methods.

## Overview

The integration provides:
- ✅ JWT-based authentication with WordPress/WooCommerce
- ✅ User registration through WooCommerce customer API
- ✅ Real-time order tracking from WooCommerce orders
- ✅ Payment method management via WooCommerce payment tokens
- ✅ Profile data synchronization with WooCommerce customer data
- ✅ Automatic token validation and refresh

## Prerequisites

### 1. WordPress JWT Authentication Plugin

Install and configure the JWT Authentication plugin:

```bash
# Install via WordPress admin or upload manually
# Plugin: JWT Authentication for WP-API
# URL: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
```

### 2. WordPress Configuration

Add these lines to your WordPress `wp-config.php`:

```php
// JWT Authentication
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-jwt-key-here');
define('JWT_AUTH_CORS_ENABLE', true);

// Enable CORS for your Next.js domain
header('Access-Control-Allow-Origin: https://your-nextjs-domain.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### 3. Environment Variables

Update your `.env.local` file:

```env
# WooCommerce API Configuration
WOOCOMMERCE_STORE_URL=https://your-wordpress-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# Enable WooCommerce integration
NEXT_PUBLIC_USE_WOOCOMMERCE=true

# Your site URL (for internal API calls)
NEXT_PUBLIC_SITE_URL=https://your-nextjs-site.com
```

## API Endpoints Created

### Authentication
- `POST /api/woo-auth/login` - User login with JWT token
- `POST /api/woo-auth/register` - User registration
- `POST /api/woo-auth/validate` - Token validation

### User Profile
- `GET /api/woo-profile?customer_id={id}` - Get user profile
- `PUT /api/woo-profile` - Update user profile

### Orders
- `GET /api/woo-orders?customer_id={id}` - Get user orders
- `GET /api/woo-orders/{order_id}` - Get single order details

### Payment Methods
- `GET /api/woo-payment-methods?customer_id={id}` - Get saved payment methods
- `DELETE /api/woo-payment-methods` - Delete payment method

## Features

### 1. User Authentication
- Users can register with email, password, first name, and last name
- Login returns JWT token for authenticated requests
- Automatic token validation on app startup
- Secure token storage in localStorage

### 2. Profile Management
- Real-time sync with WooCommerce customer data
- Billing and shipping address management
- Profile updates reflect in WooCommerce backend

### 3. Order Tracking
- Real-time order history from WooCommerce
- Order status updates (pending, processing, shipped, completed, etc.)
- Detailed order information including line items
- Order search and filtering

### 4. Payment Methods
- Display saved payment methods from WooCommerce
- Delete payment methods
- Set default payment method
- Integration with WooCommerce payment tokens

## Usage Examples

### Login
```typescript
const { login } = useAuth();
const success = await login('user@example.com', 'password');
```

### Get User Orders
```typescript
const { orders, ordersLoading } = useProfileData();
// Orders automatically load when user is authenticated
```

### Update Profile
```typescript
const { updateProfile } = useProfileData();
const success = await updateProfile({
  first_name: 'John',
  last_name: 'Doe',
  billing: {
    address_1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postcode: '10001'
  }
});
```

## Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret key
2. **HTTPS Only**: Ensure all API calls use HTTPS in production
3. **Token Expiration**: JWT tokens have built-in expiration
4. **CORS Configuration**: Properly configure CORS for your domain
5. **API Permissions**: Use read-only permissions where possible

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS is enabled in WordPress
   - Check that your domain is whitelisted

2. **JWT Authentication Failed**
   - Verify JWT_AUTH_SECRET_KEY is set in wp-config.php
   - Ensure the JWT plugin is activated

3. **API Permission Errors**
   - Check WooCommerce API credentials
   - Verify user has appropriate permissions

4. **Token Validation Fails**
   - Check if JWT plugin is properly configured
   - Verify token hasn't expired

### Debug Mode

Enable debug logging by adding to your Next.js app:

```typescript
// Add to your API routes for debugging
console.log('WooCommerce API Request:', { url, method, params });
```

## Migration from Mock Data

If you were previously using mock authentication:

1. Update all `useAuth()` calls to handle the new user structure
2. Replace mock order data with real WooCommerce orders
3. Update payment method handling to use WooCommerce tokens
4. Test all authentication flows thoroughly

## Testing

1. **Registration Flow**: Test user registration with various inputs
2. **Login Flow**: Test login with valid/invalid credentials
3. **Token Persistence**: Test that users stay logged in across sessions
4. **Order Loading**: Verify orders load correctly for authenticated users
5. **Profile Updates**: Test profile updates sync to WooCommerce

## Support

For issues with this integration:
1. Check the browser console for error messages
2. Verify your WooCommerce and WordPress setup
3. Test API endpoints directly using tools like Postman
4. Review the server logs for detailed error information 