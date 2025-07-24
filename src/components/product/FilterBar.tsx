'use client';

// React import not needed in React 17+
import { ChevronDown, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterBarProps {
  sortBy: string;
  filterCategory: 'all' | 'indica' | 'sativa' | 'hybrid';
  filterVibe: 'all' | 'relax' | 'energize' | 'balance';
  filterNose?: 'all' | 'candy' | 'gas' | 'cake' | 'funk' | 'sherb';
  filterType?: 'all' | 'gummies' | 'chocolates' | 'mints' | 'cookies' | 'caramels';
  filterTexture?: 'all' | 'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin';
  filterFlavor?: 'all' | 'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint';
  format: string;
  formats?: { primary: string; secondary?: string };
  onSortChange: (value: string) => void;
  onCategoryChange: (value: 'all' | 'indica' | 'sativa' | 'hybrid') => void;
  onVibeChange: (value: 'all' | 'relax' | 'energize' | 'balance') => void;
  onNoseChange?: (value: 'all' | 'candy' | 'gas' | 'cake' | 'funk' | 'sherb') => void;
  onTypeChange?: (value: 'all' | 'gummies' | 'chocolates' | 'mints' | 'cookies' | 'caramels') => void;
  onTextureChange?: (value: 'all' | 'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin') => void;
  onFlavorChange?: (value: 'all' | 'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint') => void;
  onFormatChange: (value: string) => void;
  productCount: number;
  totalCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  filterCategory,
  filterVibe,
  filterNose,
  filterType,
  filterTexture,
  filterFlavor,
  format,
  formats,
  onSortChange,
  onCategoryChange,
  onVibeChange,
  onNoseChange,
  onTypeChange,
  onTextureChange,
  onFlavorChange,
  onFormatChange,
  productCount,
  totalCount
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Check if filter bar should be sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerHeight = 80; // Actual header height on mobile
      setIsSticky(scrollPosition > headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile filters on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileFiltersOpen(false);
      }
    };

    if (isMobileFiltersOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileFiltersOpen]);

  // Determine which secondary filter to use
  const secondaryFilter = filterNose || filterType || filterTexture || filterFlavor;
  const onSecondaryChange = onNoseChange || onTypeChange || onTextureChange || onFlavorChange;
  
  // Check if this is an edibles page (has filterType defined)
  const isEdiblesPage = filterType !== undefined;
  
  // Get secondary filter options based on product type
  const getSecondaryOptions = () => {
    if (filterNose !== undefined) return ['all', 'candy', 'gas', 'cake', 'funk', 'sherb'];
    if (filterType !== undefined) return ['all', 'cookies', 'gummies']; // Only cookies and gummies for edibles
    if (filterTexture !== undefined) return ['all', 'shatter', 'budder', 'sauce', 'diamonds', 'rosin'];
    if (filterFlavor !== undefined) return ['all', 'citrus', 'berry', 'tropical', 'herbal', 'mint'];
    return [];
  };

  const getSecondaryLabel = () => {
    if (filterNose !== undefined) return 'Nose';
    if (filterType !== undefined) return 'Type';
    if (filterTexture !== undefined) return 'Texture';
    if (filterFlavor !== undefined) return 'Flavor';
    return '';
  };

  // Count active filters - exclude category and vibe for edibles
  const activeFilters = [
    !isEdiblesPage && filterCategory !== 'all' ? 1 : 0,
    !isEdiblesPage && filterVibe !== 'all' ? 1 : 0,
    secondaryFilter !== 'all' ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  // Clear all filters
  const clearAllFilters = () => {
    if (!isEdiblesPage) {
      onCategoryChange('all');
      onVibeChange('all');
    }
    if (onSecondaryChange) onSecondaryChange('all' as any);
  };

  return (
    <>
      <div 
        className={`
          sticky top-0 z-40 transition-all duration-300 ease-in-out
          ${isSticky 
            ? 'bg-[#4a4a4a]/95 backdrop-blur-md shadow-xl border-b border-white/10' 
            : 'bg-[#4a4a4a] border-b border-white/5'
          }
        `}
      >
        <div className="max-w-7xl mx-auto">
          {/* Desktop Filter Bar */}
          <div className="hidden lg:flex items-center justify-between px-4 py-1">
            {/* Left side filters */}
            <div className="flex items-center gap-2 flex-1">
              {/* Format Toggle - show for flower and moonwater collections */}
              {formats?.secondary && (formats.primary === 'flower' || formats.primary === 'bottle') && (
                <div className="flex items-center gap-5">
                  <span className="text-white/60 text-lg font-normal">
                    {formats.primary === 'flower' ? 'Need pre rolls?' : 'Want multi-packs?'}
                  </span>
                  <div 
                    className={`relative inline-flex items-center rounded-full cursor-pointer transition-colors duration-200 ${
                      format === formats.secondary ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                    style={{ width: '51px', height: '31px' }}
                    onClick={() => onFormatChange(format === formats.secondary ? formats.primary : formats.secondary!)}
                  >
                    <span
                      className={`inline-block transform rounded-full bg-white transition-transform duration-200 ${
                        format === formats.secondary ? 'translate-x-5' : 'translate-x-1'
                      }`}
                      style={{ width: '27px', height: '27px' }}
                    />
                  </div>
                </div>
              )}

              {/* Sort dropdown */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="appearance-none bg-[#3a3a3a] text-white text-sm px-2 py-1 pr-6 rounded-lg border border-white/20 hover:border-white/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="thc">THC: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>

              {/* Category filter - hide for edibles */}
              {!isEdiblesPage && (
                <div className="relative group">
                  <select
                    value={filterCategory}
                    onChange={(e) => onCategoryChange(e.target.value as any)}
                    className="appearance-none bg-[#3a3a3a] text-white text-sm px-2 py-1 pr-6 rounded-lg border border-white/20 hover:border-white/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="all">All Types</option>
                    <option value="indica">Indica</option>
                    <option value="sativa">Sativa</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
              )}

              {/* Vibe filter - hide for edibles */}
              {!isEdiblesPage && (
                <div className="relative group">
                  <select
                    value={filterVibe}
                    onChange={(e) => onVibeChange(e.target.value as any)}
                    className="appearance-none bg-[#3a3a3a] text-white text-sm px-2 py-1 pr-6 rounded-lg border border-white/20 hover:border-white/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="all">All Vibes</option>
                    <option value="relax">Relax</option>
                    <option value="energize">Energize</option>
                    <option value="balance">Balance</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
              )}

              {/* Secondary filter (Nose/Type/Texture/Flavor) */}
              {secondaryFilter && onSecondaryChange && (
                <div className="relative group">
                  <select
                    value={secondaryFilter}
                    onChange={(e) => onSecondaryChange(e.target.value as any)}
                    className="appearance-none bg-[#3a3a3a] text-white text-sm px-2 py-1 pr-6 rounded-lg border border-white/20 hover:border-white/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="all">All {getSecondaryLabel()}</option>
                    {getSecondaryOptions().slice(1).map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
              )}

              {/* Clear filters button */}
              {activeFilters > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  Clear ({activeFilters})
                </button>
              )}
            </div>

            {/* Right side - product count */}
            <div className="text-white/60 text-sm whitespace-nowrap ml-4">
              Showing {productCount} of {totalCount} products
            </div>
          </div>

          {/* Mobile Filter Bar */}
          <div className="lg:hidden px-4 py-1">
            <div className="flex items-center justify-between">
              {/* Left: Product count */}
              <div className="text-white/60 text-sm">
                {productCount} of {totalCount}
              </div>

              {/* Center: Format toggle (if flower or moonwater collection) */}
              {formats?.secondary && (formats.primary === 'flower' || formats.primary === 'bottle') && (
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-base font-normal">
                    {formats.primary === 'flower' ? 'Need pre rolls?' : 'Want multi-packs?'}
                  </span>
                  <div 
                    className={`relative inline-flex items-center rounded-full cursor-pointer transition-colors duration-200 ${
                      format === formats.secondary ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                    style={{ width: '51px', height: '31px' }}
                    onClick={() => onFormatChange(format === formats.secondary ? formats.primary : formats.secondary!)}
                  >
                    <span
                      className={`inline-block transform rounded-full bg-white transition-transform duration-200 ${
                        format === formats.secondary ? 'translate-x-5' : 'translate-x-1'
                      }`}
                      style={{ width: '27px', height: '27px' }}
                    />
                  </div>
                </div>
              )}

              {/* Right: Filter button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-2 bg-black hover:bg-gray-900 px-3 py-2 rounded-lg transition-colors text-white"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
                {activeFilters > 0 && (
                  <span className="bg-white text-black text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-x-0 bottom-0 bg-[#4a4a4a] rounded-t-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full appearance-none bg-[#3a3a3a] text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="thc">THC: High to Low</option>
                </select>
              </div>

              {/* Category - hide for edibles */}
              {!isEdiblesPage && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Type</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => onCategoryChange(e.target.value as any)}
                    className="w-full appearance-none bg-[#3a3a3a] text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="all">All Types</option>
                    <option value="indica">Indica</option>
                    <option value="sativa">Sativa</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              )}

              {/* Vibe - hide for edibles */}
              {!isEdiblesPage && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Vibe</label>
                  <select
                    value={filterVibe}
                    onChange={(e) => onVibeChange(e.target.value as any)}
                    className="w-full appearance-none bg-[#3a3a3a] text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="all">All Vibes</option>
                    <option value="relax">Relax</option>
                    <option value="energize">Energize</option>
                    <option value="balance">Balance</option>
                  </select>
                </div>
              )}

              {/* Secondary filter */}
              {secondaryFilter && onSecondaryChange && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">{getSecondaryLabel()}</label>
                  <select
                    value={secondaryFilter}
                    onChange={(e) => onSecondaryChange(e.target.value as any)}
                    className="w-full appearance-none bg-[#3a3a3a] text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="all">All {getSecondaryLabel()}</option>
                    {getSecondaryOptions().slice(1).map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex gap-3">
              {activeFilters > 0 && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 px-4 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar; 