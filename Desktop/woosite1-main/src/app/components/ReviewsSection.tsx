"use client"

import Link from 'next/link';
import Section from './Section';
import SectionHeader from './SectionHeader';
import OptimizedCarouselContainer from '@/components/OptimizedCarouselContainer';
import OptimizedReviewCard from '@/components/OptimizedReviewCard';
import { carouselStyles, buttonStyles } from '@/styles/shared';
import { reviews } from '@/data/constants';

interface ReviewsSectionProps {
  visibleSections: Set<string>;
}

export default function ReviewsSection({ visibleSections }: ReviewsSectionProps) {
  return (
    <>
      {/* Proof, Not Promises - Section Title */}
      <Section id="proof-section">
        <div className="relative z-10 py-3 w-full">
          <SectionHeader 
            title="If You're in Denial, That's on You. These Customers Got It."
            delay="0.3s"
          />
        </div>
      </Section>
      
      {/* Reviews Section - Enhanced with micro-interactions */}
      <Section id="reviews-section">
        <div className="w-full relative z-10">
          <div className={`w-full py-0 transition-all duration-200 ${
            visibleSections.has('reviews-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <OptimizedCarouselContainer 
              style={carouselStyles.container}
              arrowIdPrefix="reviews"
            >
              {/* Rating Header - Enhanced */}
              <div className="flex-none w-screen md:w-1/3 lg:w-1/4 snap-center relative group">
                <div className="h-full bg-gradient-to-br from-white/8 to-white/3 hover:from-white/12 hover:to-white/6 backdrop-blur-sm border-r border-white/5 hover:border-white/10 flex flex-col items-center justify-center p-6 md:p-8 transition-all duration-200">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-thin text-white tracking-wide mb-3 group-hover:scale-105 transition-transform duration-300">4.9</div>
                    <div className="flex justify-center items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 md:w-6 h-5 md:h-6 text-yellow-400 fill-current hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" style={{ animationDelay: `${i * 0.1}s` }}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/70 text-base font-light mb-2 group-hover:text-white/80 transition-colors duration-300">1,200+ reviews</p>
                    <p className="text-white/50 text-sm group-hover:text-white/60 transition-colors duration-300">Built by operators.<br />Run by locals.</p>
                  </div>
                </div>
              </div>

              {reviews.map((review, index) => (
                <OptimizedReviewCard
                  key={index}
                  name={review.name}
                  location={review.location}
                  rating={review.rating}
                  date={review.date}
                  review={review.review}
                  verified={review.verified}
                  product={review.product}
                />
              ))}
            </OptimizedCarouselContainer>
          </div>
        </div>
        
        {/* CTA after reviews */}
        <div className="text-center py-8 bg-gradient-to-b from-transparent to-black/20">
          <p className="text-white/60 text-sm mb-4">Join thousands who switched to Flora</p>
          <Link href="/flower" className={buttonStyles.accent}>
            <span>Start Shopping</span>
            <div className="flex items-center gap-1">
              <span className="text-2xl">🔥</span>
              <span className="text-sm font-medium">Hot Deals</span>
            </div>
          </Link>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <span className="text-white/60">✓ No medical card needed</span>
            <span className="text-white/60">✓ Ships to most states (excluded states in the footer)</span>
          </div>
        </div>
      </Section>
    </>
  );
} 