// Server Component - no "use client" directive
import { getConcentrateProducts } from './constants';
import { concentrateConfig } from '../components/ProductCollectionConfig';
import ProductPageClientWrapper from '../components/ProductPageClientWrapper';

export default async function ConcentrateCollectionPage() {
  // Fetch products server-side
  const concentrateProducts = await getConcentrateProducts();

  return (
    <ProductPageClientWrapper 
      config={concentrateConfig}
      products={concentrateProducts}
      productType="concentrate"
    />
  );
}