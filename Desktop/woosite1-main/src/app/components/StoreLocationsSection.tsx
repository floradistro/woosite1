"use client"

import { memo } from 'react';
import Link from 'next/link';
import { stores, storeCarouselImages } from '@/data/constants';
import { carouselStyles, buttonStyles, textStyles, gradientStyles, animationStyles } from '@/styles/shared';
import StoreCard from './StoreCard';

const MemoizedStoreCard = memo(StoreCard);

interface StoreLocationsSectionProps {
  storeStatus: { isOpen: boolean; nextOpenText: string };
}

export default function StoreLocationsSection({ storeStatus }: StoreLocationsSectionProps) {
  return (
    <section id="stores-section" className="relative bg-[#4a4a4a] overflow-hidden -mt-px" style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)' }}>
      {/* New Section Header */}
      <div className="relative z-10 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={animationStyles.fadeInUp}>
            <div className={gradientStyles.divider}></div>
            <h2 className={textStyles.sectionTitle}>
              Experience Flora In Person
            </h2>
            <p className={textStyles.sectionSubtitle}>
              Visit our physical locations to shop in person, or order online for fast shipping
            </p>
            <div className={gradientStyles.accentDivider}></div>
          </div>
        </div>
      </div>
      
      <div className="w-full relative z-10">
        <div className="flex overflow-x-auto md:overflow-hidden scrollbar-hide snap-x snap-mandatory md:snap-none relative" style={carouselStyles.enhanced}>
          {storeCarouselImages.map((store, index) => {
            const storeData = stores.find(s => s.name?.toLowerCase().includes(store.name.toLowerCase()));
            return (
              <MemoizedStoreCard
                key={store.id}
                store={store}
                storeData={storeData}
                index={index}
                getStoreStatus={() => storeStatus}
              />
            );
          })}
        </div>
      </div>
      
      <div className="relative z-10 py-3 w-full">
        <div className="w-full text-center">
          <div className={animationStyles.fadeInUp}>
            <div className={gradientStyles.divider}></div>
            <h2 className="text-white/95 font-extralight text-luxury-2xl md:text-luxury-3xl tracking-luxury-normal mb-3 hover:text-white transition-colors duration-200 cursor-default">
              5 Locations. Farm Direct. Independently Owned.
            </h2>
            <div className={gradientStyles.divider}></div>
          </div>
        </div>
      </div>
      
      {/* In-Store Experience Content */}
      <div className="relative z-10 px-6 pb-6">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Left Column */}
          <div className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards] text-center md:text-left">
            <div className="flex items-center md:items-start justify-center md:justify-start">
              <h3 className="text-xl md:text-2xl font-light text-white">
                The way it <span className="text-orange-500">should be</span>
              </h3>
            </div>
            <p className="text-white/70 font-light">
              Clean layout. No clutter. No junk racks full of gas station grab bags. Just real flower, fresh drops, and sharp service.
            </p>
          </div>
          
          {/* Middle Column */}
          <div className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards] text-center md:text-left">
            <div className="flex items-center md:items-start justify-center md:justify-start">
              <h3 className="text-xl md:text-2xl font-light text-white">
                Run by <span className="text-blue-500">real smokers</span>
              </h3>
            </div>
            <p className="text-white/70 font-light">
              You'll never get pitched mid from someone who doesn't burn. Our crew knows the product—because they use it.
            </p>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.9s_forwards] text-center md:text-left">
            <div className="flex items-center md:items-start justify-center md:justify-start">
              <h3 className="text-xl md:text-2xl font-light text-white">
                Menus that <span className="text-purple-500">move</span>
              </h3>
            </div>
            <p className="text-white/70 font-light">
              We don't sit on stale product. Our lineup rotates weekly—hand-selected drops, never overstocked filler. If it's listed, it's fresh. If it's gone, it's gone.
            </p>
          </div>
        </div>
        
        {/* Subtle tagline */}
        <div className="text-center pt-6 pb-2 opacity-0 animate-[fadeInUp_1s_ease-out_1.1s_forwards]">
          <div className={gradientStyles.accentDivider}></div>
          <p className={textStyles.muted}>
            Clean Shops. Loud Menus.
          </p>
          
          {/* Store locator CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/flower" className={buttonStyles.secondary}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Shop Online Now</span>
            </Link>
            <a href="#stores-section" className={buttonStyles.ghost}>
              Find a store near you →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 