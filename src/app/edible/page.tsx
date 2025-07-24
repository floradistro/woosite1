// Server Component - no "use client" directive
import { getEdiblesProducts } from './constants';
import { edibleConfig } from '../components/ProductCollectionConfig';
import ProductPageClientWrapper from '../components/ProductPageClientWrapper';

export default async function EdiblesCollectionPage() {
  // Fetch products server-side
  const ediblesProducts = await getEdiblesProducts();

  return (
    <ProductPageClientWrapper 
      config={edibleConfig}
      products={ediblesProducts}
      productType="edible"
    />
  );
}