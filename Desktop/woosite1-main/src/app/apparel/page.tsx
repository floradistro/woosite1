"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { ShoppingCart, Filter, ChevronDown } from 'lucide-react';
import { products, Product } from '../../data/products';

// Transform Product to ApparelProduct interface
interface ApparelProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: 'hoodies' | 'tshirts' | 'accessories' | 'outerwear';
  sizes: string[];
  colors: string[];
  featured: boolean;
  spotlight?: string;
  handle: string;
}

// Transform products.ts data to apparel products
const getApparelProducts = (): ApparelProduct[] => {
  return products
    .filter(product => product.type === 'Apparel' && product.published)
    .map((product, index) => {
      // Determine category based on product category or tags
      let category: 'hoodies' | 'tshirts' | 'accessories' | 'outerwear' = 'tshirts';
      
      if (product.productCategory.includes('Hoodies') || product.tags.includes('hoodie') || product.tags.includes('crewneck')) {
        category = 'hoodies';
      } else if (product.productCategory.includes('Accessories') || product.tags.includes('hat') || product.tags.includes('beanie') || product.tags.includes('snapback')) {
        category = 'accessories';
      } else if (product.productCategory.includes('T-Shirts') || product.tags.includes('tshirt') || product.tags.includes('longsleeve')) {
        category = 'tshirts';
      }

      // Extract sizes from options or use defaults
      const sizes = product.options.find(opt => opt.name === 'Size')?.value 
        ? [product.options.find(opt => opt.name === 'Size')!.value]
        : ['S', 'M', 'L', 'XL'];

      return {
        id: product.handle,
        title: product.title,
        description: product.shortDescription || product.body.replace(/<[^>]*>/g, ''), // Strip HTML tags
        price: product.variantPrice,
        image: product.imageSrc,
        category,
        sizes,
        colors: ['Black', 'Charcoal', 'Sage Green'], // Default colors, could be enhanced
        featured: product.tags.includes('premium') || product.tags.includes('essential'),
        spotlight: product.shortDescription || undefined,
        handle: product.handle
      };
    });
};

// Get apparel products
const APPAREL_PRODUCTS = getApparelProducts();

// Filter and Sort Options
const FILTER_OPTIONS = {
  category: [
    { value: 'hoodies', label: 'Hoodies', color: 'bg-purple-500/20 text-purple-300' },
    { value: 'tshirts', label: 'T-Shirts', color: 'bg-green-500/20 text-green-300' },
    { value: 'accessories', label: 'Accessories', color: 'bg-blue-500/20 text-blue-300' },
    { value: 'outerwear', label: 'Outerwear', color: 'bg-orange-500/20 text-orange-300' }
  ]
};

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' }
];

function ApparelCollectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  // State
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState<'all' | 'hoodies' | 'tshirts' | 'accessories' | 'outerwear'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Handle URL parameters
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && ['hoodies', 'tshirts', 'accessories', 'outerwear'].includes(typeParam)) {
      setFilterCategory(typeParam as 'hoodies' | 'tshirts' | 'accessories' | 'outerwear');
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = APPAREL_PRODUCTS;
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'name':
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filterCategory, sortBy]);

  // Handle size selection
  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  // Handle color selection
  const handleColorSelect = (productId: string, color: string) => {
    setSelectedColors(prev => ({ ...prev, [productId]: color }));
  };

  // Handle add to cart
  const handleAddToCart = (product: ApparelProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const size = selectedSizes[product.id] || product.sizes[0];
    const color = selectedColors[product.id] || product.colors[0];
    
    addToCart({
      id: parseInt(product.id.replace(/\D/g, '')) || Math.random(), // Extract numbers or use random ID
      title: `${product.title} - ${color} - ${size}`,
      price: product.price,
      weight: size,
      image: product.image
    }, 1);
  };

  // Handle product click
  const handleProductClick = (product: ApparelProduct) => {
    router.push(`/product/${product.handle}`);
  };

  // Handle image load
  const handleImageLoad = (productId: string) => {
    setLoadedImages(prev => new Set([...prev, productId]));
  };

  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white">
      {/* Hero Section */}
      <section className="relative bg-[#4a4a4a] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 pt-32 pb-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
              <h1 className="text-5xl md:text-7xl font-extralight tracking-wide mb-6">
                Apparel
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light mb-4">
                Quality streetwear and accessories.
              </p>
              <p className="text-lg text-white/60 font-light">
                Clean designs that rep the brand without looking like a walking billboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
              <section className="sticky top-0 z-30 bg-[#4a4a4a]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">
                    {filterCategory === 'all' ? 'All Categories' : 
                     filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#3a3a3a] rounded-lg border border-white/20 shadow-xl z-50">
                    <div className="p-4">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setFilterCategory('all');
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                            filterCategory === 'all' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-white/10'
                          }`}
                        >
                          All Categories
                        </button>
                        {FILTER_OPTIONS.category.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilterCategory(option.value as any);
                              setShowFilters(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                              filterCategory === option.value ? option.color : 'hover:bg-white/10'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="text-white/60">
                {filteredAndSortedProducts.length} of {APPAREL_PRODUCTS.length} items
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#3a3a3a] text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative bg-[#4a4a4a] py-16">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="w-full relative z-10 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => {
                const selectedSize = selectedSizes[product.id] || product.sizes[0];
                const selectedColor = selectedColors[product.id] || product.colors[0];
                const isImageLoaded = loadedImages.has(product.id);

                return (
                  <div
                    key={product.id}
                    className="group relative bg-gradient-to-r from-white/5 to-white/2 hover:from-white/8 hover:to-white/5 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-2 left-2 z-20 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-white/5">
                      {!isImageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                        </div>
                      )}
                      
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className={`object-cover transition-all duration-300 group-hover:scale-110 ${
                          isImageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        loading="lazy"
                        onLoad={() => handleImageLoad(product.id)}
                        quality={85}
                      />
                      
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-medium text-white group-hover:text-emerald-300 transition-colors duration-200">
                          {product.title}
                        </h3>
                        <p className="text-sm text-white/60 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-xl font-semibold text-emerald-400">
                        ${product.price.toFixed(2)}
                      </div>

                      {/* Size Selection */}
                      {product.sizes.length > 1 && (
                        <div className="space-y-2">
                          <label className="text-sm text-white/70">Size:</label>
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSizeSelect(product.id, size);
                                }}
                                className={`px-2 py-1 text-xs rounded border transition-all duration-200 ${
                                  selectedSize === size
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-white/30 text-white/70 hover:border-white/50'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color Selection */}
                      <div className="space-y-2">
                        <label className="text-sm text-white/70">Color:</label>
                        <div className="flex flex-wrap gap-1">
                          {product.colors.map((color) => (
                            <button
                              key={color}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleColorSelect(product.id, color);
                              }}
                              className={`px-2 py-1 text-xs rounded border transition-all duration-200 ${
                                selectedColor === color
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-white/30 text-white/70 hover:border-white/50'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all duration-300 font-medium"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Statement Section */}
      <section className="relative bg-[#4a4a4a] overflow-hidden -mt-px" style={{ 
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
      }}>
        <div className="relative z-10 py-16 px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-wide mb-4">
                Quality Over Hype.
              </h2>
              <p className="text-xl text-white/80 font-light">
                Every piece is built to last, designed to impress.
              </p>
              <p className="text-lg text-white/60 font-light mt-2">
                No fast fashion. No throwaway pieces. Just quality streetwear.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-amber-400 to-amber-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        Premium Materials Only
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        Heavyweight cotton, premium fleece, and quality hardware. Every material is chosen for durability and comfort.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-emerald-400 to-emerald-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        Subtle Branding
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        Clean designs that rep the brand without screaming it. Quality speaks louder than logos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        Built to Last
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        Double-stitched seams, reinforced stress points, and quality construction. These pieces are made to be worn, not replaced.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Statement */}
            <div className="mt-12 text-center opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards]">
              <div className="inline-block">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
                <p className="text-xl text-white/85 font-light leading-relaxed">
                  You won't find cheap prints on cheap blanks here.
                </p>
                <p className="text-lg text-emerald-400 font-medium mt-2">
                  You get quality pieces that last and look good doing it.
                </p>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Loading fallback component
function ApparelPageLoading() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading apparel collection...</p>
      </div>
    </div>
  );
}

export default function ApparelCollectionPage() {
  return (
    <Suspense fallback={<ApparelPageLoading />}>
      <ApparelCollectionContent />
    </Suspense>
  );
} 