// React import not needed in React 17+
import Link from 'next/link';
import { ProductType } from '@/app/components/ProductCollectionConfig';

interface SubscriptionSectionProps {
  productType: ProductType;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  linkText?: string;
}

const defaultContent: Record<ProductType, {
  title: string;
  subtitle: string;
  ctaText: string;
  linkText: string;
}> = {
  flower: {
    title: "Never Run Out.",
    subtitle: "Monthly flower drops. Curated, fresh, and member-priced.",
    ctaText: "Join the Club",
    linkText: "Explore all subscription plans"
  },
  edible: {
    title: "Sweet Savings.",
    subtitle: "Monthly edible boxes. Your favorites delivered automatically.",
    ctaText: "Subscribe & Save",
    linkText: "View subscription options"
  },
  vape: {
    title: "Always Charged.",
    subtitle: "Monthly vape bundles. Premium cartridges at member prices.",
    ctaText: "Start Subscription",
    linkText: "See all subscription benefits"
  },
  wax: {
    title: "Concentrate Club.",
    subtitle: "Exclusive monthly drops. Premium extracts for connoisseurs.",
    ctaText: "Join the Club",
    linkText: "Learn about membership"
  },
  moonwater: {
    title: "Stay Refreshed.",
    subtitle: "Monthly beverage packs. Never run dry on your favorite flavors.",
    ctaText: "Subscribe Today",
    linkText: "Discover subscription perks"
  },
  subscriptions: {
    title: "Already Subscribed?",
    subtitle: "Manage your subscriptions and explore new options.",
    ctaText: "Manage Subscriptions",
    linkText: "Browse all plans"
  }
};

export default function SubscriptionSection({ 
  productType,
  title,
  subtitle,
  ctaText,
  linkText
}: SubscriptionSectionProps) {
  const content = defaultContent[productType];
  
  return (
    <section className="relative py-20 bg-[#3a3a3a] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Main Content */}
        <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-wide mb-4">
            {title || content.title}
          </h2>
          <p className="text-xl text-white/80 font-light mb-8 max-w-2xl mx-auto">
            {subtitle || content.subtitle}
          </p>
          
          {/* CTA Button */}
          <Link 
            href="/subscriptions"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-gray-900 text-white rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-0 select-none shadow-xl hover:shadow-2xl mb-4"
          >
            {ctaText || content.ctaText}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          {/* Secondary Link */}
          <div>
            <Link 
              href="/subscriptions"
              className="text-white/60 hover:text-white text-sm font-light transition-colors duration-200 underline underline-offset-4"
            >
              {linkText || content.linkText}
            </Link>
          </div>
        </div>
        
        {/* Subtle visual elements - vary colors by product type */}
        <div className={`absolute top-1/2 left-1/4 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 ${
          productType === 'flower' ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10' :
          productType === 'edible' ? 'bg-gradient-to-br from-pink-500/10 to-purple-600/10' :
          productType === 'vape' ? 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10' :
          productType === 'wax' ? 'bg-gradient-to-br from-amber-500/10 to-orange-600/10' :
          productType === 'moonwater' ? 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10' :
          'bg-gradient-to-br from-purple-500/10 to-pink-600/10'
        }`}></div>
        <div className={`absolute top-1/2 right-1/4 w-24 h-24 rounded-full blur-3xl -translate-y-1/2 ${
          productType === 'flower' ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' :
          productType === 'edible' ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' :
          productType === 'vape' ? 'bg-gradient-to-br from-indigo-500/10 to-blue-500/10' :
          productType === 'wax' ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/10' :
          productType === 'moonwater' ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10' :
          'bg-gradient-to-br from-pink-500/10 to-purple-500/10'
        }`}></div>
      </div>
    </section>
  );
} 