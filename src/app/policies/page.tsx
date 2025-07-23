"use client"

export default function Policies() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white font-sans">
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 px-4 glass-section overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8 opacity-0 animate-[scaleX_1s_ease-out_0.3s_forwards] origin-center"></div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-white/95 mb-6 opacity-0 animate-[fadeInUp_0.9s_ease-out_0.6s_forwards]">
              POLICIES
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide opacity-0 animate-[fadeInUp_0.9s_ease-out_0.9s_forwards]">
              Clear terms. No fine print games.
            </p>
            
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-8 opacity-0 animate-[scaleX_1s_ease-out_1.2s_forwards] origin-center"></div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="relative py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards] border-l-4 border-yellow-500/50">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6 flex items-center gap-3">
                <span className="text-yellow-500">⚠️</span> DISCLAIMER
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <div>
                  <h3 className="text-xl font-medium text-white/90 mb-3">THCA Restrictions:</h3>
                  <p>We do not ship to the following states due to local restrictions:</p>
                  <p className="font-medium text-red-400">Hawaii, Idaho, Minnesota, Oregon, Rhode Island, Utah, Vermont</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-white/90 mb-3">FDA Notice:</h3>
                  <p>This product has not been evaluated by the FDA. It is not intended to diagnose, treat, cure, or prevent any disease.</p>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6 flex items-center gap-3">
                <span>⚖️</span> TERMS & CONDITIONS
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p className="text-white/60">Effective: 09/01/2024</p>
                <p>Using this site means you agree to the following:</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white/90">1. Age Requirement</h3>
                    <p>You must be 21+. We reserve the right to cancel orders if false info is provided.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">2. Product Info</h3>
                    <p>We sell THCA products compliant with the 2018 Farm Bill (&lt;0.3% Delta-9 THC).</p>
                    <p>Check your state laws before ordering.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">3. Orders & Payment</h3>
                    <ul className="space-y-1 ml-4">
                      <li>• Orders may be refused or limited</li>
                      <li>• Cancellations/changes allowed within 1 hour of ordering</li>
                      <li>• Prices in USD; taxes and shipping calculated at checkout</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">4. Shipping</h3>
                    <p>See our full Shipping Policy for restrictions and responsibilities.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">5. Returns</h3>
                    <p>All sales are final. See our Returns Policy for limited exceptions.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">6. IP Rights</h3>
                    <p>All content is owned by Flora Distro. No reproduction without permission.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">7. Liability</h3>
                    <p>We are not liable for misuse of our products. Use them responsibly and legally.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">8. No Medical Claims</h3>
                    <p>Our products are not medicine. Speak to a healthcare provider if needed.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">9. Accounts</h3>
                    <p>Keep your login secure. We may cancel accounts for misuse or fraud.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">10. Updates</h3>
                    <p>Terms may change. By continuing to use the site, you accept any changes.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">11. Legal</h3>
                    <p>These terms are governed by the laws of North Carolina.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">12. Questions?</h3>
                    <p>support@floradistro.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Policy */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.9s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6 flex items-center gap-3">
                <span>🚚</span> SHIPPING POLICY
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>We ship discreetly, fast, and only where it's legal.</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white/90">1. Eligibility</h3>
                    <p>You must be 21 or older. All orders require adult signature and ID on delivery.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">2. Where We Ship</h3>
                    <p>We ship within the U.S. — except to:</p>
                    <p className="font-medium text-red-400">Arkansas, Idaho, Minnesota, Oregon, Rhode Island</p>
                    <p>We do not offer international shipping.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">3. Timelines</h3>
                    <ul className="space-y-1 ml-4">
                      <li>• Processing: 1–3 business days</li>
                      <li>• Delivery: 3–7 business days</li>
                      <li>• Expedited: Available at checkout</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">4. Packaging</h3>
                    <p>Plain and unbranded. No cannabis references on the outside.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">5. Costs</h3>
                    <ul className="space-y-1 ml-4">
                      <li>• Standard: $5.99</li>
                      <li>• Free shipping: Orders over $99</li>
                      <li>• Expedited: Calculated at checkout</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">6. Tracking</h3>
                    <p>You'll receive a tracking number once your order ships.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">7. Issues</h3>
                    <ul className="space-y-1 ml-4">
                      <li>• Lost/Stolen: Not our responsibility after "Delivered"</li>
                      <li>• Wrong Address: Customer is responsible</li>
                      <li>• Failed Delivery: Reattempt fees may apply</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">8. Contact</h3>
                    <p>support@floradistro.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns Policy */}
            <div className="glass-card rounded-2xl p-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.2s_forwards]">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 mb-6 flex items-center gap-3">
                <span>↩️</span> RETURNS POLICY
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p className="font-medium text-red-400">All sales are final. Here's what that means:</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white/90">1. No Returns</h3>
                    <p>Our products are perishable. Once they leave our facility, they cannot be resold.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">2. Damaged or Wrong Orders?</h3>
                    <p>We'll make it right.</p>
                    <p>Email support@floradistro.com within 7 days of delivery. Include:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Your order number</li>
                      <li>• Photos of damage or incorrect items</li>
                      <li>• A short description of the issue</li>
                    </ul>
                    <p>We'll review and may offer a replacement, refund, or credit.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white/90">3. Exceptions</h3>
                    <p>We do not offer returns or exchanges for:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Opened or used products</li>
                      <li>• Customer errors</li>
                      <li>• Orders sent to incorrect addresses</li>
                    </ul>
                  </div>
                </div>
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