# WooCommerce Integration Guide

This guide walks you through connecting your Next.js application to WooCommerce and removing all hardcoded test product data.

## Overview

Your application has been updated to support WooCommerce integration while maintaining backward compatibility with existing hardcoded data. The integration includes:

- ✅ WooCommerce REST API client setup
- ✅ Product service with caching and fallback support
- ✅ Interface transformation between WooCommerce and your app's format
- ✅ Updated flower page to use dynamic data
- ✅ Environment-based feature toggling

## Step 1: WooCommerce Setup

### 1.1 Enable REST API in WooCommerce

1. Log into your WordPress admin panel
2. Go to **WooCommerce > Settings > Advanced > REST API**
3. Click **Add Key**
4. Set the following:
   - **Description**: `Next.js Frontend App`
   - **User**: Select an admin user
   - **Permissions**: `Read`
5. Click **Generate API Key**
6. Copy the **Consumer Key** and **Consumer Secret**

### 1.2 Environment Variables

Create a `.env.local` file in your project root:

```env
# WooCommerce API Configuration
WOOCOMMERCE_STORE_URL=https://your-store.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# Enable WooCommerce integration (set to false for development with hardcoded data)
NEXT_PUBLIC_USE_WOOCOMMERCE=true

# Your existing environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Replace the placeholder values with your actual WooCommerce store URL and API credentials.

## Step 2: WooCommerce Product Setup

### 2.1 Product Categories

Ensure your WooCommerce products have the following categories:
- **Flower**
- **Vape**
- **Wax**
- **Moonwater**
- **Edibles**
- **Apparel**

### 2.2 Product Meta Fields

For optimal integration, add these custom meta fields to your WooCommerce products:

#### Cannabis-Specific Fields
- `strain_type`: "Indica", "Sativa", or "Hybrid"
- `thca_percentage`: "25.5%" (THCa percentage)
- `lineage`: "Parent Strain 1 x Parent Strain 2"

#### SEO Fields
- `seo_title`: Custom SEO title
- `seo_description`: Custom SEO description

#### Additional Fields
- `vendor`: Brand/vendor name (defaults to "Flora Distro")
- `barcode`: Product barcode

### 2.3 Product Tags

Use tags to enhance product filtering and categorization:
- **Strain Types**: `indica`, `sativa`, `hybrid`
- **Effects**: `relax`, `energize`, `balance`
- **Nose/Flavor**: `candy`, `gas`, `cake`, `funk`, `sherb`

### 2.4 Product Images

Ensure all products have high-quality featured images. The integration will use the first image as the primary product image.

## Step 3: Testing the Integration

### 3.1 Development Mode

To test with hardcoded data during development:

```env
NEXT_PUBLIC_USE_WOOCOMMERCE=false
```

### 3.2 Production Mode

To use WooCommerce data:

```env
NEXT_PUBLIC_USE_WOOCOMMERCE=true
```

### 3.3 Verify Integration

1. Start your development server: `npm run dev`
2. Navigate to `/flower`
3. Check browser console for any API errors
4. Verify products are loading from WooCommerce

## Step 4: Category Page Updates

The flower page has been updated. To update other category pages (vape, wax, etc.), follow this pattern:

### Example: Update Vape Page

1. **Update constants file** (`src/app/vape/constants.ts`):
```typescript
// Replace hardcoded VAPE_PRODUCTS with:
export async function getVapeProducts(): Promise<FeaturedProduct[]> {
  try {
    const products = await productService.getProductsByType('Vape');
    return products.map((product, index) => {
      // Transform WooCommerce product to vape format
      // ... transformation logic
    });
  } catch (error) {
    console.error('Error fetching vape products:', error);
    return [];
  }
}
```

2. **Update page component** (`src/app/vape/page.tsx`):
```typescript
import { useState, useEffect } from 'react';
import { getVapeProducts, FeaturedProduct } from './constants';

export default function VapeCollectionPage() {
  const [vapeProducts, setVapeProducts] = useState<FeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getVapeProducts();
        setVapeProducts(products);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // ... rest of component
}
```

## Step 5: Remove Hardcoded Data (After Integration is Complete)

Once you've verified the WooCommerce integration is working:

1. **Remove hardcoded product files**:
   ```bash
   # Remove the large hardcoded products file
   rm src/data/products.ts
   ```

2. **Update imports** in remaining files to use the product service instead

3. **Clean up constants files** by removing hardcoded product arrays

## Step 6: Performance Optimization

### 6.1 Caching

The product service includes built-in caching (5-minute duration). Products are cached by:
- All products
- Products by category
- Individual products
- Featured products
- Search results

### 6.2 Error Handling

The integration includes comprehensive error handling:
- API failures fallback to hardcoded data (during transition)
- Network errors are logged but don't crash the app
- Empty states are handled gracefully

### 6.3 Loading States

All async product loading includes loading states to improve user experience.

## API Reference

### Product Service Methods

```typescript
// Get all products
const products = await productService.getAllProducts();

// Get products by category
const flowerProducts = await productService.getProductsByCategory('flower');

// Get products by type
const vapeProducts = await productService.getProductsByType('Vape');

// Get single product
const product = await productService.getProduct(123);

// Get product by handle/slug
const product = await productService.getProductByHandle('product-slug');

// Get featured products
const featured = await productService.getFeaturedProducts(10);

// Search products
const results = await productService.searchProducts('search term');

// Clear cache (development)
productService.clearCache();
```

### WooCommerce API Methods

```typescript
// Direct WooCommerce API access
import { wooCommerceAPI } from '../lib/woocommerce';

// Get products with parameters
const products = await wooCommerceAPI.getProducts({
  per_page: 50,
  category: 'flower',
  featured: true
});

// Get single product
const product = await wooCommerceAPI.getProduct(123);

// Get categories
const categories = await wooCommerceAPI.getCategories();
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify WooCommerce REST API is enabled
   - Check consumer key/secret are correct
   - Ensure store URL is correct (include https://)

2. **CORS Issues**
   - WooCommerce REST API should handle CORS automatically
   - If issues persist, check your hosting provider's CORS settings

3. **Missing Products**
   - Ensure products are published in WooCommerce
   - Check product categories match your app's expectations
   - Verify API permissions include read access

4. **Performance Issues**
   - Consider increasing cache duration for production
   - Implement pagination for large product catalogs
   - Use WooCommerce product caching plugins

### Debug Mode

To debug the integration, check the browser console for:
- API request/response logs
- Cache hit/miss information
- Product transformation logs

## Next Steps

1. **Complete Category Integration**: Update all category pages (vape, wax, moonwater, etc.)
2. **Remove Hardcoded Data**: Once all pages are updated, remove hardcoded product files
3. **Add Product Management**: Consider adding admin interfaces for product management
4. **Implement Webhooks**: Set up WooCommerce webhooks to clear cache when products are updated
5. **Add Analytics**: Track product views and interactions

## Security Notes

- Store API credentials in environment variables only
- Use read-only API permissions
- Consider IP restrictions for API access in production
- Regularly rotate API keys

## Support

For issues with this integration:
1. Check the browser console for error messages
2. Verify your WooCommerce setup matches this guide
3. Test with `NEXT_PUBLIC_USE_WOOCOMMERCE=false` to isolate API issues
4. Review the product service logs for debugging information 