const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
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
  // Handle URL parameters properly
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

async function createWeightAttribute(productType) {
  try {
    console.log(`🔧 Creating/updating weight attribute for ${productType}...`);
    
    const attributeSlug = `${productType}-weight`;
    
    // Try to create the attribute (will fail if it exists)
    try {
      const attribute = await makeWooRequest('products/attributes', 'POST', {
        name: 'Weight',
        slug: attributeSlug,
        type: 'select',
        order_by: 'menu_order',
        has_archives: false
      });
      console.log(`✅ Created weight attribute for ${productType}:`, attribute.id);
      return attribute.id;
    } catch (error) {
      // Attribute might already exist, try to get it
      const attributes = await makeWooRequest('products/attributes');
      const weightAttr = attributes.find(attr => attr.slug === attributeSlug);
      if (weightAttr) {
        console.log(`✅ Found existing weight attribute for ${productType}:`, weightAttr.id);
        return weightAttr.id;
      }
      // Try with just "weight" slug as fallback
      const genericWeightAttr = attributes.find(attr => attr.slug === 'weight');
      if (genericWeightAttr) {
        console.log(`✅ Found existing generic weight attribute for ${productType}:`, genericWeightAttr.id);
        return genericWeightAttr.id;
      }
      throw error;
    }
  } catch (error) {
    console.error(`❌ Error with weight attribute for ${productType}:`, error.message);
    throw error;
  }
}

async function createWeightTerms(attributeId, productType) {
  console.log(`🔧 Creating weight terms for ${productType}...`);
  
  const weights = ['1g', '3.5g', '7g', '14g', '28g'];
  const createdTerms = [];
  
  for (const weight of weights) {
    try {
      // Try to create the term
      try {
        const term = await makeWooRequest(`products/attributes/${attributeId}/terms`, 'POST', {
          name: weight,
          slug: weight.replace('.', '-')
        });
        console.log(`✅ Created term for ${weight}: ${term.id}`);
        createdTerms.push(term);
      } catch (error) {
        // Term might already exist, try to get it
        const terms = await makeWooRequest(`products/attributes/${attributeId}/terms`);
        const existingTerm = terms.find(term => term.slug === weight.replace('.', '-'));
        if (existingTerm) {
          console.log(`✅ Found existing term for ${weight}: ${existingTerm.id}`);
          createdTerms.push(existingTerm);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`❌ Error with term ${weight}:`, error.message);
    }
  }
  
  return createdTerms;
}

async function updateProduct(product, attributeId, terms, productType) {
  console.log(`🔧 Updating ${productType} product: ${product.name}`);
  
  const pricing = productType === 'flower' ? FLOWER_PRICING : CONCENTRATE_PRICING;
  
  try {
    // First, convert to variable product with weight attribute
    const updatedProduct = await makeWooRequest(`products/${product.id}`, 'PUT', {
      type: 'variable',
      attributes: [
        {
          id: attributeId,
          name: 'Weight',
          position: 0,
          visible: true,
          variation: true,
          options: terms.map(term => term.name)
        }
      ]
    });
    
    console.log(`✅ Converted ${product.name} to variable product`);
    
    // Create variations for each weight
    const variations = [];
    
    for (const term of terms) {
      const weight = term.name;
      const price = pricing[weight];
      
      if (price) {
        try {
          const variation = await makeWooRequest(`products/${product.id}/variations`, 'POST', {
            regular_price: price.toString(),
            attributes: [
              {
                id: attributeId,
                name: 'Weight',
                option: term.name
              }
            ],
            manage_stock: false,
            status: 'publish'
          });
          
          console.log(`✅ Created variation for ${weight}: $${price}`);
          variations.push(variation);
        } catch (error) {
          console.error(`❌ Error creating variation for ${weight}:`, error.message);
        }
      }
    }
    
    return { product: updatedProduct, variations };
    
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
    
    // Filter for the specific product type - use exact category names
    const categoryName = productType === 'flower' ? 'Flower' : 'Concentrate';
    
    const products = allProducts.filter(product => 
      product.categories?.some(cat => cat.name === categoryName)
    );
    
    if (products.length === 0) {
      console.log(`❌ No ${productType} products found. Make sure products are categorized as "${categoryName}"`);
      return [];
    }
    
    console.log(`📦 Found ${products.length} ${productType} products`);
    
    // Create weight attribute and terms
    const attributeId = await createWeightAttribute(productType);
    const terms = await createWeightTerms(attributeId, productType);
    
    if (terms.length === 0) {
      console.log(`❌ No weight terms created for ${productType}`);
      return [];
    }
    
    // Update each product
    console.log(`\n🔄 Updating ${productType} products...`);
    const results = [];
    
    for (const product of products) {
      try {
        const result = await updateProduct(product, attributeId, terms, productType);
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
    console.log('🌿 Starting flower and concentrate variation update...');
    console.log('📊 Based on pricing from PRODUCTS_FOR_SITE_STRICT_TYPES.csv\n');
    
    // Process flower products
    const flowerResults = await updateProductsByType('flower');
    
    // Process concentrate products  
    const concentrateResults = await updateProductsByType('concentrate');
    
    console.log('\n🎉 Update complete!');
    console.log(`✅ Successfully updated ${flowerResults.length} flower products`);
    console.log(`✅ Successfully updated ${concentrateResults.length} concentrate products`);
    console.log('💡 Products now have weight variations with proper pricing structure');
    
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