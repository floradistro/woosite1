// Server Component - no "use client" directive
import { getMoonwaterProducts, type MoonwaterProductWithVariations } from './constants';
import MoonwaterPage from './components/MoonwaterPage';

export default async function MoonwaterCollectionPage() {
  // Fetch products server-side with variations
  const moonwaterProducts: MoonwaterProductWithVariations[] = await getMoonwaterProducts();

  return (
    <MoonwaterPage products={moonwaterProducts} />
  );
}