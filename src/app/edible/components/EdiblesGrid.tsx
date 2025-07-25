"use client"

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FeaturedProduct } from '../constants';
import { useCart } from '../../context/CartContext';

interface EdiblesGridProps {
  products: FeaturedProduct[];
  selectedOptions: Record<number, string>;
  loadedImages: Set<number>;
  format: string;
  pricing: Record<string, number>;
  sizes: string[];
  onProductClick: (product: FeaturedProduct) => void;
  onOptionSelect: (productId: number, option: string) => void;
  onAddToCart: (product: FeaturedProduct, e: React.MouseEvent) => void;
  onImageLoad: (productId: number) => void;
  onClearFilters: () => void;
}

// Edibles Product Card Component
const EdiblesCard = ({ 
  product, 
  selectedOption, 
  isImageLoaded, 
  format,
  pricing,
  sizes,
  onProductClick,
  onOptionSelect,
  onAddToCart,
  onImageLoad,
  index,
  isExpanded,
  onToggleExpanded,
  getCardStyling
}: {
  product: FeaturedProduct;
  selectedOption: string;
  isImageLoaded: boolean;
  format: string;
  pricing: Record<string, number>;
  sizes: string[];
  onProductClick: (product: FeaturedProduct) => void;
  onOptionSelect: (productId: number, option: string) => void;
  onAddToCart: (product: FeaturedProduct, e: React.MouseEvent) => void;
  onImageLoad: (productId: number) => void;
  index: number;
  isExpanded: boolean;
  onToggleExpanded: (productId: number, e: React.MouseEvent) => void;
  getCardStyling: (productId: number) => string;
}) => {
  
  // Get current price based on selected option
  const getCurrentPrice = () => {
    if (selectedOption && pricing[selectedOption]) {
      return pricing[selectedOption];
    }
    // Show price range when no option is selected
    const prices = Object.values(pricing);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { min: minPrice, max: maxPrice };
  };

  return (
    <div 
      className="group relative cursor-pointer transition-all duration-200 opacity-100 translate-y-0"
      style={{ transitionDelay: `${Math.min(index * 50, 600)}ms` }}
      onClick={(e) => {
        e.preventDefault();
        onToggleExpanded(product.id, e);
      }}
    >
      <div className={`${getCardStyling(product.id)} p-1.5 group-hover:shadow-xl relative rounded-lg`}>
        
        <div className="flex items-start gap-1.5 mb-3 md:mb-4">
          {/* Product Image */}
          <div 
            className="relative w-50 h-50 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer group/image bg-black/20"
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
          >
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-[shimmer_2s_ease-in-out_infinite]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              </div>
            )}
            
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 200px, 192px"
              className={`object-cover transition-all duration-500 group-hover:scale-110 group-hover/image:scale-105 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => onImageLoad(product.id)}
              quality={85}
              priority={product.id === 1}
            />
            
            {/* Gummy indicator for gummy products */}
            {product.title.toLowerCase().includes('gummy') && isImageLoaded && (
              <div className="absolute bottom-1 right-1 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/40 bg-black/30 backdrop-blur-sm opacity-80 group-hover/image:opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg flex items-center justify-center p-0.5">
                <Image
                  src="/icons/newGummy.webp"
                  alt="Gummy indicator"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                  unoptimized={true}
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 relative">
            <h3 className="font-extralight text-2xl md:text-xl transition-colors duration-300 text-white/95 mb-2">
              {product.title}
            </h3>

            {/* Strength and Effects side by side - same as moonwater */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Strength */}
              <div className="p-2 rounded-md bg-gradient-to-r from-white/5 to-white/2 border border-white/10">
                <span className="text-white/70 text-xs font-light tracking-wide block mb-1">Strength</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-light text-red-400">{product.thc}</span>
                  <span className="text-xs font-light text-red-400/70">mg</span>
                </div>
              </div>
              
              {/* Effects */}
              {product.spotlight && (
                <div className="p-2 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8">
                  <span className="text-white/70 text-xs font-light tracking-wide block mb-1">Effects</span>
                  <p className="text-white/90 text-xs font-light leading-relaxed">
                    {product.spotlight}
                  </p>
                </div>
              )}
            </div>

            {/* Description - Desktop only, shown inline */}
            {product.description && (
              <div className="hidden md:block mb-3 p-2 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8">
                <p className="text-white/90 text-xs font-light leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            {(product as any).stockQuantity !== undefined && (
              <div className="text-xs mb-2">
                {(product as any).inStock ? (
                  <span className="text-green-400">In Stock</span>
                ) : (
                  <span className="text-red-400">Out of Stock</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex justify-end">
              <div className="text-white/95 font-light text-lg md:text-xl group-hover:text-white transition-colors duration-300">
                {(() => {
                  const price = getCurrentPrice();
                  if (typeof price === 'number') {
                    return (
                      <>
                        <span className="text-green-400">$</span>{price.toFixed(2)}
                        <span className="text-xs text-white/60">
                          /{format === 'single' ? selectedOption.replace('-pack', '') + (selectedOption === '1-pack' ? ' pack' : ' packs') : selectedOption}
                        </span>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <span className="text-green-400">$</span>{price.min.toFixed(2)}
                        <span className="text-white/60">-</span>
                        <span className="text-green-400">{price.max.toFixed(2)}</span>
                      </>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Description - Mobile only, full width below */}
        {product.description && (
          <div className="md:hidden mb-3">
            <div className="p-2 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8">
              <p className="text-white/90 text-xs font-light leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* Text indicator for expanding options - Mobile only */}
        <div className="md:hidden mb-3">
          <div className="text-center mt-3">
            <p className={`text-xs font-light transition-all duration-200 ${
              isExpanded ? 'text-emerald-300 opacity-100' : 'text-white/60 animate-subtle-glow'
            }`}>
              {isExpanded ? 'Hide Options' : 'Click to see options'}
            </p>
          </div>
        </div>

        {/* Quantity Selection - Show when expanded */}
        <div className="flex flex-col gap-3 pt-1 border-t border-white/10">
          <div 
            className={`overflow-hidden transition-all duration-200 ease-out ${
              isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className={`flex flex-col gap-3 pt-2 transition-all duration-150 ${
              isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              
              {/* Quantity Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-white/70 text-sm font-medium">
                  {format === 'single' ? 'Qty:' : 'Size:'}
                </span>
                <div className="grid grid-cols-4 gap-1.5 w-full">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOptionSelect(product.id, size);
                      }}
                      className={`px-1.5 py-2 rounded-md text-xs font-light transition-all duration-150 hover:scale-105 active:scale-95 min-h-[40px] flex flex-col items-center justify-center ${
                        selectedOption === size
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                      }`}
                    >
                      <span className="text-xs font-medium">
                        {format === 'single' ? size.replace('-pack', '') : size}
                      </span>
                      <span className="text-[10px] opacity-70">
                        {format === 'single' ? (size === '1-pack' ? 'Pack' : 'Packs') : size}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => onAddToCart(product, e)}
                  disabled={!(product as any).inStock}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-light transition-all duration-300 hover:scale-[1.02] active:scale-95 min-h-[40px] ${
                    (product as any).inStock === false 
                      ? 'bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/80 hover:text-white'
                  }`}
                >
                  {(product as any).inStock === false ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(product);
                  }}
                  className="flex-1 px-4 py-2 bg-black hover:bg-gray-900 text-white border border-gray-700 hover:border-gray-600 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <span className="hidden md:inline">Buy with </span>
                  <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/>
                    <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                  </svg>
                  <span>Pay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EdiblesGrid({
  products,
  selectedOptions,
  loadedImages,
  format,
  pricing,
  sizes,
  onProductClick,
  onOptionSelect,
  onAddToCart,
  onImageLoad,
  onClearFilters
}: EdiblesGridProps) {
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  
  const toggleExpanded = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProducts(prev => {
      const newSet = new Set<number>();
      if (!prev.has(productId)) {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const getCardStyling = (productId: number) => {
    const isExpanded = expandedProducts.has(productId);
    
    if (isExpanded) {
      return 'bg-gradient-to-r from-white/12 to-white/8 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.08)] rounded-lg transition-all duration-200';
    } else {
      return 'bg-gradient-to-r from-white/5 to-white/2 hover:from-white/8 hover:to-white/5 backdrop-blur-sm transition-all duration-200';
    }
  };

  if (products.length === 0) {
    return (
      <section className="relative bg-[#464646] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-white/60 text-lg mb-4">No edible products found</div>
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-300 rounded-lg transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#464646] overflow-hidden -mt-px" style={{ 
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
    }}>
      <div className="w-full relative z-10">
        {/* Grid Layout for Edibles */}
        <div className="w-full grid grid-cols-1 gap-1 md:gap-2 md:grid-cols-2">
          {products.map((product, index) => {
            const selectedOption = selectedOptions[product.id] || sizes[0];
            const isImageLoaded = loadedImages.has(product.id);
            const isExpanded = expandedProducts.has(product.id);

            return (
              <EdiblesCard
                key={product.id}
                product={product}
                selectedOption={selectedOption}
                isImageLoaded={isImageLoaded}
                format={format}
                pricing={pricing}
                sizes={sizes}
                onProductClick={onProductClick}
                onOptionSelect={onOptionSelect}
                onAddToCart={onAddToCart}
                onImageLoad={onImageLoad}
                index={index}
                isExpanded={isExpanded}
                onToggleExpanded={toggleExpanded}
                getCardStyling={getCardStyling}
              />
            );
          })}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes subtle-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-subtle-glow {
          animation: subtle-glow 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
} 