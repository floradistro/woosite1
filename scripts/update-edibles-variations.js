const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const STORE_URL = process.env.WOOCOMMERCE_STORE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// New pricing structure
const QUANTITY_PRICING = {
  '1': 29.99,
  '2': 49.99,
  '3': 64.99,
  '4': 74.99
};

async function makeWooRequest(endpoint, method = 'GET', data = null) {
  const url = `${STORE_URL}/wp-json/wc/v3/${endpoint}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
  
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

async function createQuantityAttribute() {
  try {
    console.log('🔧 Creating/updating quantity attribute...');
    
    // Try to create the attribute (will fail if it exists)
    try {
      const attribute = await makeWooRequest('products/attributes', 'POST', {
        name: 'Quantity',
        slug: 'edible-quantity',
        type: 'select',
        order_by: 'menu_order',
        has_archives: false
      });
      console.log('✅ Created quantity attribute:', attribute.id);
      return attribute.id;
    } catch (error) {
      // Attribute might already exist, try to get it
      const attributes = await makeWooRequest('products/attributes');
      const quantityAttr = attributes.find(attr => attr.slug === 'edible-quantity');
      if (quantityAttr) {
        console.log('✅ Found existing quantity attribute:', quantityAttr.id);
        return quantityAttr.id;
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Error with quantity attribute:', error.message);
    throw error;
  }
}

async function createQuantityTerms(attributeId) {
  console.log('🔧 Creating quantity terms...');
  
  const quantities = ['1', '2', '3', '4'];
  const createdTerms = [];
  
  for (const qty of quantities) {
    try {
      // Try to create the term
      try {
        const term = await makeWooRequest(`products/attributes/${attributeId}/terms`, 'POST', {
          name: `${qty} pack${qty > 1 ? 's' : ''}`,
          slug: qty
        });
        console.log(`✅ Created term for ${qty}: ${term.id}`);
        createdTerms.push(term);
      } catch (error) {
        // Term might already exist, try to get it
        const terms = await makeWooRequest(`products/attributes/${attributeId}/terms`);
        const existingTerm = terms.find(term => term.slug === qty);
        if (existingTerm) {
          console.log(`✅ Found existing term for ${qty}: ${existingTerm.id}`);
          createdTerms.push(existingTerm);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`❌ Error with term ${qty}:`, error.message);
    }
  }
  
  return createdTerms;
}

async function updateEdibleProduct(product, attributeId, terms) {
  console.log(`🔧 Updating product: ${product.name}`);
  
  try {
    // First, convert to variable product with quantity attribute
    const updatedProduct = await makeWooRequest(`products/${product.id}`, 'PUT', {
      type: 'variable',
      attributes: [
        {
          id: attributeId,
          name: 'Quantity',
          position: 0,
          visible: true,
          variation: true,
          options: terms.map(term => term.name)
        }
      ]
    });
    
    console.log(`✅ Converted ${product.name} to variable product`);
    
    // Create variations for each quantity
    const variations = [];
    
    for (const term of terms) {
      const quantity = term.slug;
      const price = QUANTITY_PRICING[quantity];
      
      if (price) {
        try {
          const variation = await makeWooRequest(`products/${product.id}/variations`, 'POST', {
            regular_price: price.toString(),
            attributes: [
              {
                id: attributeId,
                name: 'Quantity',
                option: term.name
              }
            ],
            manage_stock: false,
            status: 'publish'
          });
          
          console.log(`✅ Created variation for ${quantity} pack${quantity > 1 ? 's' : ''}: $${price}`);
          variations.push(variation);
        } catch (error) {
          console.error(`❌ Error creating variation for ${quantity}:`, error.message);
        }
      }
    }
    
    return { product: updatedProduct, variations };
    
  } catch (error) {
    console.error(`❌ Error updating product ${product.name}:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🍯 Starting edibles variation update...');
    console.log('💰 New pricing structure:');
    Object.entries(QUANTITY_PRICING).forEach(([qty, price]) => {
      console.log(`   ${qty} pack${qty > 1 ? 's' : ''}: $${price}`);
    });
    console.log('');
    
    // Get all edible products
    console.log('🔍 Fetching edible products...');
    const products = await makeWooRequest('products', 'GET');
    
    // Filter for edibles
    const edibleProducts = products.filter(product => 
      product.categories?.some(cat => 
        ['edibles', 'Edibles', 'edible', 'Edible'].includes(cat.name)
      ) || product.name.toLowerCase().includes('edible')
    );
    
    if (edibleProducts.length === 0) {
      console.log('❌ No edible products found. Make sure products are categorized as "edibles"');
      return;
    }
    
    console.log(`📦 Found ${edibleProducts.length} edible products`);
    
    // Create quantity attribute and terms
    const attributeId = await createQuantityAttribute();
    const terms = await createQuantityTerms(attributeId);
    
    if (terms.length === 0) {
      console.log('❌ No quantity terms created');
      return;
    }
    
    // Update each edible product
    console.log('\n🔄 Updating products...');
    const results = [];
    
    for (const product of edibleProducts) {
      try {
        const result = await updateEdibleProduct(product, attributeId, terms);
        results.push(result);
        console.log(`✅ Successfully updated: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error.message);
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Update complete!');
    console.log(`✅ Successfully updated ${results.length} products`);
    console.log('💡 Products now have quantity variations with the new pricing structure');
    
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