"use client"

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white font-light">
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 px-4 glass-section overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8 opacity-0 animate-[scaleX_1s_ease-out_0.3s_forwards] origin-center"></div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-white/95 mb-6 opacity-0 animate-[fadeInUp_0.9s_ease-out_0.6s_forwards]">
              PRIVACY
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide opacity-0 animate-[fadeInUp_0.9s_ease-out_0.9s_forwards]">
              Your data. Your control. Our commitment.
            </p>
            
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-8 opacity-0 animate-[scaleX_1s_ease-out_1.2s_forwards] origin-center"></div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="relative py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Privacy Policy */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6 flex items-center gap-3">
                <span>🔒</span> PRIVACY POLICY
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p className="text-white/60">Effective: 09/01/2024</p>
                <p>We value privacy. Here's how we handle your data when you visit Distropass or shop with us.</p>
              </div>
            </div>

            {/* What We Collect */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6">
                1. What We Collect
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-light text-white/90">Personal Info:</h3>
                    <p>Name, email, address, phone, payment details</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-light text-white/90">Device Info:</h3>
                    <p>IP, browser, operating system</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-light text-white/90">Orders:</h3>
                    <p>Products, totals, shipping, payment method</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-light text-white/90">Cookies:</h3>
                    <p>For tracking and user behavior — see our Cookie Policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Use It */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.9s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6">
                2. How We Use It
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <ul className="space-y-2">
                  <li>• To process orders</li>
                  <li>• To send order updates & offers (you can opt out)</li>
                  <li>• To improve site performance</li>
                  <li>• To comply with laws (including age verification)</li>
                </ul>
              </div>
            </div>

            {/* Who We Share It With */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.2s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6">
                3. Who We Share It With
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>Only trusted providers — for payment, hosting, delivery, and support.</p>
                <p className="font-light text-green-400">We never sell or rent your data.</p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.5s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6">
                4. Your Rights
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>Depending on your location, you may:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Access or update your data</li>
                  <li>• Request deletion</li>
                  <li>• Opt out of promotional emails</li>
                </ul>
              </div>
            </div>

            {/* Data Storage */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.8s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6">
                5. Data Storage
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>We retain only what we need, as long as we need it.</p>
              </div>
            </div>

            {/* Age Limit */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_2.1s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6">
                6. Age Limit
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>This site is for users 21+. We don't knowingly collect data from minors.</p>
              </div>
            </div>

            {/* Questions */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_2.4s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6">
                7. Questions?
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>Email: support@floradistro.com</p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .glass-section {
          background: #4a4a4a;
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .glass-card {
          background: #4a4a4a;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
} 