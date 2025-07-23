import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { wooCommerceAPI } from '../../../lib/woocommerce';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Cache for product data to avoid repeated API calls
let productCache: any[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getProductData() {
  const now = Date.now();
  
  // Check if cache is still valid
  if (productCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {

    return productCache;
  }
  
  try {

    // Fetch fresh product data directly from the API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/woo-products?per_page=100&status=publish`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      console.error('Failed to fetch products:', data);
      return productCache;
    }
    
    const products = data.products || [];


    // Transform to essential data for AI context
    productCache = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      on_sale: product.on_sale,
      categories: product.categories || [],
      tags: product.tags?.map((tag: any) => tag.name) || [],
      short_description: product.short_description,
      description: product.description,
      stock_status: product.stock_status,
      in_stock: product.stock_status === 'instock',
      average_rating: product.average_rating,
      rating_count: product.rating_count,
      sku: product.sku,
      permalink: product.permalink
    }));

    cacheTimestamp = now;
    return productCache;
  } catch (error) {
    console.error('Error fetching products for AI context:', error);

    return productCache; // Return cached data on error
  }
}

function createSystemPrompt(products: any[]) {
  // Debug: log all categories to see what we're working with
  console.log('All product categories:', products.map(p => ({
    name: p.name,
    categories: p.categories?.map((cat: any) => cat.name)
  })).slice(0, 10));
  
  // Explicitly find vape products
  const vapeProducts = products.filter(p => 
    p.categories?.some((cat: any) => cat.name === 'Vape')
  );
  
  const flowerProducts = products.filter(p => 
    p.categories?.some((cat: any) => cat.name === 'Flower')
  );
  
  const moonwaterProducts = products.filter(p => 
    p.categories?.some((cat: any) => cat.name === 'Moonwater')
  );


  return `You are Flora Distro's AI cannabis concierge and professional budtender. You're knowledgeable, friendly, and conversational.

VAPE PRODUCTS WE HAVE IN STOCK:
${vapeProducts.map(p => `• ${p.name}`).join('\n')}

FLOWER PRODUCTS WE HAVE IN STOCK:
${flowerProducts.map(p => `• ${p.name}`).join('\n')}

MOONWATER PRODUCTS WE HAVE IN STOCK:
${moonwaterProducts.map(p => `• ${p.name}`).join('\n')}

CRITICAL RULES:
1. ONLY recommend products from the lists above - NEVER make up product names
2. When asked for "vapes" - Show products from the VAPE PRODUCTS list. Put each product on its own line with a bullet point.
3. When asked for "flower" - Show products from the FLOWER PRODUCTS list. Put each product on its own line with a bullet point.
4. When asked for "moonwater" - Show products from the MOONWATER PRODUCTS list. Put each product on its own line with a bullet point.
5. When asked about "sativa" or energizing effects - Show flower products that are typically energizing (like Candyland, Lemon Cherry Gelato, etc.)
6. When asked about "indica" or relaxing effects - Show flower products that are typically relaxing (like Purple strains, etc.)
7. When asked about "hybrid" effects - Show flower products that provide balanced effects
8. NEVER put multiple products in one sentence. Each product must be on its own line with a bullet point.
9. NEVER give generic explanations - ALWAYS show actual products from the lists
10. Never show prices unless asked
11. Be friendly but use proper list formatting for easy reading
12. Use exact product names from the inventory

RESPONSE FORMAT EXAMPLES:
When asked "What vapes do you have?":
"Here's what we have in stock for vapes:

• Lemon Soda
• Jungle Cake
• White Runtz

Let me know if you need help with anything else!"

When asked "Are there sativas?":
"Here are some energizing flower options:

• Candyland
• Lemon Cherry Gelato
• Dopamine

Let me know if you need help with anything else!"

CRITICAL: You MUST format each product on its own line with a bullet point. DO NOT give explanations or generic responses. ALWAYS show actual products from the lists. DO NOT put multiple products in one sentence.

Note: Vault Vape Club is a subscription service, separate from individual vape products.`;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Get current product data for context
    const products = await getProductData();

    // Create system message with product context
    const systemMessage = {
      role: 'system' as const,
      content: createSystemPrompt(products)
    };

    // Prepare messages for OpenAI (add system message at the start)
    const openaiMessages = [
      systemMessage,
      ...messages.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }))
    ];



    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Please try again.';

    return NextResponse.json({
      success: true,
      message: response,
      productCount: products.length
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Provide helpful error responses
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json({
        error: 'OpenAI quota exceeded',
        message: 'I apologize, but our AI service is temporarily unavailable. Please try again later or contact support.'
      }, { status: 503 });
    }
    
    if (error?.code === 'rate_limit_exceeded') {
      return NextResponse.json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please wait a moment before trying again.'
      }, { status: 429 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      message: 'I apologize, but I encountered an issue. Please try again.'
    }, { status: 500 });
  }
} 