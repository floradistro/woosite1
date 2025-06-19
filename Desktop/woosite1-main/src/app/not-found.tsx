import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-extralight text-white/20 tracking-wider animate-pulse">
            404
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-4"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-white/95 tracking-wide">
            Page Not Found
          </h2>
          <p className="text-white/70 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-lg text-white font-light tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Return Home
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link 
              href="/flower" 
              className="text-white/60 hover:text-white/90 transition-colors duration-300"
            >
              Shop Flower
            </Link>
            <span className="text-white/40">•</span>
            <Link 
              href="/vape" 
              className="text-white/60 hover:text-white/90 transition-colors duration-300"
            >
              Shop Vapes
            </Link>
            <span className="text-white/40">•</span>
            <Link 
              href="/wholesale" 
              className="text-white/60 hover:text-white/90 transition-colors duration-300"
            >
              Wholesale
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
} 