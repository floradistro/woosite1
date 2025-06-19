'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, MapPin, Star, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const { login, signup, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Clear error when switching between login/signup
  useEffect(() => {
    setError('');
  }, [isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Please enter your full name');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
    }

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await signup(formData.email, formData.password, formData.name);
      }

      if (success) {
        // Reset form
        setFormData({
          email: '',
          password: '',
          name: '',
          confirmPassword: ''
        });
        // Redirect to home or previous page
        router.push('/');
      } else {
        setError(isLogin ? 'Invalid credentials' : 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4a4a4a] flex items-center justify-center p-4 pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Flora Distro
        </Link>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/8 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.png" 
                alt="Flora Distro" 
                width={40} 
                height={40} 
                className="mx-auto mb-3" 
                priority 
              />
            </Link>
            <h1 className="text-xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join Flora Distro'}
            </h1>
            <p className="text-white/60 text-sm">
              {isLogin 
                ? 'Sign in to access personalized delivery tracking and exclusive member benefits.' 
                : 'Create your account to unlock premium cannabis experiences.'
              }
            </p>
          </div>

          {/* Benefits Icons */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-1 mx-auto">
                <Truck className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-white/50 text-xs">Fast Delivery</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-1 mx-auto">
                <Star className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-white/50 text-xs">Member Perks</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-1 mx-auto">
                <MapPin className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-white/50 text-xs">Track Orders</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Name Field (Sign Up Only) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-colors"
                    placeholder="Your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-white/80 text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-colors"
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-2.5 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-white/10"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In & Enable Location' : 'Create Account'
              )}
            </button>

            {/* Toggle Login/Signup */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-white/80 font-medium">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </span>
              </button>
            </div>
          </form>

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/8 text-white/60">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-white/20 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-white/20 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                </svg>
                Apple
              </button>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center">
            <p className="text-white/40 text-xs">
              By continuing, you agree to our{' '}
              <Link href="/policies/terms" className="text-white/70 hover:text-white/90 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/policies/privacy" className="text-white/70 hover:text-white/90 transition-colors">
                Privacy Policy
              </Link>
              . Location data is used only for delivery estimates.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 