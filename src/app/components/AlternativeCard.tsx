// React import not needed in React 17+

interface AlternativeCardProps {
  title: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  delay: string;
}

const AlternativeCard: React.FC<AlternativeCardProps> = ({
  title,
  description,
  colorFrom,
  colorTo,
  delay
}) => {
  // Define color mappings for the accent lines
  const getGradientStyle = (from: string, to: string) => {
    const colorMap: Record<string, string> = {
      red: 'linear-gradient(to bottom, #f87171, #dc2626)',
      yellow: 'linear-gradient(to bottom, #fbbf24, #d97706)', 
      orange: 'linear-gradient(to bottom, #fb923c, #ea580c)',
      purple: 'linear-gradient(to bottom, #a78bfa, #7c3aed)'
    };
    return colorMap[from] || colorMap.red;
  };

  return (
    <div 
      className="group opacity-0 h-full"
      style={{
        animation: `fadeInUp 1s ease-out ${delay} forwards`
      }}
    >
      <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/12 hover:to-white/6 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] relative overflow-hidden h-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-200"></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-1.5 h-6 rounded-full flex-shrink-0"
              style={{
                background: getGradientStyle(colorFrom, colorTo)
              }}
            ></div>
            <h3 className="text-white/95 font-medium text-luxury-lg tracking-luxury-normal">{title}</h3>
          </div>
          <p className="text-white/75 font-light leading-relaxed text-luxury-sm tracking-luxury-normal flex-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlternativeCard; 