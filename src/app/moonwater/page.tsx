// Server Component - no "use client" directive
import { getMoonwaterProducts } from './constants';
import { moonwaterConfig } from '../components/ProductCollectionConfig';
import ProductPageClientWrapper from '../components/ProductPageClientWrapper';

export default async function MoonwaterCollectionPage() {
  // Fetch products server-side
  const moonwaterProducts = await getMoonwaterProducts();

  return (
    <ProductPageClientWrapper 
      config={moonwaterConfig}
      products={moonwaterProducts}
      productType="moonwater"
    />
  );
}