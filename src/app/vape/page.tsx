// Server Component - no "use client" directive
import { getVapeProducts } from './constants';
import { vapeConfig } from '../components/ProductCollectionConfig';
import ProductPageClientWrapper from '../components/ProductPageClientWrapper';

export default async function VapeCollectionPage() {
  // Fetch products server-side
  const vapeProducts = await getVapeProducts();

  return (
    <ProductPageClientWrapper 
      config={vapeConfig}
      products={vapeProducts}
      productType="vape"
    />
  );
}