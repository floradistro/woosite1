'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    businessName: '',
    location: '',
    monthlyVolume: '',
    deliveryFrequency: '',
    additionalInfo: '',
    understood: false
  })
  
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.understood) {
      setSubmitted(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-wide">Thank you for your submission.</h2>
          
          <div className="space-y-6 text-white/80">
            <p className="text-lg font-light">
              Thank you for your application.
            </p>
            
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-white font-medium mb-3">What happens next:</h3>
              <ul className="text-white/70 space-y-2 text-left">
                <li>• Review within 5-7 business days</li>
                <li>• Qualified applicants contacted directly</li>
                <li>• Background & license verification</li>
                <li>• Network onboarding (if approved)</li>
              </ul>
            </div>
            
            <p className="text-base font-light text-white/60">
              We'll contact you if a spot becomes available.
            </p>
          </div>
          
          {/* Add secondary CTA */}
          <div className="mt-12 space-y-4">
            <Link 
              href="/flower" 
              className="inline-block px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded-lg transition-all duration-300"
            >
              Browse Our Retail Selection
            </Link>
            
            <div className="block">
              <Link href="/" className="text-white/60 hover:text-white transition-colors font-light">
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white">
      {/* Simple Title Section */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2 text-white">
            Wholesale Access
          </h1>
          <p className="text-lg text-white/70 font-light">
            Private distribution. Business-to-business only.
          </p>
        </motion.div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-lg text-white/80 font-light"
        >
          <p className="text-xl leading-relaxed">
            We quietly power some of the highest-volume flower operations on the East Coast — farm-direct, verified, and delivered within 24 hours.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="h-full flex flex-col justify-between p-8 bg-gradient-to-br from-white/5 to-white/3 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group relative"
            >
              {/* Add luxury shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 pointer-events-none rounded-lg"></div>
              
              <div className="relative z-10">
                <div className="flex items-center cursor-default mb-4">
                  <div className="w-12 h-1 bg-emerald-500 group-hover:bg-emerald-400 transition-colors duration-300"></div>
                  <h3 className="ml-3 text-lg md:text-xl font-light tracking-wide group-hover:text-white transition-colors duration-300">
                    1. Verified. Tracked. On time.
                  </h3>
                </div>
                <p className="text-white/90 text-base leading-relaxed hover:text-white transition-colors duration-300 font-light">
                  Direct farm access. No markups — pricing reserved for our network.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="h-full flex flex-col justify-between p-8 bg-gradient-to-br from-white/5 to-white/3 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group relative"
            >
              {/* Add luxury shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 pointer-events-none rounded-lg"></div>
              
              <div className="relative z-10">
                <div className="flex items-center cursor-default mb-4">
                  <div className="w-12 h-1 bg-blue-500 group-hover:bg-blue-400 transition-colors duration-300"></div>
                  <h3 className="ml-3 text-lg md:text-xl font-light tracking-wide group-hover:text-white transition-colors duration-300">
                    2. Full custody. Full control.
                  </h3>
                </div>
                <p className="text-white/90 text-base leading-relaxed hover:text-white transition-colors duration-300 font-light">
                  No brokers. No exposure. Only trusted hands move inside the circle.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="h-full flex flex-col justify-between p-8 bg-gradient-to-br from-white/5 to-white/3 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group relative"
            >
              {/* Add luxury shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 pointer-events-none rounded-lg"></div>
              
              <div className="relative z-10">
                <div className="flex items-center cursor-default mb-4">
                  <div className="w-12 h-1 bg-purple-500 group-hover:bg-purple-400 transition-colors duration-300"></div>
                  <h3 className="ml-3 text-lg md:text-xl font-light tracking-wide group-hover:text-white transition-colors duration-300">
                    3. Engineered for scale.
                  </h3>
                </div>
                <p className="text-white/90 text-base leading-relaxed hover:text-white transition-colors duration-300 font-light">
                  Our circle gets what others don't — legal structure, strategic insight, and real infrastructure.
                </p>
              </div>
            </motion.div>
          </div>
          
          <p className="text-xl">
            We're already moving <span className="text-white font-medium">thousands of pounds monthly</span> through a small, handpicked partner network.
          </p>
          
          <p className="text-2xl text-white font-light tracking-wide">
            Access is limited. Few get in.
          </p>
        </motion.div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-light mb-4 text-center tracking-wide">✅ Application Form</h2>
          
          {/* Add urgency banner */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-black border border-white/20 py-2 px-4 rounded-lg mb-8 text-center">
            <p className="text-white font-medium">
              Don't miss out, apply for a seat at our table
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-light text-white/80 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:border-emerald-400/50 focus:bg-white/8 focus:outline-none transition-all duration-300 text-white placeholder-white/40"
              />
            </div>
            
            <div>
              <label className="block text-sm font-light text-white/80 mb-2">Role / Title</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:border-emerald-400/50 focus:bg-white/8 focus:outline-none transition-all duration-300 text-white placeholder-white/40"
              />
            </div>
            
            <div>
              <label className="block text-sm font-light text-white/80 mb-2">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:border-emerald-400/50 focus:bg-white/8 focus:outline-none transition-all duration-300 text-white placeholder-white/40"
              />
            </div>
            
            <div>
              <label className="block text-sm font-light text-white/80 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:border-emerald-400/50 focus:bg-white/8 focus:outline-none transition-all duration-300 text-white placeholder-white/40"
              />
            </div>
            
            <div>
              <label className="block text-sm font-light text-white/80 mb-2">Monthly Volume</label>
              <select
                name="monthlyVolume"
                value={formData.monthlyVolume}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:border-emerald-400/50 focus:bg-white/8 focus:outline-none transition-all duration-300 text-white"
              >
                <option value="" className="bg-[#4a4a4a]">Select volume</option>
                <option value="under-25" className="bg-[#4a4a4a]">Under 25lbs</option>
                <option value="25-49" className="bg-[#4a4a4a]">25–49lbs</option>
                <option value="50-99" className="bg-[#4a4a4a]">50–99lbs</option>
                <option value="100+" className="bg-[#4a4a4a]">100lbs+</option>
                <option value="200+" className="bg-[#4a4a4a]">200lbs+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-light text-white/80 mb-2">Delivery Frequency</label>
              <select
                name="deliveryFrequency"
                value={formData.deliveryFrequency}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:border-emerald-400/50 focus:bg-white/8 focus:outline-none transition-all duration-300 text-white"
              >
                <option value="" className="bg-[#4a4a4a]">Select frequency</option>
                <option value="weekly" className="bg-[#4a4a4a]">Weekly</option>
                <option value="bi-weekly" className="bg-[#4a4a4a]">Bi-weekly</option>
                <option value="monthly" className="bg-[#4a4a4a]">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-light text-white/80 mb-2">
                What should we know about your operation? (Optional)
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:border-emerald-400/50 focus:bg-white/8 focus:outline-none transition-all duration-300 text-white placeholder-white/40 resize-none"
              />
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="understood"
                checked={formData.understood}
                onChange={handleChange}
                required
                className="mt-1 w-5 h-5 bg-white/5 border border-white/20 rounded focus:ring-emerald-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent"
              />
              <label className="text-sm text-white/70 font-light">
                I understand Flora does not contact all applicants and provides no feedback.
              </label>
            </div>
            
            <button
              type="submit"
              disabled={!formData.understood}
              className={`w-full py-4 rounded-lg font-medium tracking-wide transition-all duration-300 ${
                formData.understood
                  ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:via-green-400 hover:to-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              Submit Application
            </button>
          </form>
          
          {/* Moved from value prop section to bottom */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-sm border border-white/20 py-2 px-6 rounded-lg mt-12">
            <p className="text-white font-light text-center text-xl">
              From here, you're visible.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}