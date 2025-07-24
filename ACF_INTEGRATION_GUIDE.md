# ACF Integration with WooCommerce REST API

## Current Status: ACF Fields Not Loading ❌

Your site is currently showing `null` for ACF fields when fetching from the WooCommerce REST API. Here's how to fix this:

## 🔧 WordPress/WooCommerce Setup Required

### 1. Install Required Plugins

```bash
# In your WordPress admin, install these plugins:
- Advanced Custom Fields (ACF) - FREE or PRO
- WooCommerce REST API (usually included with WooCommerce)
```

### 2. Import Your ACF Field Groups

You have the ACF export file: `acf-export-2025-07-24.json`

**To import in WordPress:**
1. Go to **Custom Fields > Tools**
2. Click **Import Field Groups**
3. Upload your `acf-export-2025-07-24.json` file
4. Click **Import**

### 3. Verify Field Group Assignment

Your ACF fields should be assigned to these product categories:

**EDIBLE/MOONWATER Fields:**
- `strength_mg` (Strength MG)
- `effects` (Effects)
- Assigned to: `edibles`, `moonwater` categories

**FLOWER/VAPE/CONCENTRATE Fields:**
- `thca_%` (THCa %)
- `strain_type` (Strain Type)
- `nose` (Nose)
- `effects` (Effects)
- `dominent_terpene` (Dominant Terpene)
- `lineage` (Lineage)
- Assigned to: `flower`, `vape`, `concentrate` categories

### 4. Enable ACF in REST API

Add this to your WordPress theme's `functions.php` or create a plugin:

```php
<?php
// Enable ACF fields in WooCommerce REST API
add_filter('woocommerce_rest_prepare_product_object', function($response, $object, $request) {
    $acf_fields = get_fields($object->get_id());
    if ($acf_fields) {
        $response->data['acf'] = $acf_fields;
    }
    return $response;
}, 10, 3);

// Alternative method - ensure ACF is available in REST
add_action('rest_api_init', function() {
    if (function_exists('acf_get_field_groups')) {
        // Register ACF fields for REST API
        $field_groups = acf_get_field_groups();
        foreach ($field_groups as $field_group) {
            $fields = acf_get_fields($field_group['key']);
            foreach ($fields as $field) {
                register_rest_field(
                    'product',
                    $field['name'],
                    array(
                        'get_callback' => function($object) use ($field) {
                            return get_field($field['name'], $object['id']);
                        },
                        'update_callback' => null,
                        'schema' => null,
                    )
                );
            }
        }
    }
});
?>
```

### 5. Test Your WordPress API

Test these URLs in your browser or with curl:

```bash
# Test basic products endpoint
https://your-wordpress-site.com/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET

# Test with ACF format
https://your-wordpress-site.com/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET&acf_format=standard

# Test single product
https://your-wordpress-site.com/wp-json/wc/v3/products/PRODUCT_ID?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET&acf_format=standard
```

### 6. Fill ACF Field Values

Make sure your products have ACF field values:

1. Go to **Products** in WordPress admin
2. Edit a product
3. Scroll down to see your ACF field groups
4. Fill in the values (THCa %, Strain Type, etc.)
5. Save the product

## 🚀 Next.js Integration Status

Your Next.js app is already configured to:
- ✅ Request ACF fields in API calls (`acf_format=standard`)
- ✅ Include ACF fields in response filtering (`_fields` parameter)
- ✅ Transform ACF data in product objects
- ✅ Display ACF fields in product components

## 🧪 Testing Your Integration

1. **Visit the debug page:** `http://localhost:3000/debug-acf`
2. **Check for ACF fields** in the products
3. **Look for troubleshooting messages** if fields are missing

## 📋 Expected ACF Field Structure

Your products should return ACF data like this:

```json
{
  "id": 123,
  "name": "Product Name",
  "acf": {
    "thca_%": "25.5",
    "strain_type": "indica",
    "nose": "earthy, pine",
    "effects": "relaxing, sleepy",
    "dominent_terpene": "myrcene",
    "lineage": "og kush x granddaddy purple"
  }
}
```

## 🔍 Troubleshooting

### Issue: ACF fields return `null`
**Solutions:**
1. Verify ACF plugin is active
2. Check field group assignments to product categories
3. Ensure products have ACF values filled
4. Add the PHP code to enable ACF in REST API
5. Clear any WordPress caching

### Issue: Some fields missing
**Solutions:**
1. Check field names match exactly (case-sensitive)
2. Verify field groups are published
3. Check product category assignments

### Issue: Permission errors
**Solutions:**
1. Verify WooCommerce API keys have read permissions
2. Check if REST API is enabled in WordPress
3. Test API endpoints directly

## 📱 How ACF Fields Are Used in Your App

### Flower Products
- **THCa %** → Displayed as potency
- **Strain Type** → Category badge (indica/sativa/hybrid)
- **Nose** → Aroma profile tags
- **Effects** → Effect descriptions
- **Lineage** → Strain genetics info

### Edible/Moonwater Products
- **Strength MG** → Dosage information
- **Effects** → Product descriptions

### Vape/Concentrate Products
- **THCa %** → Potency display
- **Dominant Terpene** → Flavor profiles
- **Effects** → Product benefits

## ✅ Success Indicators

When working correctly, you should see:
- ✅ ACF fields populated in `/debug-acf`
- ✅ Real product data instead of hardcoded values
- ✅ Dynamic strain types, effects, and potency
- ✅ Proper categorization and filtering

## 🆘 Need Help?

If you're still having issues:
1. Check WordPress error logs
2. Test the WooCommerce REST API directly
3. Verify ACF field group settings
4. Ensure products have ACF values filled
5. Check for plugin conflicts 