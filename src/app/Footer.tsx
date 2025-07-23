"use client";

import Link from 'next/link';
import { useState } from 'react';

// Import the same styling constant used by other sections
const PRODUCT_CARD_STYLE = {
  background: '#4a4a4a',
  backdropFilter: 'blur(20px) saturate(120%)',
  WebkitBackdropFilter: 'blur(20px) saturate(120%)'
} as const;

interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
    isText?: boolean;
  }>;
}

const footerSections: FooterSection[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Flower', href: '/flower' },
      { label: 'Vape', href: '/vape' },
      { label: 'Concentrates', href: '/concentrates' },
      { label: 'Pre-rolls', href: '/flower?format=preroll' },
    ]
  },
  {
    title: 'Wholesale',
    links: [
      { label: 'Volume Pricing', href: '/wholesale' },
      { label: 'Submit Inquiry', href: '/wholesale' },
      { label: 'Requirements', href: '/wholesale' },
      { label: 'Direct Delivery', href: '/wholesale' },
    ]
  },
  {
    title: 'Profile',
    links: [
      { label: 'My Account', href: '/profile' },
      { label: 'Order History', href: '/profile/orders' },
      { label: 'Subscriptions', href: '/subscriptions' },
      { label: 'Rewards', href: '/profile/rewards' },
    ]
  },
  {
    title: 'Learn',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Lab Results', href: '/lab-results' },
      { label: 'Shipping', href: '/shipping' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'Policies', href: '/policies' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
    ]
  },
  {
    title: 'Contact',
    links: [
      { label: 'support@floradistro.com', href: 'mailto:support@floradistro.com', isText: true },
      { label: '4111 E-Rose Lake Dr #6994', href: '#', isText: true },
      { label: 'Charlotte, NC 28217', href: '#', isText: true },
    ]
  },
];

export default function Footer() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <footer 
      className="relative py-6 mt-8 overflow-hidden"
      style={{
        ...PRODUCT_CARD_STYLE,
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(0, 0, 0, 0.06)',
        zIndex: 10
      }}
    >
      {/* Solid background to completely block grid */}
      <div className="absolute inset-0 bg-[#4a4a4a] z-[0]"></div>
      
      {/* Fade overlay - exactly matching review cards */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/8 to-black/25 opacity-80"></div>
      </div>

      <div className="relative z-[2] container mx-auto px-4 md:px-6">
        {/* Email Signup Section */}
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          
          {/* Compact Header */}
          <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards] mb-4 md:mb-6">
            <h2 className="text-white/95 font-light tracking-[0.15em] mb-3" style={{fontSize:'clamp(1.25rem,2.5vw,1.75rem)',lineHeight:'1.1'}}>
              Don't miss the drop.
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          </div>

          {/* Condensed Value Prop */}
          <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards] mb-4 md:mb-6">
            <p className="text-white/85 font-light text-sm md:text-base leading-relaxed mb-3">
              We don't blast. We don't spam. If you hear from us, it's worth opening.
            </p>
            
            {/* Inline Benefits */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-white/75 font-light text-xs md:text-sm">
              <span className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                early access
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                one-click checkout
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                real rewards
              </span>
            </div>
          </div>

          {/* Sleek CTA */}
          <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards]">
            <p className="text-white/90 font-light text-xs md:text-sm mb-4 tracking-wide italic">
              Get in or miss out.
            </p>
            
            {/* Refined Email Form */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/8 backdrop-blur-sm border border-white/25 rounded-full px-4 md:px-5 py-2.5 md:py-3 text-white placeholder-white/40 font-light text-sm tracking-wide focus:outline-none focus:border-white/50 focus:bg-white/12 transition-all duration-300"
              />
              <button className="group bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 hover:border-white/50 rounded-full px-5 md:px-6 py-2.5 md:py-3 transition-all duration-300 hover:scale-105 text-white font-light text-sm tracking-wide relative overflow-hidden whitespace-nowrap">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-200"></div>
                <span className="relative">→ Join</span>
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Expandable Sections (visible on mobile only) */}
        <div className="md:hidden space-y-0 mb-8">
          {footerSections.map((section) => (
            <div key={section.title} className="border-b border-white/10 last:border-b-0">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between py-4 px-2 text-left focus:outline-none"
              >
                <span className="text-white font-light text-base">{section.title}</span>
                <svg
                  className={`w-5 h-5 text-white/70 transition-transform duration-300 ${
                    expandedSections.has(section.title) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedSections.has(section.title) 
                    ? 'max-h-96 opacity-100 pb-4' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`px-2 ${section.title === 'Contact' ? 'space-y-3' : '-space-y-2'}`}>
                  {section.links.map((link) => (
                    <div key={link.label}>
                      {link.isText ? (
                        <span className={`block text-white/70 font-light ${
                          section.title === 'Contact' 
                            ? 'text-sm leading-relaxed py-1' 
                            : 'text-base leading-none'
                        }`}>
                          {link.label}
                        </span>
                      ) : (
                        <Link 
                          href={link.href} 
                          className={`block text-white/70 hover:text-white transition-colors font-light ${
                            section.title === 'Contact' 
                              ? 'text-sm leading-relaxed py-1' 
                              : 'text-base leading-none'
                          }`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid Layout (hidden on mobile) */}
        <div className="hidden md:flex flex-wrap justify-center gap-6 lg:gap-12 mb-6">
          {footerSections.map((section) => (
            <div key={section.title} className="text-center space-y-2">
              <h4 className="text-base font-light text-white mb-2">{section.title}</h4>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <div key={link.label}>
                    {link.isText ? (
                      <p className="text-white/70 text-sm">{link.label}</p>
                    ) : (
                      <Link 
                        href={link.href} 
                        className="block text-white/70 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-6">
          <a href="https://twitter.com/floradistro" className="text-white/60 hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://facebook.com/floradistro" className="text-white/60 hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://instagram.com/floradistro" className="text-white/60 hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.68 13.407 3.68 11.817c0-1.59.518-3.078 1.446-4.274.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.928 1.196 1.446 2.684 1.446 4.274 0 1.59-.518 3.078-1.446 4.274-.875.807-2.026 1.297-3.323 1.297zm7.72-10.096c-.5 0-.906-.405-.906-.905s.405-.905.905-.905.905.405.905.905-.405.905-.905.905z"/>
              <path d="M12.017 7.056c-2.734 0-4.95 2.216-4.95 4.95s2.216 4.95 4.95 4.95 4.95-2.216 4.95-4.95-2.216-4.95-4.95-4.95zm0 8.17c-1.776 0-3.22-1.444-3.22-3.22s1.444-3.22 3.22-3.22 3.22 1.444 3.22 3.22-1.444 3.22-3.22 3.22z"/>
            </svg>
          </a>
        </div>
        
        {/* Legal Information - Improved Mobile Spacing */}
        <div className="text-center space-y-3 text-white/60">
          <div className="space-y-3 md:space-y-2 max-w-4xl mx-auto">
            <p className="text-xs leading-relaxed px-2">
              All products contain less than 0.3% hemp-derived delta-9 THC in compliance with the 2018 Farm Bill.
            </p>
            <p className="text-xs leading-relaxed px-2">
              This product is not available for shipment to: Arkansas, Hawaii, Idaho, Kansas, Louisiana, Oklahoma, Oregon, Rhode Island, Utah, Vermont.
            </p>
            <p className="text-xs leading-relaxed px-2">
              FDA Disclaimer: These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 