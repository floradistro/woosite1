// Server Component - no "use client" directive
import { getFlowerProducts } from './flower/constants';
import HomePageWrapper from './HomePageWrapper';

export default async function Home() {
  // Fetch flower products on the server
  const flowerProducts = await getFlowerProducts();
  // Take only first 6 products for the carousel
  const carouselProducts = flowerProducts.slice(0, 6);

  return <HomePageWrapper initialFlowerProducts={carouselProducts} />;
}
