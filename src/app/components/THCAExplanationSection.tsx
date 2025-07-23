"use client"

import Link from 'next/link';
import Section from './Section';
import { sectionStyles, buttonStyles, gradientStyles, textStyles } from '@/styles/shared';

interface THCAExplanationSectionProps {
  visibleSections: Set<string>;
  timeUntilDeadline: string;
}

export default function THCAExplanationSection({ visibleSections, timeUntilDeadline }: THCAExplanationSectionProps) {
  return (
    <Section id="thca-section" className={sectionStyles.withInsetShadow}>
      <div className="relative z-10 py-2 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            visibleSections.has('thca-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Emphasized "How?" */}
            <div className="mb-6">
              <h3 className={textStyles.sectionTitle}>
                How?
              </h3>
              <div className={gradientStyles.accentDivider}></div>
            </div>
            
            <div className="space-y-1">
              <p className={textStyles.paragraph}>
                Every dispensary nug starts as <span className="text-emerald-300 font-medium">THCA</span>. That's cannabis before heat—raw, unburned, and federally legal.
              </p>
              <p className={textStyles.paragraph}>
                Light it, and it becomes THC. Same high. Same flower. No loopholes—just chemistry.
              </p>
              <p className={textStyles.paragraph}>
                So unless you're buying pre-smoked joints, you've been paying extra for the same thing.
              </p>
              <p className={`${textStyles.paragraph} italic`}>
                Now it ships—fast, legal, and direct.
              </p>
            </div>
            
            {/* CTA after THCA explanation */}
            <div className="mt-6 md:mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/flower" className={`${buttonStyles.primary} w-full sm:w-auto`}>
                  <span className="relative z-10">Shop Premium Flower</span>
                  <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </Link>
                <div className="text-center">
                  <p className="text-emerald-400 font-medium text-xs md:text-sm mb-0.5 md:mb-1">🎉 Limited Time - First Time Customers</p>
                  <p className="text-white/70 text-xs">15% off + free shipping</p>
                </div>
              </div>
              <Link href="#reviews-section" className={`${buttonStyles.ghost} text-xs md:text-sm`}>
                See what 1,200+ customers say →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
} 