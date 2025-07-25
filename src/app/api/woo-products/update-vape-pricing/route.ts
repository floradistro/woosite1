import { NextRequest, NextResponse } from 'next/server';

// Vape quantity pricing
const VAPE_PRICING = {
  '1': 49.99,
  '2': 79.99,
  '3': 104.99,
  '4': 124.99
};

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting vape products update with tiered pricing...');
    
    // Get WooCommerce credentials
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL || 
                    process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 
                    'https://distropass.wpcomstaging.com';
    
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 
                       process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 
                          process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json(
        { error: 'WooCommerce credentials not configured' },
        { status: 500 }
      );
    }

    // Helper function to make WooCommerce API requests
    async function makeWooRequest(endpoint: string, method = 'GET', data: any = null) {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const url = `${storeUrl}/wp-json/wc/v3/${endpoint}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      return response.json();
    }

    // Get vape products
    const products = await makeWooRequest('products?category=1374&per_page=100');
    
    console.log(`📦 Found ${products.length} vape products`);
    
    if (products.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No vape products found',
        count: 0
      });
    }

    // Get or create Quantity attribute
    let quantityAttr;
    try {
      const attributes = await makeWooRequest('products/attributes');
      quantityAttr = attributes.find((attr: any) => attr.name === 'Quantity');
      
      if (!quantityAttr) {
        quantityAttr = await makeWooRequest('products/attributes', 'POST', {
          name: 'Quantity',
          slug: 'quantity',
          type: 'select',
          order_by: 'menu_order',
          has_archives: false
        });
        console.log('✅ Created Quantity attribute:', quantityAttr.id);
      } else {
        console.log('✅ Found existing Quantity attribute:', quantityAttr.id);
      }
    } catch (error) {
      console.error('❌ Error with Quantity attribute:', error);
      throw error;
    }

    // Get or create quantity terms
    const quantities = ['1', '2', '3', '4'];
    const terms = [];
    
    for (const quantity of quantities) {
      try {
        const existingTerms = await makeWooRequest(`products/attributes/${quantityAttr.id}/terms`);
        let term = existingTerms.find((t: any) => t.name === quantity);
        
        if (!term) {
          term = await makeWooRequest(`products/attributes/${quantityAttr.id}/terms`, 'POST', {
            name: quantity,
            slug: quantity
          });
          console.log(`✅ Created quantity term: ${quantity}`);
        }
        
        terms.push(term);
      } catch (error) {
        console.error(`❌ Error creating term ${quantity}:`, error);
      }
    }

    console.log(`📊 Quantity terms:`, terms.map(t => t.name));

    // Update each vape product
    const results = [];
    for (const product of products) {
      try {
        console.log(`🔧 Updating vape product: ${product.name}`);
        
        // Convert to variable product with quantity attribute
        const updatedProduct = await makeWooRequest(`products/${product.id}`, 'PUT', {
          type: 'variable',
          attributes: [
            {
              id: quantityAttr.id,
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
          const price = VAPE_PRICING[quantity as keyof typeof VAPE_PRICING];
          
          if (price) {
            try {
              const variation = await makeWooRequest(`products/${product.id}/variations`, 'POST', {
                regular_price: price.toString(),
                attributes: [
                  {
                    id: quantityAttr.id,
                    name: 'Quantity',
                    option: term.name
                  }
                ],
                manage_stock: false,
                status: 'publish'
              });
              
              console.log(`✅ Created variation for ${quantity} pack${quantity !== '1' ? 's' : ''}: $${price}`);
              variations.push(variation);
            } catch (error) {
              console.error(`❌ Error creating variation for ${quantity}:`, error);
            }
          }
        }
        
        results.push({ product: updatedProduct, variations });
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error);
      }
    }

    console.log(`\n🎉 Update complete! Updated ${results.length} vape products with tiered pricing:`);
    console.log('📋 Pricing structure:');
    Object.entries(VAPE_PRICING).forEach(([qty, price]) => {
      console.log(`   ${qty} pack${qty !== '1' ? 's' : ''}: $${price}`);
    });

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${results.length} vape products with tiered pricing`,
      count: results.length,
      pricing: VAPE_PRICING,
      products: results.map(r => ({
        id: r.product.id,
        name: r.product.name,
        variations: r.variations.length
      }))
    });
    
  } catch (error) {
    console.error('❌ API endpoint failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update vape pricing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 