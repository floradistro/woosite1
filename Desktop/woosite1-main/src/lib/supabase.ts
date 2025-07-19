import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to get signed URL for PDF files
export async function getSignedUrl(fileName: string, category: string = 'FLOWER') {
  try {
    const { data, error } = await supabase.storage
      .from('coa')
      .createSignedUrl(`${category}/${fileName}`, 60 * 60, {
        download: false, // Don't force download, allow inline viewing
      })
    
    if (error) {
      console.error('Error creating signed URL:', error)
      return null
    }
    
    return data.signedUrl
  } catch (err) {
    console.error('Unexpected error creating signed URL:', err)
    return null
  }
}

// Helper function to get download URL for PDF files
export async function getDownloadUrl(fileName: string, category: string = 'FLOWER') {
  try {
    const { data, error } = await supabase.storage
      .from('coa')
      .createSignedUrl(`${category}/${fileName}`, 60 * 60, {
        download: true, // Force download
      })
    
    if (error) {
      console.error('Error creating download URL:', error)
      return null
    }
    
    return data.signedUrl
  } catch (err) {
    console.error('Unexpected error creating download URL:', err)
    return null
  }
}

// Helper function to list all COA files from a specific category
export async function listCOAFiles(category: string = 'FLOWER') {
  try {
    const { data, error } = await supabase.storage
      .from('coa')
      .list(category, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) {
      console.error('Error listing files:', error)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('Unexpected error listing files:', err)
    return []
  }
}

// Helper function to list all available categories
export async function listCOACategories() {
  try {
    const { data, error } = await supabase.storage
      .from('coa')
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) {
      console.error('Error listing categories:', error)
      // If there's an error, return the expected categories
      return ['FLOWER', 'VAPE', 'EDIBLE', 'CONCENTRATE', 'MOONWATER']
    }
    
    // Filter to only return folders (categories)
    const detectedCategories = data?.filter(item => !item.name.includes('.'))?.map(category => category.name) || []
    
    // Define expected categories for cannabis products
    const expectedCategories = ['FLOWER', 'VAPE', 'EDIBLE', 'CONCENTRATE', 'MOONWATER']
    
    // Combine detected categories with expected ones, removing duplicates
    const allCategories = [...new Set([...expectedCategories, ...detectedCategories])]
    
    // Sort categories in a logical order for cannabis products
    const categoryOrder = ['FLOWER', 'VAPE', 'EDIBLE', 'CONCENTRATE', 'MOONWATER']
    return allCategories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a)
      const bIndex = categoryOrder.indexOf(b)
      
      // If both categories are in the order list, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }
      
      // If only one is in the order list, prioritize it
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      
      // If neither is in the order list, sort alphabetically
      return a.localeCompare(b)
    })
  } catch (err) {
    console.error('Unexpected error listing categories:', err)
    // If there's an unexpected error, return the expected categories
    return ['FLOWER', 'VAPE', 'EDIBLE', 'CONCENTRATE', 'MOONWATER']
  }
}

// Helper function to get all COA files from all categories
export async function getAllCOAFiles() {
  try {
    const categories = await listCOACategories()
    const allFiles: Array<{ file: any; category: string }> = []
    
    for (const category of categories) {
      const files = await listCOAFiles(category)
      files.forEach(file => {
        allFiles.push({ file, category })
      })
    }
    
    return allFiles
  } catch (err) {
    console.error('Unexpected error getting all COA files:', err)
    return []
  }
}

// Helper function to check if a file exists
export async function checkFileExists(fileName: string, category: string = 'FLOWER') {
  try {
    const { data, error } = await supabase.storage
      .from('coa')
      .list(category, {
        limit: 1,
        search: fileName
      })
    
    if (error) {
      console.error('Error checking file existence:', error)
      return false
    }
    
    return data && data.length > 0 && data.some(file => file.name === fileName)
  } catch (err) {
    console.error('Unexpected error checking file existence:', err)
    return false
  }
}

// Helper function to get file info
export async function getFileInfo(fileName: string, category: string = 'FLOWER') {
  try {
    const { data, error } = await supabase.storage
      .from('coa')
      .list(category, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) {
      console.error('Error getting file info:', error)
      return null
    }
    
    return data?.find(file => file.name === fileName) || null
  } catch (err) {
    console.error('Unexpected error getting file info:', err)
    return null
  }
}
