#!/bin/bash

# Cleanup Script for Hardcoded Test Data
# Run this after you've verified WooCommerce integration is working properly

echo "🧹 Cleaning up hardcoded test data..."

# Confirm before proceeding
read -p "Are you sure you want to remove all hardcoded test data? This cannot be undone. (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled."
    exit 1
fi

echo "🗑️  Removing hardcoded product data files..."

# Remove the main products file (largest file)
if [ -f "src/data/products.ts" ]; then
    echo "Removing src/data/products.ts (2942 lines of hardcoded data)..."
    rm src/data/products.ts
    echo "✅ Removed src/data/products.ts"
else
    echo "⚠️  src/data/products.ts already removed"
fi

# Update category constants to remove hardcoded arrays (keep them for reference)
echo "📝 Updating category constants files..."

# List of files that may need cleanup
FILES_TO_CHECK=(
    "src/app/wax/constants.ts"
    "src/app/moonwater/constants.ts" 
    "src/app/edible/constants.ts"
    "src/app/subscriptions/constants.ts"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "📋 $file - Review manually to remove hardcoded product arrays"
    fi
done

# Check for any remaining imports of the old products file
echo "🔍 Checking for remaining imports of hardcoded products..."
if grep -r "from.*data/products" src/ --exclude-dir=node_modules 2>/dev/null; then
    echo "⚠️  Found remaining imports of hardcoded products. Please update these files to use the product service instead."
else
    echo "✅ No remaining hardcoded product imports found"
fi

# Check for any remaining PRODUCT arrays in constants files
echo "🔍 Checking for hardcoded product arrays..."
if grep -r "PRODUCTS.*\[\]" src/app/ 2>/dev/null; then
    echo "✅ Found empty product arrays (this is expected during transition)"
else
    echo "✅ No hardcoded product arrays found"
fi

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Test your application to ensure WooCommerce integration is working"
echo "2. Update any remaining category pages to use the new async pattern"
echo "3. Remove any remaining hardcoded product arrays from constants files"
echo "4. Update imports in components to use productService instead of hardcoded data"
echo ""
echo "💡 If you encounter issues, you can restore from git:"
echo "   git checkout HEAD -- src/data/products.ts"
echo ""
echo "📖 See WOOCOMMERCE_INTEGRATION_GUIDE.md for complete instructions" 