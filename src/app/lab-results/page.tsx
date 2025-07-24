// Server Component - no "use client" directive
import { listCOACategories, getAllCOAFiles } from '@/lib/supabase-server';
import LabResultsWrapper from './LabResultsWrapper';

export default async function LabResultsPage() {
  // Fetch data on the server
  const [categories, allFiles] = await Promise.all([
    listCOACategories(),
    getAllCOAFiles()
  ]);

  return <LabResultsWrapper initialCategories={categories} initialFiles={allFiles} />;
}
