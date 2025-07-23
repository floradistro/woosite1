"use client"

import Link from 'next/link';

const stores = [
  {
    id: 1,
    name: "Charlotte",
    address: "3130 Monroe Road",
    city: "Charlotte, NC 28205",
  },
  {
    id: 2,
    name: "Salisbury",
    address: "111 W Bank Street",
    city: "Salisbury, NC 28144",
  },
  {
    id: 3,
    name: "Blowing Rock",
    address: "3894 US 321",
    city: "Blowing Rock, NC 28605",
  },
  {
    id: 4,
    name: "Elizabethton",
    address: "2157 W Elk Ave",
    city: "Elizabethton, TN 37643",
  }
];

export default function SimpleStoresSection() {
  const handleStoreClick = (store: typeof stores[0]) => {
    const address = encodeURIComponent(`${store.address}, ${store.city}`);
    window.open(`https://maps.google.com/?q=${address}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-[#4a4a4a] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-2">
            Visit Our Stores
          </h2>
          <p className="text-white/70 text-sm md:text-base font-light mb-4">
            5 Locations. Farm Direct. Independently Owned.
          </p>
          
          {/* Store Hours */}
          <div className="max-w-md mx-auto bg-[#3a3a3a] border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 className="text-white font-light text-sm">Store Hours</h3>
            </div>
            <p className="text-white/80 font-light text-xs">Monday - Saturday: 11am - 9pm</p>
            <p className="text-white/80 font-light text-xs">Sunday: 12pm - 6pm</p>
          </div>
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stores.map((store) => (
            <div 
              key={store.id}
              onClick={() => handleStoreClick(store)}
              className="bg-[#3a3a3a] border border-white/10 rounded-lg p-3 md:p-4 cursor-pointer hover:bg-[#404040] hover:border-white/20 transition-all duration-300"
            >
              {/* Pin Icon */}
              <div className="flex justify-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>

              {/* Store Info */}
              <div className="text-center">
                <h3 className="text-white text-base md:text-lg font-light mb-1">{store.name}</h3>
                <p className="text-white/70 text-xs font-light">{store.address}</p>
                <p className="text-white/60 text-xs font-light mb-2">{store.city}</p>
                
                {/* CTA */}
                <div className="flex items-center justify-center space-x-1 text-red-400 text-xs font-medium">
                  <span>Get Directions</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link 
            href="/flower" 
            className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 px-4 py-2 rounded-lg text-white text-sm font-light transition-all duration-200"
          >
            <span>Shop Online Now</span>
          </Link>
        </div>
      </div>
    </section>
  );
} 