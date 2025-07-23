import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase credentials for COA functionality
const supabaseUrl = 'https://sclisxgtuktqgmaanonf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbGlzeGd0dWt0cWdtYWFub25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NjMxNDAsImV4cCI6MjA2ODQzOTE0MH0.GpkqGjOCYJ59Bj6MNYxatESAVNjeoN1T1Hp7Px3EYeI'

console.log('🔧 Supabase URL:', supabaseUrl)
console.log('🔧 Supabase Key (first 50 chars):', supabaseKey.substring(0, 50))
console.log('🚀 Supabase lib loaded successfully!')

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to get signed URL for PDF files
export async function getSignedUrl(fileName: string) {
  const fullPath = `flower/${fileName}`;
  console.log('🔗 Creating signed URL for:', fullPath);
  
  const { data, error } = await supabase.storage
    .from('coa')
    .createSignedUrl(fullPath, 60 * 60) // 1 hour expiry
  
  if (error) {
    console.error('Error creating signed URL:', error)
    return null
  }
  
  console.log('✅ Signed URL created successfully');
  return data.signedUrl
}

// Helper function to list all COA files
export async function listCOAFiles() {
  console.log('🔍 Listing files from coa bucket/flower folder...');
  
  const { data, error } = await supabase.storage
    .from('coa')
    .list('flower', {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' }
    })
  
  if (error) {
    console.error('❌ Error listing files:', error)
    console.error('Error details:', error.message)
    return []
  }
  
  console.log('✅ Raw data from Supabase:', data);
  console.log('📊 Found', data?.length || 0, 'files in flower folder');
  return data || []
} 