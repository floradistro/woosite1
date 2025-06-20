// React import not needed in React 17+
import { ChevronDown } from 'lucide-react';

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
  // Determine which secondary filter to use
  const secondaryFilter = filterNose || filterType || filterTexture || filterFlavor;
  const onSecondaryChange = onNoseChange || onTypeChange || onTextureChange || onFlavorChange;
  
  // Get secondary filter options based on product type
  const getSecondaryOptions = () => {
    if (filterNose !== undefined) return ['all', 'candy', 'gas', 'cake', 'funk', 'sherb'];
    if (filterType !== undefined) return ['all', 'gummies', 'chocolates', 'mints', 'cookies', 'caramels'];
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

  return (
    <div className="sticky top-[60px] z-40 bg-[#3a3a3a] border-b border-white/10 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left side filters */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Format Toggle - only show if secondary format exists */}
            {formats?.secondary && (
              <div className="flex items-center bg-[#2a2a2a] rounded-lg p-1">
                <button
                  onClick={() => onFormatChange(formats.primary)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    format === formats.primary
                      ? 'bg-emerald-500 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {formats.primary.charAt(0).toUpperCase() + formats.primary.slice(1)}
                </button>
                <button
                  onClick={() => onFormatChange(formats.secondary!)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    format === formats.secondary
                      ? 'bg-emerald-500 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {formats.secondary!.charAt(0).toUpperCase() + formats.secondary!.slice(1).replace('-', ' ')}
                </button>
              </div>
            )}

            {/* Sort dropdown */}
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none bg-[#2a2a2a] text-white px-4 py-2 pr-10 rounded-lg border border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="thc">THC: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>

            {/* Category filter */}
            <div className="relative group">
              <select
                value={filterCategory}
                onChange={(e) => onCategoryChange(e.target.value as any)}
                className="appearance-none bg-[#2a2a2a] text-white px-4 py-2 pr-10 rounded-lg border border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="indica">Indica</option>
                <option value="sativa">Sativa</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>

            {/* Vibe filter */}
            <div className="relative group">
              <select
                value={filterVibe}
                onChange={(e) => onVibeChange(e.target.value as any)}
                className="appearance-none bg-[#2a2a2a] text-white px-4 py-2 pr-10 rounded-lg border border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer"
              >
                <option value="all">All Vibes</option>
                <option value="relax">Relax</option>
                <option value="energize">Energize</option>
                <option value="balance">Balance</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>

            {/* Secondary filter (Nose/Type/Texture/Flavor) */}
            {secondaryFilter && onSecondaryChange && (
              <div className="relative group">
                <select
                  value={secondaryFilter}
                  onChange={(e) => onSecondaryChange(e.target.value as any)}
                  className="appearance-none bg-[#2a2a2a] text-white px-4 py-2 pr-10 rounded-lg border border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  <option value="all">All {getSecondaryLabel()}</option>
                  {getSecondaryOptions().slice(1).map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Right side - product count */}
          <div className="text-white/60 text-sm">
            Showing {productCount} of {totalCount} products
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 