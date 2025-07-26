// Server Component - no "use client" directive
import { getFlowerProducts } from './flower/constants';
import { getVapeProducts } from './vape/constants';
import { getConcentrateProducts } from './concentrate/constants';
import { getEdiblesProducts } from './edible/constants';
import { getMoonwaterProducts } from './moonwater/constants';
import HomePageWrapper from './HomePageWrapper';

export default async function Home() {
  // Fetch all product types on the server
  const [flowerProducts, vapeProducts, concentrateProducts, edibleProducts, moonwaterProducts] = await Promise.all([
    getFlowerProducts(),
    getVapeProducts(),
    getConcentrateProducts(),
    getEdiblesProducts(),
    getMoonwaterProducts()
  ]);
  
  // Take only first 6 products for each carousel
  const carouselFlowerProducts = flowerProducts.slice(0, 6);
  const carouselVapeProducts = vapeProducts.slice(0, 6);
  const carouselConcentrateProducts = concentrateProducts.slice(0, 6);
  const carouselEdibleProducts = edibleProducts.slice(0, 6);
  const carouselMoonwaterProducts = moonwaterProducts.slice(0, 6);

  return (
    <HomePageWrapper 
      initialFlowerProducts={carouselFlowerProducts}
      initialVapeProducts={carouselVapeProducts}
      initialConcentrateProducts={carouselConcentrateProducts}
      initialEdibleProducts={carouselEdibleProducts}
      initialMoonwaterProducts={carouselMoonwaterProducts}
    />
  );
}
