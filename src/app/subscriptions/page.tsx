"use client"

import React, { useState } from 'react';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import ReviewCard from '../components/ReviewCard';
import CarouselContainer from '../components/CarouselContainer';

// Subscription plan data
const subscriptionPlans = [
  {
    id: 'drop-club',
    emoji: '🌿',
    name: 'Drop Club',
    subtitle: 'Monthly Flower Rotation',
    price: 95,
    save: 15,
    features: [
      '4 × 3.5g Flower Jars (14g total)',
      '4 unique exotic strains — one for each week',
      'Free shipping + 10% off site'
    ],
    description: 'Delivered all at once. Designed to last the full month.',
    addon: 'Optional: Add a 5th jar for $25 (reg. $40)',
    popular: false
  },
  {
    id: 'vault-vape',
    emoji: '🔋',
    name: 'Vault Vape Club',
    subtitle: 'Monthly Disposable Drop',
    price: 99,
    save: 41,
    features: [
      '4 × 1g Disposable Vapes',
      '1 exclusive subscriber-only strain',
      'Free shipping + 10% off site'
    ],
    description: 'Curated for vape-first customers. One box = one month.',
    addon: 'Optional: Add a 5th vape for $20 (reg. $35)',
    popular: false
  },
  {
    id: 'edible-essentials',
    emoji: '🍬',
    name: 'Edible Essentials',
    subtitle: 'Monthly Gummy Drop',
    price: 75,
    save: 45,
    features: [
      '4 × 100mg Edible Packs',
      'Rotating subscriber-only flavors',
      'Free shipping + 10% off site'
    ],
    description: 'One pack per week. Consistent, flavorful, and now more affordable.',
    addon: 'Optional: Add-on packs available monthly',
    popular: false
  },
  {
    id: 'real-flower',
    emoji: '🌲',
    name: 'Real Flower Club',
    subtitle: 'Ounce-Tier Subscription',
    price: 180,
    save: 20,
    features: [
      '4 × 7g Flower Jars (28g total)',
      '4 premium exotic strains',
      'Free shipping + 10% off site'
    ],
    description: 'Heavy rotation. True heads only.',
    addon: 'Optional: Add a 5th 7g jar for $50 (reg. $60)',
    popular: true
  },
  {
    id: 'full-spectrum',
    emoji: '🧪',
    name: 'Full-Spectrum Bundle',
    subtitle: 'Mixed Category Subscription',
    price: 185,
    save: 55,
    features: [
      '4 × 3.5g Flower Jars ($110 value)',
      '2 × 1g Disposables ($70 value)',
      '2 × 100mg Edibles ($60 value)'
    ],
    description: 'The everything box — flower, vapes, edibles. Monthly mix, all fire.',
    addon: 'Optional: Add 1 vape or 1 jar for $25 (reg. $35/$40)',
    popular: false
  }
];

// Subscription reviews data
const subscriptionReviews = [
  {
    name: "Sarah M.",
    location: "Los Angeles, CA",
    rating: 5,
    date: "2 days ago",
    review: "The curation is incredible. Every month feels like Christmas morning. The Drop Club has introduced me to strains I never would have tried.",
    verified: true,
    product: "Drop Club"
  },
  {
    name: "Marcus T.",
    location: "Denver, CO",
    rating: 5,
    date: "1 week ago",
    review: "Best value in cannabis. The Real Flower Club gives me exactly what I need - premium quality at a fraction of dispensary prices.",
    verified: true,
    product: "Real Flower Club"
  },
  {
    name: "Alex R.",
    location: "Portland, OR",
    rating: 5,
    date: "3 days ago",
    review: "Love the variety in the Full-Spectrum Bundle. Having flower, vapes, and edibles all in one box is perfect for my lifestyle.",
    verified: true,
    product: "Full-Spectrum Bundle"
  },
  {
    name: "Jessica L.",
    location: "Seattle, WA",
    rating: 5,
    date: "5 days ago",
    review: "The Vault Vape Club is perfect. High-quality disposables and I love getting exclusive strains that aren't available anywhere else.",
    verified: true,
    product: "Vault Vape Club"
  },
  {
    name: "David K.",
    location: "Phoenix, AZ",
    rating: 5,
    date: "1 day ago",
    review: "Edible Essentials has been a game changer. Consistent dosing, amazing flavors, and the subscriber-only varieties are incredible.",
    verified: true,
    product: "Edible Essentials"
  },
  {
    name: "Emily C.",
    location: "Austin, TX",
    rating: 5,
    date: "4 days ago",
    review: "The 10% discount alone pays for itself. Plus the curation is spot-on - they really know what quality cannabis looks like.",
    verified: true,
    product: "Drop Club"
  },
  {
    name: "Mike R.",
    location: "Miami, FL",
    rating: 5,
    date: "6 days ago",
    review: "Been subscribed for 8 months now. Consistency is unmatched - every box is fire. Customer service is top-tier too.",
    verified: true,
    product: "Real Flower Club"
  },
  {
    name: "Ashley W.",
    location: "Nashville, TN",
    rating: 5,
    date: "2 weeks ago",
    review: "The Full-Spectrum Bundle introduced me to products I never would have tried. Love having options for different moods.",
    verified: true,
    product: "Full-Spectrum Bundle"
  },
  {
    name: "Carlos M.",
    location: "San Diego, CA",
    rating: 5,
    date: "1 week ago",
    review: "Vault Vape Club is perfect for my busy lifestyle. Premium vapes delivered monthly - couldn't ask for more convenience.",
    verified: true,
    product: "Vault Vape Club"
  },
  {
    name: "Rachel P.",
    location: "Charlotte, NC",
    rating: 5,
    date: "3 days ago",
    review: "Edible Essentials keeps me stocked with the best gummies. The rotating flavors mean I never get bored.",
    verified: true,
    product: "Edible Essentials"
  }
];

const faqItems = [
  {
    question: 'Do I choose the products myself?',
    answer: 'Not directly. You\'ll take a quick preference quiz when you subscribe. We hand-curate your drops based on what you like — not what\'s left over.'
  },
  {
    question: 'Can I pause or cancel anytime?',
    answer: 'Yes. No contracts, no commitments. Pause, skip, or cancel anytime from your account. We\'re not trying to trap you.'
  },
  {
    question: 'When do subscriptions ship?',
    answer: 'Monthly boxes ship on the 1st of each month. New subscribers get their first box within 3-5 days of signing up.'
  },
  {
    question: 'What if I don\'t like something?',
    answer: 'Let us know. We\'ll adjust your preferences for next time. Your feedback directly shapes future drops.'
  },
  {
    question: 'Do I get the 10% discount immediately?',
    answer: 'Yes. The moment you subscribe, your account unlocks 10% off everything sitewide. It applies automatically at checkout.'
  },
  {
    question: 'Can I switch plans?',
    answer: 'Absolutely. Switch between any plan at any time. Changes take effect on your next billing cycle.'
  }
];

// Style constants for carousel
const carouselStyle = {
  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)',
  scrollBehavior: 'smooth' as const,
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
  backgroundSize: '50px 50px'
};

export default function SubscriptionsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white">
      {/* Hero Section - Sitewide Discounts */}
      <section className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-[#4a4a4a] animate-fadeIn"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 35%),
            radial-gradient(circle at 60% 20%, rgba(5, 150, 105, 0.05) 0%, transparent 30%),
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px',
          animation: 'fadeIn 1.5s ease-out, gridFloat 40s linear infinite, colorShift 15s ease-in-out infinite'
        }}
      >
        {/* Subtle animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3 animate-fadeInUp px-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl">🏷️</span>
              <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200 uppercase">
                10% OFF EVERYTHING
              </h1>
            </div>
            <h2 className="text-white/90 text-sm md:text-base lg:text-lg font-light tracking-wide max-w-2xl mx-auto drop-shadow-lg opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Active subscriber pricing • No minimum order • No exclusions
            </h2>
            <div className="flex flex-col items-center gap-2 mt-4 opacity-0 animate-fadeInUp" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">🌿 Flower</span>
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">🔋 Vapes</span>
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">🍬 Edibles</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="text-yellow-400">💡</span>
                <span>Unlocked with any active subscription</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section Header */}
      <section className="py-6 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-2">
            Subscribe Now
          </h2>
          <p className="text-sm md:text-base text-white/70 font-light">
            Pick your vibe. We handle the rest.
          </p>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="group relative cursor-pointer bg-gradient-to-r from-white/12 to-white/8 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.08)] rounded-lg transition-all duration-200 p-1 hover:shadow-xl hover:from-white/16 hover:to-white/12 hover:border-white/30"
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-lg">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="p-4">
                  {/* Header Section */}
                  <div className="flex items-start gap-3 mb-4">
                    {/* Emoji Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg backdrop-blur-sm border border-white/20">
                      {plan.emoji}
                    </div>
                    
                    {/* Title and Subtitle */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extralight text-base transition-colors duration-300 text-white/98 mb-0.5 leading-tight">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-white/70 font-light">{plan.subtitle}</p>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-extralight text-white/95"><span className="text-green-400">$</span>{plan.price}</span>
                      <span className="text-white/60 text-xs">/mo</span>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-medium">
                      <span className="text-xs">💸</span>
                      <span>Save <span className="text-green-400">$</span>{plan.save}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-emerald-400 text-xs mt-1 flex-shrink-0">•</span>
                        <span className="text-white/80 text-xs leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-1">
                      <span className="text-xs mt-0.5 flex-shrink-0">💸</span>
                      <p className="text-white/70 text-xs leading-relaxed">{plan.description}</p>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">{plan.addon}</p>
                  </div>

                  {/* Subscribe Button */}
                  <button className="w-full group relative inline-flex items-center justify-center gap-1 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg font-medium text-xs transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-0 select-none overflow-hidden">
                    <span className="relative z-10">SUBSCRIBE NOW</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section Header */}
      <Section id="subscription-reviews-section">
        <div className="relative z-10 py-3 w-full">
          <SectionHeader 
            title="Trusted by Cannabis Connoisseurs"
            subtitle="Real reviews from real subscribers."
            delay="0.3s"
          />
          <div className="text-center mt-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            <p className="text-white/60 font-light">
              Join thousands who trust Flora for their premium cannabis subscriptions.
            </p>
          </div>
        </div>
      </Section>

      {/* Reviews Carousel */}
      <Section id="reviews-section">
        <div className="w-full relative z-10">
          <div className={`w-full py-0 transition-all duration-200 opacity-100 translate-y-0`}>
            <CarouselContainer 
              style={carouselStyle}
              arrowIdPrefix="subscription-reviews"
            >
              {/* Rating Header */}
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
                    <p className="text-white/70 text-base font-light mb-2 group-hover:text-white/80 transition-colors duration-300">50K+ active subscribers</p>
                    <p className="text-white/50 text-sm group-hover:text-white/60 transition-colors duration-300">Premium curation.<br />Every month.</p>
                  </div>
                </div>
              </div>

              {subscriptionReviews.map((review, index) => (
                <ReviewCard
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
            </CarouselContainer>
          </div>
        </div>
      </Section>

      {/* Why Subscribe Section */}
      <section className="relative bg-[#4a4a4a] overflow-hidden -mt-px" style={{ 
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
      }}>
        <div className="relative z-10 py-16 px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-wide mb-4">
                Why Subscribe?
              </h2>
              <p className="text-xl text-white/80 font-light">
                Premium cannabis delivered monthly.
              </p>
              <p className="text-lg text-white/60 font-light mt-2">
                Curated by experts. Loved by connoisseurs.
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
                        Expert Curation
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        We smoke everything first. No hype strains, no marketing BS. If it doesn't hit, it doesn't ship.
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
                        Exclusive Access
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        Subscriber-only strains and products. Plus 10% off everything sitewide, always.
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
                        No Commitment
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        Pause, skip, or cancel anytime. No contracts, no hassles. Just premium cannabis when you want it.
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
                  You won't find random products in fancy boxes here.
                </p>
                <p className="text-lg text-emerald-400 font-medium mt-2">
                  You get hand-picked fire, delivered fresh, every month.
                </p>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">FLORA SUBSCRIPTIONS — FAQ</h2>
            <p className="text-white/70 text-xl">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-white/8 to-white/4 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:from-white/12 hover:to-white/8 hover:border-white/20"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-light text-lg text-white/95">{item.question}</span>
                  <span className={`transform transition-transform text-white/70 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4 border-t border-white/10">
                    <p className="text-white/80 leading-relaxed text-sm pt-4">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}