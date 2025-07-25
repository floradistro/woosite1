// Custom stock management for weight-based products

export interface WeightPricing {
  '1g': number;
  '3.5g': number;
  '7g': number;
  '14g': number;
  '28g': number;
}

export interface WeightProduct {
  id: number;
  name: string;
  stockQuantity: number; // Total stock in grams
  weightPricing: WeightPricing;
  productType: 'flower' | 'concentrate';
}

// Convert weight string to grams
export function weightToGrams(weight: string): number {
  const numStr = weight.replace('g', '');
  return parseFloat(numStr);
}

// Get price for selected weight
export function getPriceForWeight(weightPricing: WeightPricing, selectedWeight: string): number {
  return weightPricing[selectedWeight as keyof WeightPricing] || 0;
}

// Check if enough stock is available
export function isStockAvailable(totalStockGrams: number, requestedWeight: string): boolean {
  const requestedGrams = weightToGrams(requestedWeight);
  return totalStockGrams >= requestedGrams;
}

// Calculate remaining stock after purchase
export function calculateRemainingStock(currentStock: number, purchasedWeight: string): number {
  const purchasedGrams = weightToGrams(purchasedWeight);
  return Math.max(0, currentStock - purchasedGrams);
}

// Update WooCommerce product stock via API
export async function updateProductStock(productId: number, newStockQuantity: number) {
  try {
    const response = await fetch('/api/woo-products/update-stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        stockQuantity: newStockQuantity
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update stock');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
}

// Process purchase and update stock
export async function processPurchase(product: WeightProduct, selectedWeight: string, quantity: number = 1) {
  const totalGramsNeeded = weightToGrams(selectedWeight) * quantity;
  
  // Check stock availability
  if (!isStockAvailable(product.stockQuantity, selectedWeight)) {
    throw new Error(`Insufficient stock. Requested: ${totalGramsNeeded}g, Available: ${product.stockQuantity}g`);
  }

  // Calculate new stock
  const newStock = calculateRemainingStock(product.stockQuantity, selectedWeight);
  
  // Update stock in WooCommerce
  await updateProductStock(product.id, newStock);
  
  return {
    success: true,
    purchasedWeight: selectedWeight,
    gramsDeducted: totalGramsNeeded,
    remainingStock: newStock,
    price: getPriceForWeight(product.weightPricing, selectedWeight) * quantity
  };
}

// Get available weights based on current stock
export function getAvailableWeights(stockQuantity: number, weightPricing: WeightPricing): string[] {
  const allWeights = Object.keys(weightPricing);
  return allWeights.filter(weight => isStockAvailable(stockQuantity, weight));
}

// Format stock display
export function formatStockDisplay(stockQuantity: number): string {
  if (stockQuantity >= 28) {
    const ounces = Math.floor(stockQuantity / 28);
    const remainingGrams = stockQuantity % 28;
    return remainingGrams > 0 
      ? `${ounces} oz ${remainingGrams}g` 
      : `${ounces} oz`;
  } else {
    return `${stockQuantity}g`;
  }
}

// Get stock status color
export function getStockStatusColor(stockQuantity: number): string {
  if (stockQuantity >= 100) return 'text-green-500';
  if (stockQuantity >= 28) return 'text-yellow-500';
  if (stockQuantity >= 7) return 'text-orange-500';
  return 'text-red-500';
}

// Get stock status text
export function getStockStatusText(stockQuantity: number): string {
  if (stockQuantity >= 100) return 'In Stock';
  if (stockQuantity >= 28) return 'Limited Stock';
  if (stockQuantity >= 7) return 'Low Stock';
  if (stockQuantity > 0) return 'Very Low Stock';
  return 'Out of Stock';
} 