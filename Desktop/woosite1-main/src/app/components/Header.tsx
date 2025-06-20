"use client"

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Filter, ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';


type FilterType = 'category' | 'vibe' | 'nose';

interface FilterState {
  category: string[];
  vibe: string[];
  nose: string[];
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

function HeaderContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOneClickProcessing, setIsOneClickProcessing] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedWeightSelector, setExpandedWeightSelector] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);



  // AI Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['hybrid flower', 'edibles', 'vape cartridges']);
  const searchRef = useRef<HTMLDivElement>(null);

  // Chat states
  const [chatMessages, setChatMessages] = useState<{id: number, text: string, sender: 'user' | 'bot', timestamp: Date}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Concierge Chat states
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const conciergeRef = useRef<HTMLDivElement>(null);

  // Cart state
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  // Mock saved payment methods (in real app, fetch from API based on user)
  const [savedPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      lastFour: '4242',
      expiryMonth: '12',
      expiryYear: '26',
      holderName: 'John Doe',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      lastFour: '5555',
      expiryMonth: '08',
      expiryYear: '25',
      holderName: 'John Doe',
      isDefault: false
    }
  ]);

  // Get default payment method
  const defaultPaymentMethod = savedPaymentMethods.find(method => method.isDefault);

  // Auth state
  const { user, isAuthenticated, logout } = useAuth();

  // Shop menu hover state management
  const [shopHoverTimeout, setShopHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  // Cart hover state management
  const [cartHoverTimeout, setCartHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleShopMouseEnter = useCallback(() => {
    // Clear any pending close timeout
    if (shopHoverTimeout) {
      clearTimeout(shopHoverTimeout);
      setShopHoverTimeout(null);
    }
    // Close other dropdowns
    setIsConciergeOpen(false);
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
    if (cartHoverTimeout) {
      clearTimeout(cartHoverTimeout);
      setCartHoverTimeout(null);
    }
    setIsShopMenuOpen(true);
  }, [shopHoverTimeout, cartHoverTimeout]);

  const handleShopMouseLeave = useCallback(() => {
    // Set a much longer timeout for very forgiving behavior
    const timeout = setTimeout(() => {
      setIsShopMenuOpen(false);
    }, 1200);
    setShopHoverTimeout(timeout);
  }, []);

  const handleCartMouseEnter = useCallback(() => {
    // Clear any pending close timeout
    if (cartHoverTimeout) {
      clearTimeout(cartHoverTimeout);
      setCartHoverTimeout(null);
    }
  }, [cartHoverTimeout]);

  const handleCartMouseLeave = useCallback(() => {
    // Set a longer timeout for Apple-like smooth behavior
    const timeout = setTimeout(() => {
      setIsCartOpen(false);
    }, 500);
    setCartHoverTimeout(timeout);
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (shopHoverTimeout) {
        clearTimeout(shopHoverTimeout);
      }
      if (cartHoverTimeout) {
        clearTimeout(cartHoverTimeout);
      }
    };
  }, [shopHoverTimeout, cartHoverTimeout]);

  // Function to close all modals/dropdowns
  const closeAllModals = () => {
    // Clear hover timeouts
    if (shopHoverTimeout) {
      clearTimeout(shopHoverTimeout);
      setShopHoverTimeout(null);
    }
    if (cartHoverTimeout) {
      clearTimeout(cartHoverTimeout);
      setCartHoverTimeout(null);
    }
    
    setIsShopMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowAuthModal(false);
    setIsCheckoutOpen(false);
    setOpenDropdown(null);
    setExpandedWeightSelector(null);
    setIsConciergeOpen(false);
  };

  // Check if current page is a collection page
  const isCollectionPage = pathname === '/flower' || 
                         pathname === '/vape' || 
                         pathname === '/wax' || 
                         pathname === '/edible' || 
                         pathname === '/moonwater' || 
                         pathname === '/apparel';

  // Remove blur for mobile menu
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Add blur effect to page when cart OR shop menu OR concierge OR auth modal are open (but NOT mobile menu)
  useEffect(() => {
    if (isCartOpen || isShopMenuOpen || isConciergeOpen || showAuthModal) {
      document.body.classList.add('cart-blur', 'active');
    } else {
      document.body.classList.remove('cart-blur', 'active');
    }
    return () => {
      document.body.classList.remove('cart-blur', 'active');
    };
  }, [isCartOpen, isShopMenuOpen, isConciergeOpen, showAuthModal]);

  // Close cart on outside click
  useEffect(() => {
    if (!isCartOpen || isCheckoutOpen) return; // Don't close if checkout is open
    const handleClick = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isCartOpen, isCheckoutOpen]);

  const categories = useMemo(() => [
    {
      label: "flower",
      href: "/flower",
      description: "Premium cannabis flower",
      icon: "/categories/FLOWER.png",
      subcategories: [
        { label: "indica", href: "/flower?type=indica" },
        { label: "sativa", href: "/flower?type=sativa" },
        { label: "hybrid", href: "/flower?type=hybrid" },
        { label: "premium", href: "/flower?quality=premium" },
        { label: "exotic", href: "/flower?type=exotic" }
      ]
    },
    {
      label: "pre-roll",
      href: "/flower?format=preroll",
      description: "Ready to smoke",
      icon: "/categories/PRE ROLL.png",
      subcategories: [
        { label: "indica", href: "/flower?format=preroll&type=indica" },
        { label: "sativa", href: "/flower?format=preroll&type=sativa" },
        { label: "hybrid", href: "/flower?format=preroll&type=hybrid" },
        { label: "infused", href: "/flower?format=preroll&type=infused" }
      ]
    },
    {
      label: "vape",
      href: "/vape",
      description: "Disposable & cartridges",
      icon: "/categories/VAPE.png",
      subcategories: [
        { label: "disposable", href: "/vape?type=disposable" },
        { label: "cartridge", href: "/vape?type=cartridge" },
        { label: "battery", href: "/vape?type=battery" }
      ]
    },
    {
      label: "wax",
      href: "/wax",
      description: "Concentrates & extracts",
      icon: "/categories/WAX.png",
      subcategories: [
        { label: "live resin", href: "/wax?type=live-resin" },
        { label: "shatter", href: "/wax?type=shatter" },
        { label: "budder", href: "/wax?type=budder" }
      ]
    },
    {
      label: "edible",
      href: "/edible",
      description: "Sweet hitters & treats",
      icon: "/categories/EDIBLES.png",
      subcategories: [
        { label: "gummies", href: "/edible?type=gummies" },
        { label: "chocolates", href: "/edible?type=chocolates" },
        { label: "beverages", href: "/edible?type=beverages" },
        { label: "baked", href: "/edible?type=baked" }
      ]
    },
    {
      label: "moonwater",
      href: "/moonwater",
      description: "Edibles & drinks",
      icon: "/icons/Moonwater.png",
      subcategories: [
        { label: "drinks", href: "/moonwater?type=drinks" },
        { label: "edibles", href: "/moonwater?type=edibles" }
      ]
    },
    {
      label: "apparel",
      href: "/apparel",
      description: "Flora merchandise",
      icon: "/categories/MERCH.png",
      subcategories: [
        { label: "hoodies", href: "/apparel?type=hoodies" },
        { label: "tshirts", href: "/apparel?type=tshirts" },
        { label: "accessories", href: "/apparel?type=accessories" }
      ]
    }
  ], []);

  const vibes = useMemo(() => [
    {
      label: "energize",
      href: "/shop?vibe=energize",
      description: "Fast, clear, sativa-heavy",
      icon: "/categories/ENERGIZE.png",
      subcategories: [
        { label: "sativa", href: "/shop?vibe=energize&type=sativa" },
        { label: "hybrid", href: "/shop?vibe=energize&type=hybrid" }
      ]
    },
    {
      label: "balance",
      href: "/shop?vibe=balance",
      description: "Perfect hybrid experience",
      icon: "/categories/BALANCE.png",
      subcategories: [
        { label: "hybrid", href: "/shop?vibe=balance&type=hybrid" },
        { label: "indica", href: "/shop?vibe=balance&type=indica" },
        { label: "sativa", href: "/shop?vibe=balance&type=sativa" }
      ]
    },
    {
      label: "relax",
      href: "/shop?vibe=relax",
      description: "Deep, calming effects",
      icon: "/categories/RELAX.png",
      subcategories: [
        { label: "indica", href: "/shop?vibe=relax&type=indica" },
        { label: "hybrid", href: "/shop?vibe=relax&type=hybrid" }
      ]
    }
  ], []);

  // Throttle function for better performance
  const throttle = useCallback(<T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    return function (...args: Parameters<T>) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  const toggleDropdown = (type: string) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  // Cart functions
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveFromCart = (id: number) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  // One-click checkout function
  const handleOneClickCheckout = async () => {
    if (!isAuthenticated || !defaultPaymentMethod) return;
    
    setIsOneClickProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to success page or show success message
    router.push('/checkout/success');
    setIsCartOpen(false);
    setIsOneClickProcessing(false);
  };

  // Get card icon helper
  const getCardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  // User menu click outside handling
  useEffect(() => {
    function handleUserMenuClickOutside(event: Event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener('click', handleUserMenuClickOutside);
      return () => document.removeEventListener('click', handleUserMenuClickOutside);
    }
    
    return undefined;
  }, [showUserMenu]);

  // Close search on outside click
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isSearchOpen]);

  // Auto-scroll chat messages to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // AI Search functionality
  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);
    
    if (value.length > 2) {
      setIsSearching(true);
      // Simulate API call for suggestions
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock suggestions based on search term
      const mockSuggestions = [
        `${value} flower`,
        `${value} vape`,
        `${value} edibles`,
        `best ${value}`,
        `${value} strain`
      ].slice(0, 5);
      
      setSearchSuggestions(mockSuggestions);
      setIsSearching(false);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSearchSubmit = (query: string) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(item => item !== query)].slice(0, 5);
      return updated;
    });
    
    // Navigate to search results
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  // Chat functions
  const sendChatMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(message),
        sender: 'bot' as const,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 100);
    }, 1500);
  };
  
  const getBotResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('flower') || lowerMessage.includes('strain')) {
      return "I'd be happy to help you find the perfect flower! Are you looking for something to help you relax, energize, or find balance? I can recommend strains based on your preferred effects.";
    } else if (lowerMessage.includes('vape') || lowerMessage.includes('cartridge')) {
      return "Great choice! Our vape cartridges are very popular. Are you interested in live resin, distillate, or rosin cartridges? I can help you find the perfect one for your needs.";
    } else if (lowerMessage.includes('edible')) {
      return "Edibles are perfect for longer-lasting effects! Are you new to edibles or experienced? I can recommend the right dosage and products for you.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('recommend')) {
      return "I'm here to help! I can assist with product recommendations, add items to your cart, and even help you checkout. What are you looking for today?";
    } else {
      return "Thanks for your message! I can help you find products, make recommendations, and complete your purchase. What would you like to explore today?";
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'browse-flower':
        router.push('/flower');
        setIsConciergeOpen(false);
        break;
      case 'best-sellers':
        router.push('/shop?featured=best-sellers');
        setIsConciergeOpen(false);
        break;
      case 'new-arrivals':
        router.push('/shop?featured=new-arrivals');
        setIsConciergeOpen(false);
        break;
      case 'help':
        sendChatMessage("I need help finding the right products for me");
        break;
    }
  };

  // Ensure auth modal is closed on mount
  useEffect(() => {
    setShowAuthModal(false);
  }, []);

  // Memoize header styles for better performance
  const headerStyles = useMemo(() => {
    const isTransparent = pathname === '/' && !isShopMenuOpen && !isConciergeOpen && !isCartOpen && !showUserMenu && !isMobileMenuOpen;
    const isProfilePage = pathname === '/profile' || pathname.startsWith('/profile');
    
    return {
      background: isTransparent ? 'rgba(74, 74, 74, 0.8)' : '#4a4a4a',
      boxShadow: (isTransparent || isProfilePage) ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)',
      backdropFilter: isTransparent ? 'blur(10px)' : 'none',
      borderBottom: (isTransparent || isProfilePage) ? 'none' : 'none'
    };
  }, [pathname, isShopMenuOpen, isConciergeOpen, isCartOpen, showUserMenu, isMobileMenuOpen]);

  return (
    <>
      {/* Regular Browser Mode - Show full header */}
      {(
        <header 
          className="relative top-0 left-0 right-0 z-[100] w-full"
          style={{ ...headerStyles }}
          data-header="true"
        >
          <div className="w-full flex flex-col">
            {/* Main Header Bar */}
            <div className={`w-full flex items-center justify-between px-6 gap-4`}>
              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0" onClick={() => {
                setIsMobileMenuOpen(false);
                router.push('/');
              }}>
                <Image 
                  src="/logo.png" 
                  alt="flora distro" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 md:w-9 md:h-9" 
                  priority 
                  quality={90}
                />
              </Link>

              {/* Desktop Nav Menu */}
              <nav className="hidden md:flex items-center gap-5 ml-6">
                {/* Concierge (functional) */}
                <button
                  onClick={() => {
                    // Close other dropdowns
                    setIsShopMenuOpen(false);
                    setIsCartOpen(false);
                    // Clear any pending timeouts
                    if (shopHoverTimeout) {
                      clearTimeout(shopHoverTimeout);
                      setShopHoverTimeout(null);
                    }
                    if (cartHoverTimeout) {
                      clearTimeout(cartHoverTimeout);
                      setCartHoverTimeout(null);
                    }
                    // Toggle concierge
                    setIsConciergeOpen(!isConciergeOpen);
                  }}
                  className={`flex items-center gap-2 transition-colors text-sm font-medium relative ${
                    isConciergeOpen 
                      ? 'text-emerald-400' 
                      : 'text-white/90 hover:text-white'
                  }`}
                  type="button"
                >
                  {isConciergeOpen && <span className="w-2 h-2 bg-emerald-400 rounded-full absolute -left-3"></span>}
                  Concierge
                </button>

                {/* Shop (functional dropdown) */}
                <div 
                  ref={shopMenuRef}
                  onMouseEnter={handleShopMouseEnter}
                  onMouseLeave={handleShopMouseLeave}
                  className="relative"
                >
                  <button
                    onClick={() => {
                      // Close other dropdowns
                      setIsConciergeOpen(false);
                      setIsCartOpen(false);
                      // Clear any pending timeouts
                      if (cartHoverTimeout) {
                        clearTimeout(cartHoverTimeout);
                        setCartHoverTimeout(null);
                      }
                      // Toggle shop menu
                      setIsShopMenuOpen(!isShopMenuOpen);
                    }}
                    onMouseEnter={handleShopMouseEnter}
                    className={`flex items-center gap-2 transition-colors text-sm font-medium relative ${
                      isShopMenuOpen 
                        ? 'text-emerald-400' 
                        : 'text-white/90 hover:text-white'
                    }`}
                    type="button"
                  >
                    Shop
                  </button>
                </div>
              </nav>

              {/* Right Side: Cart and User Menu */}
              <div className="hidden md:flex items-center gap-5 ml-auto">
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => {
                      // Close other dropdowns
                      setIsConciergeOpen(false);
                      setIsShopMenuOpen(false);
                      setIsCartOpen(false);
                      // Clear any pending timeouts
                      if (shopHoverTimeout) {
                        clearTimeout(shopHoverTimeout);
                        setShopHoverTimeout(null);
                      }
                      if (cartHoverTimeout) {
                        clearTimeout(cartHoverTimeout);
                        setCartHoverTimeout(null);
                      }
                      // Toggle user menu
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="relative text-white/90 hover:text-white transition-colors p-1.5 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {isAuthenticated && (
                      <span className="text-sm font-medium hidden lg:block">
                        {user?.name?.split(' ')[0] || 'Account'}
                      </span>
                    )}
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute right-0 top-full mt-2 w-48 bg-[#4a4a4a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        {isAuthenticated ? (
                          <div className="py-2">
                            <div className="px-4 py-2 border-b border-white/10">
                              <div className="text-white/90 text-sm font-medium">
                                {user?.name || 'Account'}
                              </div>
                              <div className="text-white/50 text-xs">
                                {user?.email}
                              </div>
                            </div>
                            <Link 
                              href="/profile" 
                              onClick={() => setShowUserMenu(false)}
                              className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition text-sm"
                            >
                              Profile
                            </Link>
                            <Link 
                              href="/orders" 
                              onClick={() => setShowUserMenu(false)}
                              className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition text-sm"
                            >
                              Orders
                            </Link>
                            <div className="border-t border-white/10 mt-1 pt-1">
                              <button
                                onClick={() => {
                                  logout();
                                  setShowUserMenu(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-white/50 hover:text-red-400 hover:bg-white/5 transition text-sm"
                              >
                                Sign Out
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-2">
                            <button
                              onClick={() => {
                                router.push('/auth/signin');
                                setShowUserMenu(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition text-sm"
                            >
                              Sign In
                            </button>
                            <Link 
                              href="/auth/signin" 
                              onClick={() => setShowUserMenu(false)}
                              className="block px-4 py-2 text-white/50 hover:text-white/70 hover:bg-white/5 transition text-sm"
                            >
                              Create Account
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart Icon (interactive with count and hover states) */}
                <button 
                  onClick={() => {
                    // Close other dropdowns
                    setIsConciergeOpen(false);
                    setIsShopMenuOpen(false);
                    setShowUserMenu(false);
                    // Clear any pending timeouts
                    if (shopHoverTimeout) {
                      clearTimeout(shopHoverTimeout);
                      setShopHoverTimeout(null);
                    }
                    // Toggle cart
                    setIsCartOpen(!isCartOpen);
                  }}
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                  className="relative text-white/90 hover:text-white transition-colors p-1.5"
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-colors"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-xs font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Cart and Menu */}
              <div className="md:hidden flex items-center gap-2">
                {/* Mobile Cart Icon */}
                <button 
                  onClick={() => {
                    closeAllModals();
                    setIsCartOpen(!isCartOpen);
                  }}
                  className="relative text-white/90 hover:text-white transition-colors p-2 flex items-center justify-center"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-colors"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Mobile Profile Icon */}
                <button 
                  onClick={() => {
                    closeAllModals();
                    router.push('/profile');
                  }}
                  className="text-white/90 hover:text-white transition-colors p-2 flex items-center justify-center"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-colors"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => {
                    if (isMobileMenuOpen) {
                      setIsMobileMenuOpen(false);
                    } else {
                      closeAllModals();
                      setIsMobileMenuOpen(true);
                    }
                  }}
                  className="text-white/90 hover:text-white transition-colors p-2 flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transition-colors"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transition-colors"
                    >
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Concierge Chat Interface - Integrated into Header */}
            <AnimatePresence>
              {isConciergeOpen && (
                <motion.div
                  ref={conciergeRef}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="w-full overflow-hidden"
                  style={{
                    background: '#4a4a4a',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div 
                    className="w-full flex flex-col"
                    style={{
                      height: '500px'
                    }}
                  >
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h2 className="text-lg font-bold text-white">AI Concierge</h2>
                            <p className="text-xs text-white/60">Your personal cannabis assistant</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsConciergeOpen(false)}
                          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition"
                        >
                          <span className="text-sm font-bold">✕</span>
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <div 
                        ref={chatMessagesRef}
                        className="flex-1 px-6 py-4 overflow-y-auto space-y-4"
                      >
                        {/* Welcome Message */}
                        {chatMessages.length === 0 && (
                          <div className="flex gap-3">
                            <div className="bg-white/10 rounded-lg px-4 py-3 max-w-[80%]">
                              <p className="text-white text-sm">
                                Hi! I'm your AI cannabis concierge. I can help you find the perfect products, add items to your cart, and even complete your checkout - all right here in this chat. What can I help you with today?
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Chat Messages */}
                        {chatMessages.map((message) => (
                          <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                            <div className={`rounded-lg px-4 py-3 max-w-[80%] ${
                              message.sender === 'user' 
                                ? 'bg-emerald-600 ml-auto' 
                                : 'bg-white/10'
                            }`}>
                              <p className="text-white text-sm">{message.text}</p>
                              <span className="text-white/40 text-xs mt-1 block">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {message.sender === 'user' && (
                              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 ml-2">
                                <span className="text-white font-bold text-xs">U</span>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                          <div className="flex gap-3">
                            <div className="bg-white/10 rounded-lg px-4 py-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Action Suggestions */}
                      {chatMessages.length === 0 && (
                        <div className="px-6 py-4 border-t border-white/10">
                          <p className="text-white/60 text-xs mb-3">Quick suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "I need something for relaxation",
                              "What's good for energy?", 
                              "Help me with sleep",
                              "I'm a beginner",
                              "Show me what's in my cart"
                            ].map((suggestion) => (
                              <button
                                key={suggestion}
                                onClick={() => handleQuickAction(suggestion)}
                                className="px-3 py-1.5 text-xs text-white/80 bg-white/10 hover:bg-white/20 rounded-full transition"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Chat Input */}
                      <div className="px-6 py-4 border-t border-white/10">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendChatMessage(chatInput);
                              }
                            }}
                            placeholder="Ask me anything about our products..."
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            onClick={() => sendChatMessage(chatInput)}
                            disabled={!chatInput.trim() || isTyping}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-white/10 disabled:opacity-50 text-white rounded-lg transition"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Premium Shop Menu */}
            <AnimatePresence>
              {isShopMenuOpen && (
                <motion.div
                  ref={shopMenuRef}
                  onMouseEnter={handleShopMouseEnter}
                  onMouseLeave={handleShopMouseLeave}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="w-full overflow-hidden"
                  style={{
                    background: '#4a4a4a',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="w-full max-w-7xl mx-auto px-8 py-6">
                    <div className="grid grid-cols-4 gap-16">
                      {/* Collections */}
                      <div>
                        <h3 className="text-white font-medium text-sm mb-4">Collections</h3>
                        <div className="space-y-2">
                          <Link href="/flower" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Flower
                          </Link>
                          <Link href="/flower?format=preroll" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Pre-Roll
                          </Link>
                          <Link href="/vape" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Vape
                          </Link>
                          <Link href="/wax" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Wax
                          </Link>
                          <Link href="/edible" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Edible
                          </Link>
                          <Link href="/moonwater" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Moonwater
                          </Link>
                          <Link href="/apparel" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Apparel
                          </Link>
                        </div>
                      </div>

                      {/* Subscriptions */}
                      <div>
                        <h3 className="text-white font-medium text-sm mb-4">Subscriptions</h3>
                        <div className="space-y-2">
                          <Link href="/subscriptions" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Drop Club
                          </Link>
                          <Link href="/subscriptions" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Vault Vape Club
                          </Link>
                          <Link href="/subscriptions" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Edible Essentials
                          </Link>
                          <Link href="/subscriptions" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Real Flower Club
                          </Link>
                          <Link href="/subscriptions" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Full-Spectrum Bundle
                          </Link>
                        </div>
                      </div>

                      {/* Best Sellers */}
                      <div>
                        <h3 className="text-white font-medium text-sm mb-4">Best Sellers</h3>
                        <div className="space-y-2">
                          <Link href="/shop?featured=best-sellers" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Top Flower
                          </Link>
                          <Link href="/shop?featured=best-sellers" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Popular Vapes
                          </Link>
                          <Link href="/shop?featured=best-sellers" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Trending Edibles
                          </Link>
                          <Link href="/shop?featured=best-sellers" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Customer Favorites
                          </Link>
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div>
                        <h3 className="text-white font-medium text-sm mb-4">Quick Links</h3>
                        <div className="space-y-2">
                          <Link href="/shop?featured=new-arrivals" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            New Arrivals
                          </Link>
                          <Link href="/shop?featured=deals" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Daily Deals
                          </Link>
                          <Link href="/shop?vibe=energize" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Energize
                          </Link>
                          <Link href="/shop?vibe=relax" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Relax
                          </Link>
                          <Link href="/shop?vibe=balance" onClick={() => setIsShopMenuOpen(false)} className="block text-white/70 hover:text-white transition text-sm">
                            Balance
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Premium Cart Experience */}
            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  ref={cartRef}
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="w-full overflow-hidden"
                  style={{
                    background: '#4a4a4a',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="w-full max-w-7xl mx-auto px-8 py-6">
                    {cartItemsCount === 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        <div className="md:col-span-1">
                          <h3 className="text-white font-medium text-sm mb-4">Your Cart</h3>
                          <div className="space-y-2">
                            <div className="text-white/70 text-2xl font-bold">Cart is empty</div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-1">
                          <h3 className="text-white font-medium text-sm mb-4">Quick Start</h3>
                          <div className="space-y-3">
                            <Link 
                              href="/shop" 
                              onClick={() => setIsCartOpen(false)} 
                              className="block w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40"
                            >
                              Browse Products
                            </Link>
                            <Link 
                              href="/shop?featured=best-sellers" 
                              onClick={() => setIsCartOpen(false)} 
                              className="block text-white/70 hover:text-white transition text-sm text-center py-2"
                            >
                              Best Sellers
                            </Link>
                            <Link 
                              href="/shop?featured=new-arrivals" 
                              onClick={() => setIsCartOpen(false)} 
                              className="block text-white/70 hover:text-white transition text-sm text-center py-2"
                            >
                              New Arrivals
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                        {/* Cart Items */}
                        <div className="md:col-span-2">
                          <h3 className="text-white font-medium text-sm mb-4">Cart Items ({cartItemsCount})</h3>
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="text-white text-sm">{item.title}</div>
                                  <div className="text-white/50 text-xs">{item.weight} • ${item.price}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                      className="text-white/70 hover:text-white transition text-sm"
                                    >
                                      −
                                    </button>
                                    <span className="text-white text-sm min-w-[1rem] text-center">{item.quantity}</span>
                                    <button
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                      className="text-white/70 hover:text-white transition text-sm"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="text-white/50 hover:text-red-400 transition text-sm"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Delivery Summary */}
                          <div className="mt-6 pt-4 border-t border-white/10">
                            <h4 className="text-white font-medium text-sm mb-3">Delivery Summary</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {/* Delivery Address */}
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className="flex-1">
                                  <div className="text-white font-medium">Mooresville 28117</div>
                                  <button className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
                                    Change address
                                  </button>
                                </div>
                              </div>
                              
                              {/* Delivery Speed */}
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <div className="flex-1">
                                  <div className="text-emerald-400 font-medium">Same-day delivery</div>
                                  <div className="text-white/60 text-xs">Order by 2PM</div>
                                </div>
                              </div>
                              
                              {/* Payment Method */}
                              {isAuthenticated && defaultPaymentMethod && (
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-white font-medium flex items-center gap-1">
                                      {getCardIcon(defaultPaymentMethod.type)}
                                      •••• {defaultPaymentMethod.lastFour}
                                    </div>
                                    <button className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
                                      Change payment
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-1">
                          <h3 className="text-white font-medium text-sm mb-4">Order Summary</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Subtotal</span>
                              <span className="text-white">${items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Tax</span>
                              <span className="text-white">Calculated at checkout</span>
                            </div>
                            <div className="border-t border-white/10 pt-2 mt-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-white font-medium">Total</span>
                                <span className="text-emerald-400 font-medium">${items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-1">
                          <h3 className="text-white font-medium text-sm mb-4">Actions</h3>
                          <div className="space-y-3">
                            {/* Primary Checkout Button */}
                            <button
                              onClick={() => {
                                router.push('/checkout');
                                setIsCartOpen(false);
                              }}
                              className="w-full bg-black hover:bg-gray-900 text-white text-center py-3 px-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-black/25"
                            >
                              Checkout
                            </button>
                            
                            {/* Continue Shopping Button */}
                            <Link 
                              href="/shop" 
                              onClick={() => setIsCartOpen(false)} 
                              className="block w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40"
                            >
                              Continue Shopping
                            </Link>

                            {/* Secondary Actions */}
                            <div className="pt-2 border-t border-white/10 space-y-2">
                              {isAuthenticated && defaultPaymentMethod && (
                                <button
                                  onClick={handleOneClickCheckout}
                                  disabled={isOneClickProcessing}
                                  className="block w-full text-center py-2 text-white/70 hover:text-white transition text-sm font-medium"
                                >
                                  {isOneClickProcessing ? 'Processing...' : '1-Click Checkout'}
                                </button>
                              )}
                              <button
                                onClick={handleClearCart}
                                className="block w-full text-center py-2 text-red-400 hover:text-red-300 transition text-sm font-medium"
                              >
                                Clear Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
      )}

      {/* Mobile Filters Overlay - Now used for both mobile and desktop */}
      {/* Removed mobile filter overlay popup */}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "tween",
              duration: 0.2,
              ease: "easeInOut"
            }}
            className="fixed inset-0 z-[200] md:hidden"
            style={{ 
              background: '#4a4a4a',
              willChange: 'transform'
            }}
            data-mobile-menu
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors text-3xl font-light z-10"
            >
              ✕
            </button>

            {/* Menu Content */}
            <div className="h-full overflow-y-auto pt-14 pb-6 px-8">
              <div className="max-w-md mx-auto">
                {/* Header - Removed profile button to match Apple's design */}
                <div className="mb-8">
                  <h2 className="text-4xl font-semibold text-white">Shop</h2>
                </div>

                {/* Shop Section - Always Expanded */}
                <div>
                  <div>
                    {/* Main Menu Items */}
                    <div>
                      <Link
                        href="/flower"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white/90 hover:text-white transition-colors text-2xl font-normal py-2.5"
                      >
                        Flower
                      </Link>
                      <Link
                        href="/flower?format=preroll"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white/90 hover:text-white transition-colors text-2xl font-normal py-2.5"
                      >
                        Pre Roll
                      </Link>
                      <Link
                        href="/vape"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white/90 hover:text-white transition-colors text-2xl font-normal py-2.5"
                      >
                        Vape
                      </Link>
                      <Link
                        href="/wax"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white/90 hover:text-white transition-colors text-2xl font-normal py-2.5"
                      >
                        Wax
                      </Link>
                      <Link
                        href="/edible"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white/90 hover:text-white transition-colors text-2xl font-normal py-2.5"
                      >
                        Edible
                      </Link>
                      <Link
                        href="/moonwater"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white/90 hover:text-white transition-colors text-2xl font-normal py-2.5"
                      >
                        Moonwater
                      </Link>
                      <Link
                        href="/apparel"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white/90 hover:text-white transition-colors text-2xl font-normal py-2.5"
                      >
                        Apparel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Animations for background effects */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }
        
        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter: brightness(1);
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            filter: brightness(1.5);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            transform: rotate(45deg) scale(0);
            opacity: 0;
            filter: brightness(1);
          }
          50% {
            transform: rotate(45deg) scale(1);
            opacity: 1;
            filter: brightness(2);
          }
        }
        
        @keyframes aurora {
          0%, 100% {
            transform: translateY(0) scaleY(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-10%) scaleY(1.5);
            opacity: 0.3;
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) rotate(180deg);
          }
        }
      `}</style>
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-16 bg-black/20" />}>
      <HeaderContent />
    </Suspense>
  );
}