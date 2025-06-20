// React import not needed in React 17+
import Link from 'next/link';
import Section from '../../components/Section';
import SectionHeader from '../../components/SectionHeader';
import ReviewCard from '../../components/ReviewCard';
import CarouselContainer from '../../components/CarouselContainer';

// Vape-specific reviews data
const vapeReviews = [
  {
    name: "Marcus T.",
    location: "Charlotte, NC",
    rating: 5,
    date: "2 days ago",
    review: "ZOTE live resin is absolutely fire. 88% THC and the terpene profile is incredible. Smooth hits, no clogging, pure flavor.",
    verified: true,
    product: "ZOTE Live Resin"
  },
  {
    name: "Sarah K.",
    location: "Raleigh, NC",
    rating: 5,
    date: "1 week ago",
    review: "The Blizzard distillate exceeded my expectations. Clean, energizing effects and the candy flavor comes through perfectly. CCELL hardware is top notch!",
    verified: true,
    product: "Blizzard Distillate"
  },
  {
    name: "James D.",
    location: "Elizabethton, TN",
    rating: 5,
    date: "3 days ago",
    review: "Gary Poppins live resin is my new favorite. 89.44% THC and it shows. Perfect balance of effects and the hardware never clogs.",
    verified: true,
    product: "Gary Poppins Live Resin"
  },
  {
    name: "Ashley R.",
    location: "Boone, NC",
    rating: 5,
    date: "5 days ago",
    review: "Cobb Stopper rosin is perfect for evening relaxation. The solventless extraction really makes a difference in flavor and effects.",
    verified: true,
    product: "Cobb Stopper Rosin"
  },
  {
    name: "Mike L.",
    location: "Greensboro, NC",
    rating: 5,
    date: "1 day ago",
    review: "Amazing quality across the board. The oil is crystal clear and the hardware is premium. Will definitely become a regular customer.",
    verified: true,
    product: "Strawberry Cream Diamonds"
  },
  {
    name: "Destiny W.",
    location: "Durham, NC",
    rating: 5,
    date: "4 days ago",
    review: "First time trying live resin and blown away by the quality. Full spectrum effects and the flavor is unmatched. Fast shipping too.",
    verified: true,
    product: "Electric Lemon Live Resin"
  },
  {
    name: "Tony B.",
    location: "Atlanta, GA",
    rating: 5,
    date: "6 days ago",
    review: "Been vaping for years and this is top shelf quality. No cutting agents, just pure extract. The CCELL hardware hits perfect every time.",
    verified: true,
    product: "Purple Punch Sauce"
  },
  {
    name: "Emma C.",
    location: "Nashville, TN",
    rating: 5,
    date: "1 week ago",
    review: "Love the variety of extracts and the detailed lab results. Helps me pick exactly what I need. Great customer service!",
    verified: true,
    product: "Gelato #33 Live Resin"
  },
  {
    name: "Carlos M.",
    location: "Asheville, NC",
    rating: 5,
    date: "3 days ago",
    review: "The Strawberry Cream diamonds are insane. 93.47% THC and tastes exactly like the name suggests. Perfect for unwinding.",
    verified: true,
    product: "Strawberry Cream Diamonds"
  },
  {
    name: "Jessica L.",
    location: "Winston-Salem, NC",
    rating: 5,
    date: "2 weeks ago",
    review: "Electric Lemon gives me the perfect morning energy boost. Clean distillate with natural terpenes. No anxiety, just focus!",
    verified: true,
    product: "Electric Lemon Distillate"
  },
  {
    name: "David R.",
    location: "Hickory, NC",
    rating: 5,
    date: "1 week ago",
    review: "Purple Punch sauce knocked me out in the best way. Perfect for insomnia and the grape terps are incredible. 10/10 would order again.",
    verified: true,
    product: "Purple Punch Sauce"
  },
  {
    name: "Amanda S.",
    location: "Gastonia, NC",
    rating: 5,
    date: "5 days ago",
    review: "Gelato #33 live resin is my go-to hybrid. Perfect balance and the full spectrum effects are noticeable. Premium packaging too.",
    verified: true,
    product: "Gelato #33 Live Resin"
  },
  {
    name: "Kevin W.",
    location: "Concord, NC",
    rating: 5,
    date: "4 days ago",
    review: "ZOTE live resin hits different. The terpene preservation is incredible and the effects are exactly what I needed. Premium quality.",
    verified: true,
    product: "ZOTE Live Resin"
  },
  {
    name: "Rachel P.",
    location: "Huntersville, NC",
    rating: 5,
    date: "1 week ago",
    review: "Blizzard distillate is perfect for daytime use. Clean sativa effects with amazing candy flavor. Hardware never clogs!",
    verified: true,
    product: "Blizzard Distillate"
  },
  {
    name: "Brandon K.",
    location: "Kannapolis, NC",
    rating: 5,
    date: "6 days ago",
    review: "Gary Poppins live resin exceeded all expectations. Potent, flavorful, and the CCELL hardware is quality. This is premium.",
    verified: true,
    product: "Gary Poppins Live Resin"
  },
  {
    name: "Melissa T.",
    location: "Statesville, NC",
    rating: 5,
    date: "3 days ago",
    review: "Cobb Stopper rosin is my new nighttime go-to. Solventless extraction makes such a difference. Will definitely reorder.",
    verified: true,
    product: "Cobb Stopper Rosin"
  },
  {
    name: "Tyler J.",
    location: "Cornelius, NC",
    rating: 5,
    date: "2 days ago",
    review: "The quality is unmatched. Every cartridge I've tried has been perfectly filled and incredibly potent. Customer for life!",
    verified: true,
    product: "Mac and Cheese Sauce"
  },
  {
    name: "Nicole B.",
    location: "Davidson, NC",
    rating: 5,
    date: "1 week ago",
    review: "Electric Lemon distillate is my morning go-to. Clean energy without the jitters. Perfect for productivity. Love it!",
    verified: true,
    product: "Electric Lemon Distillate"
  },
  {
    name: "Chris H.",
    location: "Mint Hill, NC",
    rating: 5,
    date: "4 days ago",
    review: "Purple Punch sauce is incredible for sleep. The terp profile is spot on and the effects are exactly what I needed.",
    verified: true,
    product: "Purple Punch Sauce"
  },
  {
    name: "Stephanie G.",
    location: "Matthews, NC",
    rating: 5,
    date: "5 days ago",
    review: "Gelato #33 live resin is the perfect hybrid. Great for any time of day and the flavor is incredible. Fast shipping!",
    verified: true,
    product: "Gelato #33 Live Resin"
  },
  {
    name: "Jordan L.",
    location: "Indian Trail, NC",
    rating: 5,
    date: "2 weeks ago",
    review: "ZOTE live resin is absolutely insane. 88% THC and you can feel every bit of it. Smooth, flavorful, and potent.",
    verified: true,
    product: "ZOTE Live Resin"
  },
  {
    name: "Brittany M.",
    location: "Waxhaw, NC",
    rating: 5,
    date: "1 week ago",
    review: "Blizzard distillate gives me the perfect creative boost. Clean effects with amazing candy terps. Perfect packaging.",
    verified: true,
    product: "Blizzard Distillate"
  },
  {
    name: "Austin R.",
    location: "Monroe, NC",
    rating: 5,
    date: "6 days ago",
    review: "Gary Poppins live resin is top shelf quality. Perfect consistency, incredible potency, and amazing flavor profile.",
    verified: true,
    product: "Gary Poppins Live Resin"
  },
  {
    name: "Kayla D.",
    location: "Pineville, NC",
    rating: 5,
    date: "3 days ago",
    review: "Cobb Stopper rosin is perfect for winding down. The solventless extraction really shines through in the flavor.",
    verified: true,
    product: "Cobb Stopper Rosin"
  },
  {
    name: "Ryan S.",
    location: "Fort Mill, SC",
    rating: 5,
    date: "4 days ago",
    review: "Strawberry Cream diamonds taste exactly like strawberries and cream. 93% THC hits perfect and the hardware is flawless.",
    verified: true,
    product: "Strawberry Cream Diamonds"
  },
  {
    name: "Samantha W.",
    location: "Rock Hill, SC",
    rating: 5,
    date: "1 week ago",
    review: "Electric Lemon distillate is my productivity strain. Clean, focused energy without any crash. Perfect hardware too!",
    verified: true,
    product: "Electric Lemon Distillate"
  },
  {
    name: "Jake P.",
    location: "York, SC",
    rating: 5,
    date: "5 days ago",
    review: "Purple Punch sauce knocked me out in the best way. Perfect for insomnia and the grape terps are absolutely incredible.",
    verified: true,
    product: "Purple Punch Sauce"
  },
  {
    name: "Lauren K.",
    location: "Clover, SC",
    rating: 5,
    date: "2 days ago",
    review: "Gelato #33 live resin is the perfect all-day vape. Great balance of effects and the flavor is out of this world!",
    verified: true,
    product: "Gelato #33 Live Resin"
  },
  {
    name: "Mason T.",
    location: "Tega Cay, SC",
    rating: 5,
    date: "1 week ago",
    review: "ZOTE live resin is absolutely fire. The terpene preservation is perfect and the effects are incredibly potent.",
    verified: true,
    product: "ZOTE Live Resin"
  },
  {
    name: "Alexis H.",
    location: "Lake Wylie, SC",
    rating: 5,
    date: "6 days ago",
    review: "Blizzard distillate is perfect for creative work. Clean effects with amazing candy terps. Fast shipping and perfect packaging.",
    verified: true,
    product: "Blizzard Distillate"
  }
];

// Style constants for carousel
const carouselStyle = {
  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)',
  scrollBehavior: 'smooth' as const,
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
  backgroundSize: '50px 50px'
};

export default function ReviewsSection() {
  return (
    <>
      {/* Reviews Section Header */}
      <Section id="vape-reviews-section">
        <div className="relative z-10 py-3 w-full">
          <SectionHeader 
            title="Share Your Experience"
            subtitle="Tried our vapes? Let others know what you think."
            delay="0.3s"
          />
          <div className="text-center mt-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            <p className="text-white/60 font-light">
              Your review helps the community find their perfect extract.
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
              arrowIdPrefix="vape-reviews"
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
                    <p className="text-white/70 text-base font-light mb-2 group-hover:text-white/80 transition-colors duration-300">1,200+ vape reviews</p>
                    <p className="text-white/50 text-sm group-hover:text-white/60 transition-colors duration-300">Pure extracts.<br />Every time.</p>
                  </div>
                </div>
              </div>

              {vapeReviews.map((review, index) => (
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

      {/* Write a Review CTA Section */}
      <Section className="relative bg-[#3a3a3a] overflow-hidden -mt-px">
        <div className="relative z-10 py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Review Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
              <div className="text-center">
                <div className="text-3xl font-light text-yellow-400">4.9/5</div>
                <div className="text-sm text-white/70">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-emerald-400">1,200+</div>
                <div className="text-sm text-white/70">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-blue-400">98%</div>
                <div className="text-sm text-white/70">Recommend</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
              <button className="group px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl hover:shadow-2xl">
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Share Your Experience
                <span className="text-xs bg-black/20 px-2 py-1 rounded-full">Earn Rewards</span>
              </button>
              
              <Link 
                href="/profile"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-lg font-light transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View My Reviews
              </Link>
            </div>

            {/* Review Benefits */}
            <div className="grid grid-cols-3 gap-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards]">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-white font-medium mb-2">Earn Rewards</h3>
                <p className="text-white/60 text-sm">Get points for every review you write</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium mb-2">Help Others</h3>
                <p className="text-white/60 text-sm">Share your experience with the community</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium mb-2">Verified Purchase</h3>
                <p className="text-white/60 text-sm">Only real customers can leave reviews</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
} 