"use client"

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { MoonwaterProductWithVariations } from '../constants';
import { useCart } from '../../context/CartContext';

interface MoonwaterGridProps {
  products: MoonwaterProductWithVariations[];
  selectedOptions: Record<number, string>;
  loadedImages: Set<number>;
  format: string;
  onProductClick: (product: MoonwaterProductWithVariations) => void;
  onOptionSelect: (productId: number, option: string) => void;
  onAddToCart: (product: MoonwaterProductWithVariations, e: React.MouseEvent) => void;
  onImageLoad: (productId: number) => void;
  onClearFilters: () => void;
}

// Moonwater Product Card Component
const MoonwaterCard = ({ 
  product, 
  selectedOption, 
  isImageLoaded, 
  format,
  onProductClick,
  onOptionSelect,
  onAddToCart,
  onImageLoad,
  index,
  isExpanded,
  onToggleExpanded,
  getCardStyling
}: {
  product: MoonwaterProductWithVariations;
  selectedOption: string;
  isImageLoaded: boolean;
  format: string;
  onProductClick: (product: MoonwaterProductWithVariations) => void;
  onOptionSelect: (productId: number, option: string) => void;
  onAddToCart: (product: MoonwaterProductWithVariations, e: React.MouseEvent) => void;
  onImageLoad: (productId: number) => void;
  index: number;
  isExpanded: boolean;
  onToggleExpanded: (productId: number, e: React.MouseEvent) => void;
  getCardStyling: (productId: number) => string;
}) => {
  
  // Get current price and price range for display
  const getPriceInfo = () => {
    if (product.isVariable && product.variations?.length > 0) {
      const selectedFlavor = selectedOption?.includes('flavor-') ? selectedOption.split('flavor-')[1] : null;
      const selectedPackSize = selectedOption?.includes('pack-') ? selectedOption.split('pack-')[1] : null;
      
      const matchingVariation = product.variations.find((v: any) => 
        (!selectedFlavor || v.flavor === selectedFlavor) && 
        (!selectedPackSize || v.packSize === selectedPackSize)
      ) || product.variations[0];
      
      // Get price range for variable products
      const prices = product.variations.map((v: any) => v.price || 0).filter(p => p > 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      return {
        currentPrice: matchingVariation?.price || product.price || 15,
        hasRange: minPrice !== maxPrice,
        minPrice,
        maxPrice
      };
    }
    return {
      currentPrice: product.price || 15,
      hasRange: false,
      minPrice: product.price || 15,
      maxPrice: product.price || 15
    };
  };

  const priceInfo = getPriceInfo();

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
          {/* Product Image with Overlay Text */}
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
            
            {/* Product Name Overlay - Animated */}
            <div className="absolute top-0 left-0 right-0 flex flex-col justify-start items-center text-center px-3 pt-4 pointer-events-none transform -rotate-3 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2">
              <h3 className="text-white font-bold text-lg md:text-2xl mb-1 leading-none transform transition-all duration-700 animate-pulse group-hover:scale-110" 
                  style={{ 
                    fontFamily: 'Nunito Sans, Varela Round, sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    animation: 'fadeInUp 0.8s ease-out'
                  }}>
                {product.title.toLowerCase()}
              </h3>
              
              <div className="text-white font-bold text-sm md:text-base tracking-wider transform transition-all duration-500 group-hover:tracking-widest group-hover:scale-105" 
                   style={{ 
                     fontFamily: 'Space Mono, Roboto Mono, monospace',
                     textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                     animation: 'fadeInUp 1s ease-out 0.2s both'
                   }}>
                [{product.thc}mg]
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 relative">
            {/* Strength and Effects side by side - same as edibles */}
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

            {/* Description */}
            {product.description && (
              <div className="mb-3 p-2 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8">
                <p className="text-white/90 text-xs font-light leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Price */}
            <div className="flex justify-end">
              <div className="text-white/95 font-light text-lg md:text-xl group-hover:text-white transition-colors duration-300">
                {priceInfo.hasRange ? (
                  <>
                    <span className="text-green-400">$</span>{priceInfo.minPrice.toFixed(2)} - <span className="text-green-400">$</span>{priceInfo.maxPrice.toFixed(2)}
                    <span className="text-xs text-white/60">
                      /range
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-green-400">$</span>{priceInfo.currentPrice.toFixed(2)}
                    <span className="text-xs text-white/60">
                      /each
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Variations Selection - Only show if product has variations and is expanded */}
        {product.isVariable && product.variations?.length > 0 && (
          <div className="flex flex-col gap-3 pt-1 border-t border-white/10">
            <div 
              className={`overflow-hidden transition-all duration-200 ease-out ${
                isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className={`flex flex-col gap-3 pt-2 transition-all duration-150 ${
                isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                
                {/* Flavor Selection */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-white/70 font-medium">Flavor:</span>
                  <div className="grid grid-cols-2 gap-1">
                    {Array.from(new Set(product.variations.map(v => v.flavor))).map((flavor) => {
                      const isSelected = selectedOption?.includes(`flavor-${flavor}`);
                      return (
                        <button
                          key={flavor}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOptionSelect(product.id, `flavor-${flavor}`);
                          }}
                          className={`px-2 py-1.5 rounded-md text-xs font-light transition-all duration-300 hover:scale-105 active:scale-95 min-h-[32px] ${
                            isSelected
                              ? 'bg-white/20 text-white border border-white/30'
                              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                          }`}
                        >
                          {flavor}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pack Size Selection */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-white/70 font-medium">Pack Size:</span>
                  <div className="grid grid-cols-2 gap-1">
                    {Array.from(new Set(product.variations.map(v => v.packSize))).map((packSize) => {
                      const isSelected = selectedOption?.includes(`pack-${packSize}`);
                      return (
                        <button
                          key={packSize}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOptionSelect(product.id, `pack-${packSize}`);
                          }}
                          className={`px-2 py-1.5 rounded-md text-xs font-light transition-all duration-300 hover:scale-105 active:scale-95 min-h-[32px] ${
                            isSelected
                              ? 'bg-white/20 text-white border border-white/30'
                              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                          }`}
                        >
                          {packSize}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => onAddToCart(product, e)}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/80 hover:text-white font-light transition-all duration-300 hover:scale-[1.02] active:scale-95 min-h-[40px]"
                  >
                    Add to Cart
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
        )}
      </div>
    </div>
  );
};

export default function MoonwaterGrid({
  products,
  selectedOptions,
  loadedImages,
  format,
  onProductClick,
  onOptionSelect,
  onAddToCart,
  onImageLoad,
  onClearFilters
}: MoonwaterGridProps) {
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
  
  const getDefaultSelection = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product?.isVariable && product.variations?.length > 0) {
      const firstVariation = product.variations[0];
      return `flavor-${firstVariation.flavor}`;
    }
    return '';
  };

  if (products.length === 0) {
    return (
      <section className="relative bg-[#464646] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-white/60 text-lg mb-4">No moonwater products found</div>
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 rounded-lg transition-all duration-200"
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
        {/* 2x2 Grid Layout for Moonwater */}
        <div className="w-full grid grid-cols-1 gap-1 md:gap-2 md:grid-cols-2 lg:grid-cols-2">
          {products.map((product, index) => {
            const selectedOption = selectedOptions[product.id] || getDefaultSelection(product.id);
            const isImageLoaded = loadedImages.has(product.id);
            const isExpanded = expandedProducts.has(product.id);

            return (
              <MoonwaterCard
                key={product.id}
                product={product}
                selectedOption={selectedOption}
                isImageLoaded={isImageLoaded}
                format={format}
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
    </section>
  );
} 