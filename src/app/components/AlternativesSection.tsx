"use client"

import { memo } from 'react';
import Link from 'next/link';
import Section from './Section';
import AlternativeCard from './AlternativeCard';
import { buttonStyles, textStyles, gradientStyles, animationStyles } from '@/styles/shared';

const MemoizedAlternativeCard = memo(AlternativeCard);

export default function AlternativesSection() {
  return (
    <Section className="relative bg-[#3a3a3a] overflow-hidden -mt-px">
      <div className="relative z-10 py-8 px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Section Header */}
          <div className={`text-center mb-8 ${animationStyles.fadeInUp}`}>
            <div className={gradientStyles.divider}></div>
            <h2 className="text-white/95 font-extralight text-luxury-xl md:text-luxury-2xl tracking-luxury-normal mb-3 leading-tight">
              if you're not shopping with flora,<br />
              <span className="text-white/70">here's what you're really doing:</span>
            </h2>
            <div className={gradientStyles.accentDivider}></div>
          </div>

          {/* Grid of alternatives */}
          <div className={`grid md:grid-cols-2 gap-6 ${animationStyles.fadeInUpDelayed}`}>
            <MemoizedAlternativeCard
              title="vape shops"
              description='buying weed from a nicotine business. shelves packed with candy carts and fake exotics, run by people who pivoted from vapes to "green" overnight.'
              colorFrom="red"
              colorTo="red"
              delay="0.6s"
            />

            <MemoizedAlternativeCard
              title='"hemp wellness" stores'
              description="falling for packaging. cbd lotions, delta-8 edibles, and shelf space rented to whoever paid that month."
              colorFrom="yellow"
              colorTo="yellow"
              delay="0.7s"
            />

            <MemoizedAlternativeCard
              title="gas station weed"
              description="you're trusting your lungs to the same place you buy lotto tickets."
              colorFrom="orange"
              colorTo="orange"
              delay="0.8s"
            />

            <MemoizedAlternativeCard
              title="warehouse ecom sites"
              description="renamed outdoor, bulk-labeled and price-fluffed. no rotation, no quality control, no urgency."
              colorFrom="purple"
              colorTo="purple"
              delay="0.9s"
            />
          </div>

          {/* Bottom accent */}
          <div className="text-center mt-6 opacity-0 animate-[fadeInUp_1s_ease-out_1.0s_forwards]">
            <div className={gradientStyles.subtleDivider}></div>
            <p className={textStyles.muted}>
              quit smoking garbage
            </p>
            
            {/* Strong CTA after comparison */}
            <div className="mt-8">
              <Link href="/flower" className={`${buttonStyles.primary} relative overflow-hidden`}>
                <span className="relative z-10">Experience Real Cannabis</span>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-200"></div>
              </Link>
              <p className="text-emerald-400 text-sm mt-3">🎯 Over 10,000 orders shipped this month</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
} 