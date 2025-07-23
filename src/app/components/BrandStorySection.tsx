"use client"

import Link from 'next/link';
import Image from 'next/image';
import Section from './Section';
import SectionHeader from './SectionHeader';
import { buttonStyles, textStyles, animationStyles } from '@/styles/shared';

export default function BrandStorySection() {
  return (
    <Section className="relative bg-[#3a3a3a] overflow-hidden -mt-px">
      <div className="relative py-8 px-8">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Section Header */}
          <SectionHeader 
            title="Flora Distro"
            subtitle="History in Motion."
            className="mb-8"
            delay="0.3s"
          />

          {/* Main Content */}
          <div className={animationStyles.fadeInUpDelayed}>
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-white/85 font-light text-luxury-base leading-relaxed tracking-luxury-normal">
                We built Flora with one goal—move real product and make it out clean. This wasn't a rebrand or rollout. It was survival. Ten years in the game, through charges, droughts, and losses. No investors. No second chances. Just hard work and high stakes.
              </p>
              
              <p className="text-white/85 font-light text-luxury-base leading-relaxed tracking-luxury-normal">
                Now it's legal—and all ours. No middlemen. No fluff. Coast-to-coast drops, clean stores, fast ecom, and real product. The kind that built the game.
              </p>
              
              <p className="text-white/95 font-medium text-luxury-lg leading-relaxed tracking-luxury-normal mt-6">
                It was risk. Now it's business.
              </p>
            </div>
            
            {/* Final conversion CTA */}
            <div className="mt-10 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/flower" className={`${buttonStyles.accent} relative overflow-hidden`}>
                  <span className="relative z-10">Start Shopping</span>
                  <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-300"></div>
                </Link>
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Free shipping over $100</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Same-day shipping</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-white/50 text-xs">
                🔒 Secure checkout • 🚚 Discreet packaging • 💯 Satisfaction guaranteed
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </Section>
  );
} 