"use client"

import Link from 'next/link';
import Section from './Section';
import SectionHeader from './SectionHeader';
import { buttonStyles, textStyles, gradientStyles, animationStyles } from '@/styles/shared';

interface ExperienceSectionProps {
  timeUntilDeadline: string;
}

export default function ExperienceSection({ timeUntilDeadline }: ExperienceSectionProps) {
  return (
    <Section id="experience-section">
      <div className="relative z-10 py-3 w-full">
        <SectionHeader 
          title="Orders Don't Sit. Neither Do We."
          subtitle="Freshness in Motion."
          delay="0.3s"
        />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
          {/* Same-Day Shipouts */}
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-light text-white mb-2">
              Same-Day <span className="text-blue-400">Shipouts</span>
            </h3>
            <p className="text-white/70 font-light">
              Orders placed by 2PM ship within hours.
            </p>
          </div>
          
          {/* Packed Fresh */}
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-light text-white mb-2">
              No <span className="text-green-400">Prepacked Bullsh*t.</span>
            </h3>
            <p className="text-white/70 font-light">
              Every order is sealed fresh — right after it's placed.
            </p>
          </div>
          
          {/* Local Faster */}
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-light text-white mb-2">
              Local? <span className="text-purple-400">Even Faster.</span>
            </h3>
            <p className="text-white/70 font-light">
              Most local orders drop next day. Many land same day.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center pb-4 transition-all duration-200 opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards]">
        <div className={gradientStyles.accentDivider}></div>
        <p className={textStyles.muted}>Frictionless. Fast. Repeatable.</p>
        
        {/* CTA for fast shipping */}
        <div className="mt-6">
          <Link href="/flower" className={buttonStyles.primary}>
            <span>Order Before 2PM for Same-Day Shipping</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </Link>
          <p className="text-emerald-400 text-sm mt-2">⚡ {timeUntilDeadline} left for today's shipment</p>
        </div>
      </div>
    </Section>
  );
} 