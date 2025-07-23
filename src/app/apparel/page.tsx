"use client";

export default function ApparelPage() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
      <div className="text-center px-6 max-w-2xl mx-auto">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Dot grid background */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0'
          }}></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

                 {/* Content */}
         <div className="relative z-10 space-y-8 animate-fadeInUp">
           {/* Main Title */}
           <div className="text-center">
                           <h1 className="text-6xl md:text-8xl font-extralight tracking-wider mb-4 uppercase text-white">
                Apparel
              </h1>
           </div>
           
           {/* Coming Soon Badge */}
           <div className="flex justify-center">
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
               <span className="text-lg font-light text-white/90 tracking-wide">Coming Soon</span>
             </div>
           </div>

           

           
         </div>
      </div>
    </div>
  );
} 