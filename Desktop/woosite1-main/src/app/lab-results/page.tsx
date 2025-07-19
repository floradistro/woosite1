'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Search, FileText, Calendar, HardDrive, Loader2, ExternalLink, AlertCircle, Filter } from 'lucide-react';
import { listCOACategories, listCOAFiles, getDownloadUrl } from '@/lib/supabase';

interface COAFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

interface COAFileWithCategory extends COAFile {
  category: string;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  FLOWER: { label: 'Flower', color: 'bg-green-600 hover:bg-green-700' },
  VAPE: { label: 'Vape', color: 'bg-purple-600 hover:bg-purple-700' },
  EDIBLE: { label: 'Edibles', color: 'bg-orange-600 hover:bg-orange-700' },
  CONCENTRATE: { label: 'Concentrates', color: 'bg-yellow-600 hover:bg-yellow-700' },
  MOONWATER: { label: 'Moonwater', color: 'bg-blue-600 hover:bg-blue-700' },
};

export default function LabResultsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [coaFiles, setCoaFiles] = useState<COAFileWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewerLoading, setViewerLoading] = useState<string | null>(null);

  // Fetch categories and files on component mount
  useEffect(() => {
    fetchCategoriesAndFiles();
  }, []);

  const fetchCategoriesAndFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all available categories
      const availableCategories = await listCOACategories();
      
      if (availableCategories.length === 0) {
        setError('No COA categories found. Please upload COA files to your Supabase "coa" bucket.');
        return;
      }

      setCategories(availableCategories);

      // Get files from all categories
      const allFiles: COAFileWithCategory[] = [];
      
      for (const category of availableCategories) {
        const files = await listCOAFiles(category);
        files.forEach(file => {
          allFiles.push({ ...file, category });
        });
      }

      if (allFiles.length === 0) {
        setError('No COA files found. Please upload PDF files to the category folders in your Supabase "coa" bucket.');
        return;
      }

      // Sort files by category, then by name
      const sortedFiles = allFiles.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });

      setCoaFiles(sortedFiles);
      
    } catch (err) {
      console.error('Error fetching COA data:', err);
      setError('Failed to load COA files. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = async (file: COAFileWithCategory) => {
    try {
      setViewerLoading(file.id);
      
      // Use proxy endpoint to open in new tab with category
      const proxyUrl = `/api/coa-proxy?file=${encodeURIComponent(file.name)}&category=${encodeURIComponent(file.category)}`;
      
      // Open in new tab with optimized size for COA viewing
      window.open(proxyUrl, '_blank', 'width=1200,height=900,scrollbars=yes,resizable=yes,toolbar=yes');
      
    } catch (err) {
      console.error('Error opening COA document:', err);
      setError('Failed to open COA document. Please try again.');
    } finally {
      setViewerLoading(null);
    }
  };

  const handleDownload = async (file: COAFileWithCategory) => {
    try {
      const downloadUrl = await getDownloadUrl(file.name, file.category);
      
      if (!downloadUrl) {
        throw new Error('Failed to generate download URL');
      }

      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter files based on selected category and search term
  const filteredFiles = coaFiles.filter(file => {
    const matchesCategory = selectedCategory === 'ALL' || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group files by category for display
  const groupedFiles = filteredFiles.reduce((acc, file) => {
    if (!acc[file.category]) {
      acc[file.category] = [];
    }
    acc[file.category].push(file);
    return acc;
  }, {} as Record<string, COAFileWithCategory[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white/70 mx-auto mb-4" />
          <p className="text-xl text-white/70 font-light">Loading COA documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white font-light">
      {/* Hero Section */}
      <div className="bg-[#464646] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-luxury-4xl font-light mb-4 tracking-luxury-tight text-white/95">Lab Results</h1>
            <p className="text-luxury-lg text-white/75 max-w-3xl mx-auto font-light tracking-luxury-normal leading-relaxed">
              Access Certificate of Analysis (COA) documents for all our products across all categories.
              <br className="hidden md:block" />
              Click "View COA" to open documents in a new tab for detailed review.
            </p>
            <p className="text-luxury-sm text-white/60 mt-2 font-light tracking-luxury-wide">
              Transparency and quality assurance you can trust.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl border border-red-500/30"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)'
            }}
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
              <p className="text-red-200 font-light">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300 transition-colors text-xl"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Controls Section */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div 
              className="relative rounded-2xl border border-white/20 overflow-hidden"
              style={{
                background: '#4a4a4a',
                backdropFilter: 'blur(20px) saturate(120%)',
                WebkitBackdropFilter: 'blur(20px) saturate(120%)'
              }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search COA files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 font-light"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-lg font-light transition-all duration-300 border ${
                selectedCategory === 'ALL'
                  ? 'bg-white/10 text-white border-white/30 backdrop-blur-xl'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl'
              }`}
            >
              <Filter className="h-4 w-4 inline mr-2" />
              All Categories ({coaFiles.length})
            </button>
            {categories.map((category) => {
              const categoryInfo = CATEGORY_LABELS[category] || { label: category, color: 'bg-gray-600 hover:bg-gray-700' };
              const count = coaFiles.filter(f => f.category === category).length;
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-light transition-all duration-300 flex items-center border ${
                    selectedCategory === category
                      ? 'bg-white/10 text-white border-white/30 backdrop-blur-xl'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl'
                  }`}
                >
                  {categoryInfo.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Files Display */}
        <AnimatePresence mode="wait">
          {Object.keys(groupedFiles).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="mb-6">
                <FileText className="h-16 w-16 text-white/30 mx-auto" />
              </div>
              <h3 className="text-luxury-xl font-light text-white/70 mb-3">
                {searchTerm 
                  ? 'No matching files found' 
                  : selectedCategory !== 'ALL' 
                    ? `No COA files in ${CATEGORY_LABELS[selectedCategory]?.label || selectedCategory} yet`
                    : 'No COA files available'}
              </h3>
              <p className="text-luxury-base text-white/50 font-light max-w-md mx-auto leading-relaxed">
                {searchTerm 
                  ? 'Try adjusting your search terms or selecting a different category' 
                  : selectedCategory !== 'ALL'
                    ? `COA documents for ${CATEGORY_LABELS[selectedCategory]?.label || selectedCategory} will appear here once uploaded to the "${selectedCategory}" folder in your Supabase "coa" bucket.`
                    : 'COA documents will appear here once uploaded to your Supabase "coa" bucket'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {Object.entries(groupedFiles).map(([category, files]) => {
                const categoryInfo = CATEGORY_LABELS[category] || { label: category, icon: '📄', color: 'bg-gray-600 hover:bg-gray-700' };
                
                return (
                  <div key={category} className="space-y-6">
                    {selectedCategory === 'ALL' && (
                      <div className="flex items-center space-x-4">
                        <h2 className="text-luxury-2xl font-light text-white/95">{categoryInfo.label}</h2>
                        <span className={`px-3 py-1 rounded-full text-luxury-sm font-light ${
                          files.length > 0 
                            ? 'bg-white/10 text-white/70' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {files.length > 0 ? `${files.length} files` : 'No files yet'}
                        </span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {files.map((file) => (
                        <motion.div
                          key={`${file.category}-${file.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden"
                          style={{
                            background: '#4a4a4a',
                            backdropFilter: 'blur(20px) saturate(120%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(120%)'
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-start space-x-4 mb-4">
                              <div className={`p-3 rounded-xl ${categoryInfo.color.split(' ')[0]} flex-shrink-0`}>
                                <FileText className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-luxury-lg font-light text-white/95 mb-1 truncate" title={file.name.replace('.pdf', '')}>
                                  {file.name.replace('.pdf', '')}
                                </h3>
                                <p className="text-luxury-sm text-white/60 font-light">{categoryInfo.label}</p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-6">
                              <div className="flex items-center text-luxury-sm text-white/50">
                                <HardDrive className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="font-light">{formatFileSize(file.metadata?.size || 0)}</span>
                              </div>
                              <div className="flex items-center text-luxury-sm text-white/50">
                                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="font-light">{formatDate(file.created_at)}</span>
                              </div>
                            </div>

                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleViewFile(file)}
                                disabled={viewerLoading === file.id}
                                className={`flex-1 ${categoryInfo.color} disabled:bg-white/10 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center font-light`}
                              >
                                {viewerLoading === file.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View COA
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleDownload(file)}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-white/30 font-light"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
