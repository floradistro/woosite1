import { NextRequest, NextResponse } from 'next/server';
import { wooCommerceServerAPI } from '@/lib/woocommerce-server';

export async function POST(request: NextRequest) {
  try {
    const { productId, stockQuantity } = await request.json();

    if (!productId || typeof stockQuantity !== 'number') {
      return NextResponse.json(
        { error: 'Product ID and stock quantity are required' },
        { status: 400 }
      );
    }

    // Update product stock in WooCommerce
    const updatedProduct = await wooCommerceServerAPI.updateProduct(productId, {
      stock_quantity: stockQuantity,
      stock_status: stockQuantity > 0 ? 'instock' : 'outofstock'
    });

    return NextResponse.json({
      success: true,
      productId,
      newStockQuantity: stockQuantity,
      stockStatus: stockQuantity > 0 ? 'instock' : 'outofstock'
    });

  } catch (error) {
    console.error('Error updating product stock:', error);
    return NextResponse.json(
      { error: 'Failed to update product stock' },
      { status: 500 }
    );
  }
} 