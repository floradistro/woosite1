const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

// Initialize WooCommerce API
const WooCommerce = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_STORE_URL || 'https://distropass.wpcomstaging.com',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: 'wc/v3'
});

// Vape quantity pricing
const VAPE_PRICING = {
  '1': 49.99,
  '2': 79.99,
  '3': 104.99,
  '4': 124.99
};

async function makeWooRequest(endpoint, method = 'GET', data = null) {
  try {
    let response;
    switch (method) {
      case 'POST':
        response = await WooCommerce.post(endpoint, data);
        break;
      case 'PUT':
        response = await WooCommerce.put(endpoint, data);
        break;
      case 'DELETE':
        response = await WooCommerce.delete(endpoint);
        break;
      default:
        response = await WooCommerce.get(endpoint);
    }
    return response.data;
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

async function getOrCreateQuantityAttribute() {
  try {
    // First, try to get existing Quantity attribute
    const attributes = await makeWooRequest('products/attributes');
    let quantityAttr = attributes.find(attr => attr.name === 'Quantity');
    
    if (quantityAttr) {
      console.log('✅ Found existing Quantity attribute:', quantityAttr.id);
      return quantityAttr.id;
    }
    
    // Create Quantity attribute if it doesn't exist
    quantityAttr = await makeWooRequest('products/attributes', 'POST', {
      name: 'Quantity',
      slug: 'quantity',
      type: 'select',
      order_by: 'menu_order',
      has_archives: false
    });
    
    console.log('✅ Created Quantity attribute:', quantityAttr.id);
    return quantityAttr.id;
  } catch (error) {
    console.error('❌ Error with Quantity attribute:', error.message);
    throw error;
  }
}

async function getOrCreateQuantityTerms(attributeId) {
  const quantities = ['1', '2', '3', '4'];
  const terms = [];
  
  for (const quantity of quantities) {
    try {
      // Try to get existing term
      const existingTerms = await makeWooRequest(`products/attributes/${attributeId}/terms`);
      let term = existingTerms.find(t => t.name === quantity);
      
      if (!term) {
        // Create term if it doesn't exist
        term = await makeWooRequest(`products/attributes/${attributeId}/terms`, 'POST', {
          name: quantity,
          slug: quantity
        });
        console.log(`✅ Created quantity term: ${quantity}`);
      }
      
      terms.push(term);
    } catch (error) {
      console.error(`❌ Error creating term ${quantity}:`, error.message);
    }
  }
  
  return terms;
}

async function updateVapeProduct(product, attributeId, terms) {
  console.log(`🔧 Updating vape product: ${product.name}`);
  
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
      const quantity = term.name;
      const price = VAPE_PRICING[quantity];
      
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
    console.log('🚀 Starting vape products update with tiered pricing...');
    
    // Get vape products
    const products = await makeWooRequest('products', 'GET', {
      category: '1374', // Vape category ID
      per_page: 100
    });
    
    console.log(`📦 Found ${products.length} vape products`);
    
    if (products.length === 0) {
      console.log('❌ No vape products found');
      return;
    }
    
    // Get or create Quantity attribute
    const attributeId = await getOrCreateQuantityAttribute();
    
    // Get or create quantity terms
    const terms = await getOrCreateQuantityTerms(attributeId);
    
    console.log(`📊 Quantity terms:`, terms.map(t => t.name));
    
    // Update each vape product
    const results = [];
    for (const product of products) {
      try {
        const result = await updateVapeProduct(product, attributeId, terms);
        results.push(result);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Update complete! Updated ${results.length} vape products with tiered pricing:`);
    console.log('📋 Pricing structure:');
    Object.entries(VAPE_PRICING).forEach(([qty, price]) => {
      console.log(`   ${qty} pack${qty > 1 ? 's' : ''}: $${price}`);
    });
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

main(); 