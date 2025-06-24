// React import not needed in React 17+

interface ReviewCardProps {
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  verified?: boolean;
  product: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  name, 
  location, 
  rating, 
  date, 
  review, 
  verified = true, 
  product 
}) => {
  return (
    <div className="flex-none w-screen md:w-1/3 lg:w-1/4 snap-center relative group">
      <div className="h-full bg-gradient-to-br from-white/5 to-white/2 hover:from-white/8 hover:to-white/4 transition-all duration-200 border-r border-white/5 hover:border-white/10 p-6 md:p-8 flex flex-col justify-between group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]" style={{ minHeight: '220px' }}>
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-white/95 font-light text-luxury-lg tracking-luxury-normal group-hover:text-white transition-colors duration-300">{name}</h4>
              <p className="text-white/60 text-luxury-sm tracking-luxury-wide group-hover:text-white/70 transition-colors duration-300">{location}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" style={{ animationDelay: `${i * 0.05}s` }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-white/50 text-luxury-xs tracking-luxury-wide group-hover:text-white/60 transition-colors duration-300">{date}</p>
            </div>
          </div>
          <p className="text-white/80 text-luxury-sm mb-4 leading-relaxed group-hover:text-white/90 transition-colors duration-300">{review}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {verified && (
              <span className="text-green-400 text-luxury-xs tracking-luxury-wide flex items-center gap-1 hover:text-green-300 transition-colors duration-300">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified purchase
              </span>
            )}
          </div>
          <span className="text-white/50 text-luxury-xs tracking-luxury-wide group-hover:text-white/60 transition-colors duration-300">{product}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 