// Server Component - no "use client" directive
import { getEdiblesProducts } from './constants';
import EdiblesPage from './components/EdiblesPage';

export default async function EdiblesCollectionPage() {
  // Fetch products server-side
  const ediblesProducts = await getEdiblesProducts();

  return (
    <EdiblesPage products={ediblesProducts} />
  );
}