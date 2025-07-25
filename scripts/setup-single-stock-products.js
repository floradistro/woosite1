const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const STORE_URL = process.env.WOOCOMMERCE_STORE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Pricing structure from CSV
const FLOWER_PRICING = {
  '1g': 15.00,
  '3.5g': 40.00,
  '7g': 70.00,
  '14g': 110.00,
  '28g': 200.00
};

const CONCENTRATE_PRICING = {
  '1g': 35.00,
  '3.5g': 75.00,
  '7g': 125.00,
  '14g': 200.00,
  '28g': 300.00
};

async function makeWooRequest(endpoint, method = 'GET', data = null) {
  const baseUrl = `${STORE_URL}/wp-json/wc/v3/${endpoint}`;
  const params = new URLSearchParams({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET
  });
  
  const url = `${baseUrl}${endpoint.includes('?') ? '&' : '?'}${params.toString()}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

async function updateProductToSingleStock(product, productType) {
  console.log(`🔧 Converting ${productType} product: ${product.name}`);
  
  const pricing = productType === 'flower' ? FLOWER_PRICING : CONCENTRATE_PRICING;
  
  try {
    // Convert to simple product with custom fields
    const updatedProduct = await makeWooRequest(`products/${product.id}`, 'PUT', {
      type: 'simple',
      regular_price: pricing['1g'].toString(), // Base price for 1g
      manage_stock: true,
      stock_quantity: 1000, // Set initial stock in grams
      stock_status: 'instock',
      meta_data: [
        {
          key: '_weight_pricing',
          value: JSON.stringify(pricing)
        },
        {
          key: '_product_type_custom',
          value: productType
        },
        {
          key: '_stock_unit',
          value: 'grams'
        }
      ]
    });
    
    console.log(`✅ Converted ${product.name} to single stock product`);
    console.log(`   📦 Stock: 1000g`);
    console.log(`   💰 Base price: $${pricing['1g']} (1g)`);
    
    return updatedProduct;
    
  } catch (error) {
    console.error(`❌ Error updating product ${product.name}:`, error.message);
    throw error;
  }
}

async function updateProductsByType(productType) {
  try {
    console.log(`\n🌿 Processing ${productType} products...`);
    console.log(`💰 ${productType.toUpperCase()} pricing structure:`);
    const pricing = productType === 'flower' ? FLOWER_PRICING : CONCENTRATE_PRICING;
    Object.entries(pricing).forEach(([weight, price]) => {
      console.log(`   ${weight}: $${price}`);
    });
    console.log('');
    
    // Get all products with pagination
    console.log(`🔍 Fetching ${productType} products...`);
    let allProducts = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const url = `products?per_page=100&page=${page}`;
      const products = await makeWooRequest(url, 'GET');
      
      if (Array.isArray(products) && products.length > 0) {
        allProducts = [...allProducts, ...products];
        page++;
        console.log(`📦 Fetched page ${page - 1}: ${products.length} products`);
      } else {
        hasMore = false;
      }
    }
    
    console.log(`📦 Total products fetched: ${allProducts.length}`);
    
    // Filter for the specific product type
    const categoryName = productType === 'flower' ? 'Flower' : 'Concentrate';
    
    const products = allProducts.filter(product => 
      product.categories?.some(cat => cat.name === categoryName)
    );
    
    if (products.length === 0) {
      console.log(`❌ No ${productType} products found. Make sure products are categorized as "${categoryName}"`);
      return [];
    }
    
    console.log(`📦 Found ${products.length} ${productType} products`);
    
    // Update each product
    console.log(`\n🔄 Converting ${productType} products to single stock...`);
    const results = [];
    
    for (const product of products) {
      try {
        const result = await updateProductToSingleStock(product, productType);
        results.push(result);
        console.log(`✅ Successfully updated: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error.message);
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
    
  } catch (error) {
    console.error(`❌ Error processing ${productType} products:`, error.message);
    return [];
  }
}

async function main() {
  try {
    console.log('🌿 Starting single stock product setup...');
    console.log('📊 Converting products to single stock with weight selection\n');
    
    // Process flower products
    const flowerResults = await updateProductsByType('flower');
    
    // Process concentrate products  
    const concentrateResults = await updateProductsByType('concentrate');
    
    console.log('\n🎉 Conversion complete!');
    console.log(`✅ Successfully updated ${flowerResults.length} flower products`);
    console.log(`✅ Successfully updated ${concentrateResults.length} concentrate products`);
    console.log('💡 Products now use single stock with custom weight pricing');
    
    console.log('\n📋 Next steps:');
    console.log('1. Add weight dropdown to product pages');
    console.log('2. Implement custom pricing logic');
    console.log('3. Create stock deduction logic based on weight');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main }; 