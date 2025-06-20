// React import not needed in React 17+
import Link from 'next/link';
import Section from '@/app/components/Section';
import SectionHeader from '@/app/components/SectionHeader';
import ReviewCard from '@/app/components/ReviewCard';
import CarouselContainer from '@/app/components/CarouselContainer';
import { ProductType } from '@/app/components/ProductCollectionConfig';

interface Review {
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  verified: boolean;
  product: string;
}

interface ReviewsSectionProps {
  productType: ProductType;
  totalReviews?: number;
  averageRating?: number;
  recommendationPercentage?: number;
}

// Product-specific review data
const reviewData: Record<ProductType, {
  reviews: Review[];
  stats: {
    total: number;
    average: number;
    recommend: number;
  };
  headers: {
    title: string;
    subtitle: string;
    helper: string;
  };
}> = {
  flower: {
    reviews: [
      {
        name: "Marcus T.",
        location: "Charlotte, NC",
        rating: 5,
        date: "2 days ago",
        review: "ZOTE is absolutely fire. 29.5% THCa and you can feel every percent. Dense nugs, perfect cure, white ash. This is what premium flower should be.",
        verified: true,
        product: "ZOTE"
      },
      {
        name: "Sarah K.",
        location: "Raleigh, NC",
        rating: 5,
        date: "1 week ago",
        review: "The Blizzard strain exceeded my expectations. Clean, energizing effects and the candy nose profile is amazing. Fast delivery too!",
        verified: true,
        product: "Blizzard"
      },
      {
        name: "James D.",
        location: "Elizabethton, TN",
        rating: 5,
        date: "3 days ago",
        review: "Gary Poppins is my new favorite. 28.44% THC and it shows. Perfect balance of effects and the customer service was excellent.",
        verified: true,
        product: "Gary Poppins"
      },
      {
        name: "Ashley R.",
        location: "Boone, NC",
        rating: 5,
        date: "5 days ago",
        review: "Cobb Stopper is perfect for evening relaxation. The cake and sherb nose is incredible and the effects are exactly as described.",
        verified: true,
        product: "Cobb Stopper"
      },
      {
        name: "Mike L.",
        location: "Greensboro, NC",
        rating: 5,
        date: "1 day ago",
        review: "Amazing quality across the board. The packaging is premium and discrete. Will definitely become a regular customer.",
        verified: true,
        product: "Strawberry Cream"
      },
    ],
    stats: {
      total: 1800,
      average: 4.9,
      recommend: 98
    },
    headers: {
      title: "Share Your Experience",
      subtitle: "Tried our flower? Let others know what you think.",
      helper: "Your review helps the community find their perfect strain."
    }
  },
  edible: {
    reviews: [
      {
        name: "Emma R.",
        location: "Charlotte, NC",
        rating: 5,
        date: "3 days ago",
        review: "The Blueberry gummies are amazing! Perfect 10mg dose, great taste, and consistent effects every time. Love the child-proof packaging too.",
        verified: true,
        product: "Blueberry Gummies"
      },
      {
        name: "David L.",
        location: "Raleigh, NC",
        rating: 5,
        date: "1 week ago",
        review: "Chocolate Chip cookies hit perfectly. 25mg is just right for my tolerance. Taste like homemade cookies with no cannabis aftertaste!",
        verified: true,
        product: "Chocolate Chip Cookie"
      },
      {
        name: "Lisa M.",
        location: "Durham, NC",
        rating: 5,
        date: "5 days ago",
        review: "The Cherry gummies are my go-to for anxiety relief. Consistent dosing and the effects last 4-6 hours. Great value for the price.",
        verified: true,
        product: "Cherry Gummies"
      },
      {
        name: "Robert K.",
        location: "Asheville, NC",
        rating: 5,
        date: "2 days ago",
        review: "Thin Mint cookies are incredible! Perfect evening treat. The 20mg dose is spot on and they actually taste like Girl Scout cookies.",
        verified: true,
        product: "Thin Mint Cookie"
      },
      {
        name: "Jennifer S.",
        location: "Winston-Salem, NC",
        rating: 5,
        date: "4 days ago",
        review: "Strawberry gummies are perfect for daytime use. 10mg gives me energy and focus without anxiety. Best edibles I've tried!",
        verified: true,
        product: "Strawberry Gummies"
      },
    ],
    stats: {
      total: 1200,
      average: 4.8,
      recommend: 96
    },
    headers: {
      title: "Share Your Experience",
      subtitle: "Enjoyed our edibles? Share your thoughts.",
      helper: "Help others find their perfect dose and flavor."
    }
  },
  vape: {
    reviews: [
      {
        name: "Tyler J.",
        location: "Charlotte, NC",
        rating: 5,
        date: "1 day ago",
        review: "The Alien Cookie cartridge is phenomenal. Smooth hits, no coughing, and the effects are immediate. Hardware quality is top-notch too.",
        verified: true,
        product: "Alien Cookie"
      },
      {
        name: "Amanda P.",
        location: "Greensboro, NC",
        rating: 5,
        date: "4 days ago",
        review: "Animal Tsunami hits like a train! Perfect for evening use. Love that it's pure distillate with no cutting agents. Will definitely reorder.",
        verified: true,
        product: "Animal Tsunami"
      },
      {
        name: "Chris H.",
        location: "Raleigh, NC",
        rating: 5,
        date: "1 week ago",
        review: "Cheetah Piss cartridge is my new favorite. Great daytime strain, keeps me focused and energized. No leaking or clogging issues.",
        verified: true,
        product: "Cheetah Piss"
      },
      {
        name: "Nicole W.",
        location: "Durham, NC",
        rating: 5,
        date: "3 days ago",
        review: "Det Runtz is incredible. Tastes exactly like candy and the potency is unmatched. Best vape cart I've had in North Carolina.",
        verified: true,
        product: "Det Runtz"
      },
      {
        name: "Jason M.",
        location: "Asheville, NC",
        rating: 5,
        date: "5 days ago",
        review: "Gary Mack cartridge is perfect for pain relief. Smooth, potent, and the battery lasts forever. Great customer service too!",
        verified: true,
        product: "Gary Mack"
      },
    ],
    stats: {
      total: 900,
      average: 4.9,
      recommend: 97
    },
    headers: {
      title: "Share Your Experience",
      subtitle: "Tried our vape cartridges? Let us know.",
      helper: "Your feedback helps us maintain quality standards."
    }
  },
  wax: {
    reviews: [
      {
        name: "Brandon K.",
        location: "Charlotte, NC",
        rating: 5,
        date: "2 days ago",
        review: "The shatter is crystal clear and incredibly potent. Perfect consistency, no residue, and amazing terpene profile. Professional grade concentrate.",
        verified: true,
        product: "OG Kush Shatter"
      },
      {
        name: "Alex T.",
        location: "Raleigh, NC",
        rating: 5,
        date: "1 week ago",
        review: "The budder is so smooth and terpy! Easy to work with and the effects are long-lasting. Best concentrate I've found in NC.",
        verified: true,
        product: "Wedding Cake Budder"
      },
      {
        name: "Maria G.",
        location: "Durham, NC",
        rating: 5,
        date: "4 days ago",
        review: "Live rosin is absolutely incredible. You can taste every terpene and the effects are clean and powerful. Worth every penny.",
        verified: true,
        product: "GMO Live Rosin"
      },
      {
        name: "Derek L.",
        location: "Asheville, NC",
        rating: 5,
        date: "3 days ago",
        review: "The sauce is perfect - great consistency and the diamonds are huge! Incredible flavor and potency. Will be ordering more.",
        verified: true,
        product: "Gelato Sauce"
      },
      {
        name: "Samantha R.",
        location: "Winston-Salem, NC",
        rating: 5,
        date: "6 days ago",
        review: "Best diamonds I've ever had. Super clean, no harsh taste, and the high is exactly what I want from a concentrate. 10/10!",
        verified: true,
        product: "THCa Diamonds"
      },
    ],
    stats: {
      total: 600,
      average: 4.9,
      recommend: 99
    },
    headers: {
      title: "Share Your Experience",
      subtitle: "Enjoyed our concentrates? Share your feedback.",
      helper: "Help others discover premium extracts."
    }
  },
  moonwater: {
    reviews: [
      {
        name: "Jessica H.",
        location: "Charlotte, NC",
        rating: 5,
        date: "2 days ago",
        review: "MoonWater is a game changer! Perfect micro-dose for social settings. No hangover and I feel great the next day. Love the citrus flavor!",
        verified: true,
        product: "Citrus MoonWater"
      },
      {
        name: "Ryan P.",
        location: "Raleigh, NC",
        rating: 5,
        date: "5 days ago",
        review: "The berry flavor is amazing and the 5mg dose is perfect for me. Great alternative to alcohol and I love that it's all natural.",
        verified: true,
        product: "Berry MoonWater"
      },
      {
        name: "Lisa K.",
        location: "Durham, NC",
        rating: 5,
        date: "1 week ago",
        review: "Tropical MoonWater is my new favorite drink. Perfect for pool parties and BBQs. Effects are mild but noticeable. Will stock up!",
        verified: true,
        product: "Tropical MoonWater"
      },
      {
        name: "Mark D.",
        location: "Asheville, NC",
        rating: 5,
        date: "3 days ago",
        review: "Finally a cannabis beverage that actually tastes good! The mint flavor is refreshing and 10mg is the perfect dose for relaxation.",
        verified: true,
        product: "Mint MoonWater"
      },
      {
        name: "Sarah T.",
        location: "Winston-Salem, NC",
        rating: 5,
        date: "4 days ago",
        review: "Love that it kicks in within 15 minutes! Perfect for social anxiety. The herbal blend is subtle and pleasant. Highly recommend!",
        verified: true,
        product: "Herbal MoonWater"
      },
    ],
    stats: {
      total: 400,
      average: 4.8,
      recommend: 95
    },
    headers: {
      title: "Share Your Experience",
      subtitle: "Tried MoonWater? Tell us what you think.",
      helper: "Your review helps others discover cannabis beverages."
    }
  },
  subscriptions: {
    reviews: [
      {
        name: "Michael S.",
        location: "Charlotte, NC",
        rating: 5,
        date: "1 month ago",
        review: "The monthly flower box is incredible! Love getting new strains to try. The curation is perfect and shipping is always on time.",
        verified: true,
        product: "Monthly Flower Box"
      },
      {
        name: "Ashley B.",
        location: "Raleigh, NC",
        rating: 5,
        date: "2 weeks ago",
        review: "VIP membership pays for itself! The discounts are amazing and early access to new products is a game changer. Best decision ever.",
        verified: true,
        product: "VIP Membership"
      },
      {
        name: "Daniel R.",
        location: "Durham, NC",
        rating: 5,
        date: "3 weeks ago",
        review: "The variety pack subscription is perfect for someone like me who loves trying everything. Great value and excellent customer service.",
        verified: true,
        product: "Variety Pack"
      },
      {
        name: "Lauren M.",
        location: "Asheville, NC",
        rating: 5,
        date: "1 week ago",
        review: "Love the edibles subscription! Perfect doses delivered monthly. Never have to worry about running out. The selection is always great.",
        verified: true,
        product: "Edibles Subscription"
      },
      {
        name: "James C.",
        location: "Winston-Salem, NC",
        rating: 5,
        date: "2 weeks ago",
        review: "The concentrate club is amazing! Premium extracts every month at a great price. Quality is consistently top-notch.",
        verified: true,
        product: "Concentrate Club"
      },
    ],
    stats: {
      total: 500,
      average: 4.9,
      recommend: 98
    },
    headers: {
      title: "Share Your Experience",
      subtitle: "Love your subscription? Let others know.",
      helper: "Help others discover the benefits of membership."
    }
  }
};

// Style constants for carousel
const carouselStyle = {
  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)',
  scrollBehavior: 'smooth' as const,
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
  backgroundSize: '50px 50px'
};

export default function ReviewsSection({ 
  productType,
  totalReviews: customTotal,
  averageRating: customAverage,
  recommendationPercentage: customRecommend
}: ReviewsSectionProps) {
  const data = reviewData[productType];
  const reviews = data.reviews;
  const stats = {
    total: customTotal || data.stats.total,
    average: customAverage || data.stats.average,
    recommend: customRecommend || data.stats.recommend
  };
  const headers = data.headers;

  // Generate more reviews by cycling through the base reviews with variations
  const generateMoreReviews = () => {
    const moreReviews: Review[] = [];
    const locations = [
      "Greensboro, NC", "Chapel Hill, NC", "Cary, NC", "High Point, NC",
      "Wilmington, NC", "Fayetteville, NC", "Gastonia, NC", "Concord, NC",
      "Greenville, NC", "Jacksonville, NC", "Rocky Mount, NC", "Wilson, NC",
      "Huntersville, NC", "Kannapolis, NC", "Apex, NC", "Holly Springs, NC",
      "Wake Forest, NC", "Indian Trail, NC", "Monroe, NC", "Salisbury, NC",
      "Cornelius, NC", "Garner, NC", "Fuquay-Varina, NC", "Mooresville, NC",
      "Knoxville, TN", "Memphis, TN", "Chattanooga, TN", "Clarksville, TN",
      "Murfreesboro, TN", "Franklin, TN", "Johnson City, TN", "Jackson, TN",
      "Columbia, SC", "Charleston, SC", "Greenville, SC", "Mount Pleasant, SC",
      "Rock Hill, SC", "Spartanburg, SC", "Summerville, SC", "Sumter, SC",
      "Atlanta, GA", "Augusta, GA", "Columbus, GA", "Savannah, GA",
      "Athens, GA", "Sandy Springs, GA", "Roswell, GA", "Alpharetta, GA"
    ];
    
    const timeframes = [
      "1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago",
      "6 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago"
    ];

    // Generate 25 more reviews by cycling and varying the base reviews
    for (let i = 0; i < 25; i++) {
      const baseReview = reviews[i % reviews.length];
      const locationIndex = i % locations.length;
      const timeIndex = i % timeframes.length;
      
      moreReviews.push({
        ...baseReview,
        name: generateName(i),
        location: locations[locationIndex],
        date: timeframes[timeIndex]
      });
    }
    
    return moreReviews;
  };

  const generateName = (index: number) => {
    const firstNames = [
      "Alex", "Jordan", "Taylor", "Casey", "Morgan", "Jamie", "Riley", "Avery",
      "Blake", "Cameron", "Drew", "Emery", "Finley", "Hayden", "Kendall", "Logan",
      "Mason", "Parker", "Quinn", "Reese", "Sage", "Skyler", "Spencer", "Sydney",
      "Tyler", "Wyatt", "Zion", "Bailey", "Charlie", "Dakota", "Ellis", "Frankie"
    ];
    const lastInitials = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", 
                          "N", "P", "R", "S", "T", "V", "W", "Y", "Z"];
    
    return `${firstNames[index % firstNames.length]} ${lastInitials[index % lastInitials.length]}.`;
  };

  const allReviews = [...reviews, ...generateMoreReviews()];

  return (
    <>
      {/* Reviews Section Header */}
      <Section id={`${productType}-reviews-section`}>
        <div className="relative z-10 py-3 w-full">
          <SectionHeader 
            title={headers.title}
            subtitle={headers.subtitle}
            delay="0.3s"
          />
          <div className="text-center mt-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            <p className="text-white/60 font-light">
              {headers.helper}
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
              arrowIdPrefix={`${productType}-reviews`}
            >
              {/* Rating Header */}
              <div className="flex-none w-screen md:w-1/3 lg:w-1/4 snap-center relative group">
                <div className="h-full bg-gradient-to-br from-white/8 to-white/3 hover:from-white/12 hover:to-white/6 backdrop-blur-sm border-r border-white/5 hover:border-white/10 flex flex-col items-center justify-center p-6 md:p-8 transition-all duration-200">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-thin text-white tracking-wide mb-3 group-hover:scale-105 transition-transform duration-300">
                      {stats.average}
                    </div>
                    <div className="flex justify-center items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 md:w-6 h-5 md:h-6 text-yellow-400 fill-current hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" style={{ animationDelay: `${i * 0.1}s` }}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/70 text-base font-light mb-2 group-hover:text-white/80 transition-colors duration-300">
                      {stats.total.toLocaleString()}+ {productType} reviews
                    </p>
                    <p className="text-white/50 text-sm group-hover:text-white/60 transition-colors duration-300">
                      Premium quality.<br />Every time.
                    </p>
                  </div>
                </div>
              </div>

              {allReviews.map((review, index) => (
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
                <div className="text-3xl font-light text-yellow-400">{stats.average}/5</div>
                <div className="text-sm text-white/70">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-emerald-400">{stats.total.toLocaleString()}+</div>
                <div className="text-sm text-white/70">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-blue-400">{stats.recommend}%</div>
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
                <h3 className="text-white font-medium mb-2">Verified</h3>
                <p className="text-white/60 text-sm">Only real customers can leave reviews</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
} 