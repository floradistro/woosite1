'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Search, FileText, Calendar, HardDrive, Loader2, ExternalLink, AlertCircle, Filter } from 'lucide-react';
import { getDownloadUrl, COAFileWithCategory } from '@/lib/supabase-server';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  FLOWER: { label: 'Flower', color: 'bg-green-600 hover:bg-green-700' },
  VAPE: { label: 'Vape', color: 'bg-purple-600 hover:bg-purple-700' },
  EDIBLE: { label: 'Edibles', color: 'bg-orange-600 hover:bg-orange-700' },
  CONCENTRATE: { label: 'Concentrates', color: 'bg-yellow-600 hover:bg-yellow-700' },
  MOONWATER: { label: 'Moonwater', color: 'bg-blue-600 hover:bg-blue-700' },
};

interface LabResultsWrapperProps {
  initialCategories: string[];
  initialFiles: COAFileWithCategory[];
}

export default function LabResultsWrapper({ initialCategories, initialFiles }: LabResultsWrapperProps) {
  const [categories] = useState<string[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [coaFiles] = useState<COAFileWithCategory[]>(initialFiles);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewerLoading, setViewerLoading] = useState<string | null>(null);

  // Filter files based on category and search term
  const filteredFiles = coaFiles.filter(file => {
    const matchesCategory = selectedCategory === 'ALL' || file.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract product name from filename
  const extractProductName = (filename: string) => {
    // Remove .pdf extension and any date patterns
    let name = filename.replace('.pdf', '');
    name = name.replace(/\d{4}-\d{2}-\d{2}/, '').trim();
    name = name.replace(/_/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Handle file view
  const handleView = (file: COAFileWithCategory) => {
    setViewerLoading(file.id);
    const url = getDownloadUrl(file.category, file.name);
    window.open(url, '_blank');
    setTimeout(() => setViewerLoading(null), 1000);
  };

  // Handle file download
  const handleDownload = async (file: COAFileWithCategory) => {
    const url = getDownloadUrl(file.category, file.name);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-light mb-4">Lab Results & COAs</h1>
          <p className="text-gray-400">
            Certificate of Analysis for all our products. Updated regularly with batch-specific test results.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? `${CATEGORY_LABELS[category]?.color || 'bg-gray-600'} text-white`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {CATEGORY_LABELS[category]?.label || category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-400">
          Showing {filteredFiles.length} of {coaFiles.length} results
        </div>

        {/* Files Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-500">Error Loading Files</h3>
              <p className="text-gray-400 mt-1">{error}</p>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-light text-gray-400 mb-2">No Results Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No COA files available'}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-800 rounded-lg border border-gray-700 hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/10 group"
                >
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                        CATEGORY_LABELS[file.category]?.color || 'bg-gray-600'
                      }`}>
                        {CATEGORY_LABELS[file.category]?.label || file.category}
                      </span>
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-medium mb-2 group-hover:text-emerald-400 transition-colors">
                      {extractProductName(file.name)}
                    </h3>

                    {/* File Info */}
                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Updated: {formatDate(file.updated_at)}</span>
                      </div>
                      {file.metadata?.size && (
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4" />
                          <span>{formatFileSize(file.metadata.size)}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(file)}
                        disabled={viewerLoading === file.id}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {viewerLoading === file.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ExternalLink className="w-4 h-4" />
                        )}
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-light mb-4">About Our Lab Results</h2>
          <div className="space-y-4 text-gray-400">
            <p>
              All products are tested by independent, ISO-certified laboratories to ensure quality, 
              potency, and safety. Each Certificate of Analysis (COA) includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cannabinoid profile and potency testing</li>
              <li>Pesticide and heavy metals screening</li>
              <li>Microbial and mycotoxin analysis</li>
              <li>Terpene profile (where applicable)</li>
            </ul>
            <p>
              Results are updated with each new batch. For questions about specific test results, 
              please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 