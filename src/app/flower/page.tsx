// Server Component - no "use client" directive
import { getFlowerProducts } from './constants';
import { flowerConfig } from '../components/ProductCollectionConfig';
import ProductPageClientWrapper from '../components/ProductPageClientWrapper';

export default async function FlowerCollectionPage() {
  // Fetch products server-side
  const flowerProducts = await getFlowerProducts();

  return (
    <ProductPageClientWrapper 
      config={flowerConfig}
      products={flowerProducts}
      productType="flower"
    />
  );
}