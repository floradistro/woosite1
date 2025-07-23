// React import not needed in React 17+

interface ExperiencePanelProps {
  title: React.ReactNode;
  description: React.ReactNode;
  items: string[];
  accentColor: string;
  delay?: string;
  animationDirection?: 'left' | 'center' | 'right';
}

const ExperiencePanel: React.FC<ExperiencePanelProps> = ({ 
  title, 
  description, 
  items, 
  accentColor,
  delay = '200ms',
  animationDirection = 'center'
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-8 bg-gradient-to-br from-white/5 to-white/3 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group">
      {/* Add luxury shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 pointer-events-none rounded-lg"></div>
      
      {/* Top section - Title and Description */}
      <div className="relative z-10">
        <div className="flex items-center cursor-default mb-4">
          <div className={`w-12 h-1 bg-${accentColor}-500 group-hover:bg-${accentColor}-400 transition-colors duration-300`}></div>
          <h3 className="ml-3 text-luxury-xl md:text-luxury-2xl font-extralight tracking-luxury-normal group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
        </div>
        <p className="text-white/90 text-luxury-base leading-relaxed hover:text-white transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Bottom section - Items */}
      <ul className="space-y-3 mt-6 relative z-10">
        {items.map((item, index) => (
          <li key={index} className="flex items-center group/item">
            <div className={`w-4 h-4 rounded-full bg-${accentColor}-500 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`}></div>
            <span className="ml-3 text-white/90 text-luxury-sm tracking-luxury-normal group-hover/item:text-white transition-colors duration-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperiencePanel; 