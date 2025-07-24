// Server-side Supabase functions for SSR
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseKey;

const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface COAFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

export interface COAFileWithCategory extends COAFile {
  category: string;
}

// List all COA categories (folders)
export async function listCOACategories(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured - returning empty categories');
    return [];
  }

  try {
    const { data, error } = await supabase.storage
      .from('coa')
      .list('', {
        limit: 100,
        offset: 0,
      });

    if (error) {
      console.error('Error listing COA categories:', error);
      return [];
    }

    // Filter out non-folder items and return folder names
    const folders = data
      ?.filter(item => !item.name.includes('.') && item.name !== '.emptyFolderPlaceholder')
      .map(item => item.name) || [];

    return folders;
  } catch (err) {
    console.error('Unexpected error in listCOACategories:', err);
    return [];
  }
}

// List all COA files in a specific category
export async function listCOAFiles(category: string): Promise<COAFile[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured - returning empty files');
    return [];
  }

  try {
    const { data, error } = await supabase.storage
      .from('coa')
      .list(category, {
        limit: 1000,
        offset: 0,
      });

    if (error) {
      console.error(`Error listing files in ${category}:`, error);
      return [];
    }

    // Filter only PDF files
    const pdfFiles = data?.filter(file => 
      file.name.toLowerCase().endsWith('.pdf') && 
      file.name !== '.emptyFolderPlaceholder'
    ) || [];

    return pdfFiles;
  } catch (err) {
    console.error(`Unexpected error listing files in ${category}:`, err);
    return [];
  }
}

// Get all COA files from all categories
export async function getAllCOAFiles(): Promise<COAFileWithCategory[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured - returning empty files');
    return [];
  }

  try {
    const categories = await listCOACategories();
    
    if (categories.length === 0) {
      return [];
    }

    const allFiles: COAFileWithCategory[] = [];
    
    for (const category of categories) {
      const files = await listCOAFiles(category);
      files.forEach(file => {
        allFiles.push({ ...file, category });
      });
    }

    // Sort files by category, then by name
    const sortedFiles = allFiles.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });

    return sortedFiles;
  } catch (err) {
    console.error('Error fetching all COA files:', err);
    return [];
  }
}

// Get public URL for downloading a COA file
export function getDownloadUrl(category: string, fileName: string): string {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured - returning empty URL');
    return '';
  }

  const { data } = supabase.storage
    .from('coa')
    .getPublicUrl(`${category}/${fileName}`);
  
  return data.publicUrl;
} 