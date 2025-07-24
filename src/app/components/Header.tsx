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

  // Demo payment methods (replace with real payment integration)
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
    let scrollPosition = 0;
    
    if (isMobileMenuOpen) {
      // Save current scroll position
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
      
      // Add class to identify when mobile menu is open
      document.body.classList.add('mobile-menu-open');
    } else {
      // Get the saved scroll position from the body's top style
      const bodyTop = document.body.style.top;
      const savedScrollPosition = bodyTop ? parseInt(bodyTop.replace('-', '').replace('px', '')) : 0;
      
      // Reset body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('mobile-menu-open');
      
      // Restore scroll position immediately
      if (savedScrollPosition > 0) {
        window.scrollTo(0, savedScrollPosition);
      }
      
      // Force a comprehensive layout fix after a short delay
      setTimeout(() => {
        // Dispatch resize event to recalculate sticky positions
        window.dispatchEvent(new Event('resize'));
        
        // Force filter bar recalculation
        const filterBar = document.querySelector('[data-filter-bar]');
        if (filterBar) {
          const filterBarElement = filterBar as HTMLElement;
          // Temporarily force a style recalculation
          filterBarElement.style.position = 'relative';
          filterBarElement.offsetHeight; // Force reflow
          filterBarElement.style.position = '';
        }
        
        // Additional scroll event to ensure sticky positioning is recalculated
        window.dispatchEvent(new Event('scroll'));
      }, 100);
    }
    
    return () => { 
      document.body.style.overflow = ''; 
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  // Add blur effect to page when cart OR shop menu OR concierge are open (but NOT mobile menu)
  useEffect(() => {
    if (isCartOpen || isShopMenuOpen || isConciergeOpen) {
      document.body.classList.add('cart-blur', 'active');
    } else {
      document.body.classList.remove('cart-blur', 'active');
    }
    return () => {
      document.body.classList.remove('cart-blur', 'active');
    };
  }, [isCartOpen, isShopMenuOpen, isConciergeOpen]);

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
      icon: "/icons/pre-roll.png",
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
      label: "concentrates",
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
      label: "edibles",
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
    
    // Process payment (replace with real payment integration)
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
      
      try {
        // Get real product suggestions from WooCommerce
        const { wooCommerceAPI } = await import('../../lib/woocommerce');
        const products = await wooCommerceAPI.getProducts({ 
          search: value, 
          per_page: 5,
          status: 'publish'
        });
        
        const suggestions = products.map(product => product.name);
        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error('Search suggestions error:', error);
        // Fallback to basic suggestions if API fails
        const basicSuggestions = [
          `${value} flower`,
          `${value} vape`,
          `${value} edibles`,
          `best ${value}`,
          `${value} strain`
        ].slice(0, 5);
        setSearchSuggestions(basicSuggestions);
      }
      
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

  // Chat functions - Real OpenAI integration
  const sendChatMessage = async (message: string) => {
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

    try {
      // Send to OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response');
      }

      const botResponse = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'bot' as const,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment or refresh the page.",
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handleQuickAction = (action: string) => {
    // For navigation actions, keep the same behavior
    if (action === 'browse-flower') {
      router.push('/flower');
      setIsConciergeOpen(false);
      return;
    }
    if (action === 'best-sellers') {
      router.push('/shop?featured=best-sellers');
      setIsConciergeOpen(false);
      return;
    }
    if (action === 'new-arrivals') {
      router.push('/shop?featured=new-arrivals');
      setIsConciergeOpen(false);
      return;
    }
    
    // For chat actions, send the message to the AI
    sendChatMessage(action);
  };



  // Memoize header styles for better performance
  const headerStyles = useMemo(() => {
    const isTransparent = pathname === '/' && !isShopMenuOpen && !isConciergeOpen && !isCartOpen && !showUserMenu && !isMobileMenuOpen;
    const isProfilePage = pathname === '/profile' || pathname.startsWith('/profile');
    
    return {
      background: 'transparent',
      backdropFilter: 'blur(12px) saturate(200%)',
      WebkitBackdropFilter: 'blur(12px) saturate(200%)',
      backgroundColor: 'rgba(74, 74, 74, 0.6)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    };
  }, [pathname, isShopMenuOpen, isConciergeOpen, isCartOpen, showUserMenu, isMobileMenuOpen]);

  // Helper function to determine if a nav link is active
  const isActiveLink = (href: string) => {
    if (href === '/flower?format=preroll') {
      return pathname === '/flower' && searchParams.get('format') === 'preroll';
    }
    return pathname === href;
  };

  // Helper function to get nav link classes
  const getNavLinkClasses = (href: string) => {
    const isActive = isActiveLink(href);
    return `text-xs font-normal transition-colors relative ${
      isActive 
        ? 'text-white' 
        : 'text-white/90 hover:text-white'
    }`;
  };

  return (
    <>
      {/* Regular Browser Mode - Show full header */}
      {(
        <header 
          className="fixed top-0 left-0 right-0 z-[100] w-full"
          style={{ ...headerStyles }}
          data-header="true"
        >
          <div className="w-full flex flex-col">
            {/* Main Header Bar */}
            <div className={`w-full flex items-center justify-between px-4 md:px-6 py-1 md:py-2 gap-2 md:gap-4`}>
              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0 p-1 md:p-2" onClick={() => {
                setIsMobileMenuOpen(false);
                router.push('/');
              }}>
                <Image 
                  src="/logo.png" 
                  alt="flora distro" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6 md:w-6 md:h-6" 
                  priority 
                  quality={90}
                />
              </Link>

              {/* Desktop Nav Menu */}
              <nav className="hidden md:flex items-center gap-6 ml-6">
                <Link
                  href="/flower"
                  className={getNavLinkClasses('/flower')}
                >
                  Flower
                  {isActiveLink('/flower') && !searchParams.get('format') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
                <Link
                  href="/flower?format=preroll"
                  className={getNavLinkClasses('/flower?format=preroll')}
                >
                  Pre-Roll
                  {isActiveLink('/flower?format=preroll') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
                <Link
                  href="/vape"
                  className={getNavLinkClasses('/vape')}
                >
                  Vape
                  {isActiveLink('/vape') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
                <Link
                  href="/wax"
                  className={getNavLinkClasses('/wax')}
                >
                  Concentrates
                  {isActiveLink('/wax') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
                <Link
                  href="/edible"
                  className={getNavLinkClasses('/edible')}
                >
                  Edible
                  {isActiveLink('/edible') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
                <Link
                  href="/moonwater"
                  className={getNavLinkClasses('/moonwater')}
                >
                  Moonwater
                  {isActiveLink('/moonwater') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
                <Link
                  href="/apparel"
                  className={getNavLinkClasses('/apparel')}
                >
                  Apparel
                  {isActiveLink('/apparel') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
                
                {/* Concierge */}
                <button
                  onClick={() => {
                    // Close other dropdowns
                    setIsCartOpen(false);
                    // Clear any pending timeouts
                    if (cartHoverTimeout) {
                      clearTimeout(cartHoverTimeout);
                      setCartHoverTimeout(null);
                    }
                    // Toggle concierge
                    setIsConciergeOpen(!isConciergeOpen);
                  }}
                  className={`flex items-center gap-2 transition-colors text-xs font-normal relative ${
                    isConciergeOpen 
                      ? 'text-emerald-400' 
                      : 'text-white/90 hover:text-white'
                  }`}
                  type="button"
                >
                  {isConciergeOpen && <span className="w-2 h-2 bg-emerald-400 rounded-full absolute -left-3"></span>}
                  Concierge
                </button>
              </nav>

              {/* Right Side: Cart */}
              <div className="hidden md:flex items-center gap-5 ml-auto">
                {/* Cart Icon (functional dropdown) */}
                <div 
                  ref={cartRef}
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                  className="relative"
                >
                  <button
                    onClick={() => {
                      // Close other dropdowns
                      setIsConciergeOpen(false);
                      setIsShopMenuOpen(false);
                      // Clear any pending timeouts
                      if (shopHoverTimeout) {
                        clearTimeout(shopHoverTimeout);
                        setShopHoverTimeout(null);
                      }
                      // Toggle cart
                      setIsCartOpen(!isCartOpen);
                    }}
                    onMouseEnter={handleCartMouseEnter}
                    className="relative text-white/90 hover:text-white transition-colors p-1"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transition-colors"
                    >
                      <path d="M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"></path>
                      <path d="M9 9V7a3 3 0 0 1 6 0v2"></path>
                    </svg>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 text-white text-xs font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Cart and Menu */}
              <div className="md:hidden flex items-center gap-1">
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
                    <path d="M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"></path>
                    <path d="M9 9V7a3 3 0 0 1 6 0v2"></path>
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
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
                              <p className="text-white text-sm whitespace-pre-wrap">{message.text}</p>
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
                            <div className="text-white/70 text-sm">Cart is empty</div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-1">
                          <h3 className="text-white font-medium text-sm mb-4">Quick Start</h3>
                          <div className="space-y-2">
                            <Link 
                              href="/shop" 
                              onClick={() => setIsCartOpen(false)} 
                              className="block text-white/70 hover:text-white transition text-sm"
                            >
                              Browse Products
                            </Link>
                            <Link 
                              href="/shop?featured=best-sellers" 
                              onClick={() => setIsCartOpen(false)} 
                              className="block text-white/70 hover:text-white transition text-sm"
                            >
                              Best Sellers
                            </Link>
                            <Link 
                              href="/shop?featured=new-arrivals" 
                              onClick={() => setIsCartOpen(false)} 
                              className="block text-white/70 hover:text-white transition text-sm"
                            >
                              New Arrivals
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
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
                                      className="text-white/70 hover:text-white transition text-sm w-5 h-5 flex items-center justify-center"
                                    >
                                      −
                                    </button>
                                    <span className="text-white text-sm min-w-[1rem] text-center">{item.quantity}</span>
                                    <button
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                      className="text-white/70 hover:text-white transition text-sm w-5 h-5 flex items-center justify-center"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="text-white/50 hover:text-red-400 transition text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
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
                              <span className="text-white text-xs">Calculated at checkout</span>
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
                          <div className="space-y-2">
                            {/* Primary Checkout Link */}
                            <Link
                              href="/checkout"
                              onClick={() => setIsCartOpen(false)}
                              className="block bg-black hover:bg-gray-900 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-all"
                            >
                              Checkout
                            </Link>
                            
                            {/* Continue Shopping Link */}
                            <Link 
                              href="/shop" 
                              onClick={() => setIsCartOpen(false)} 
                              className="block text-white/70 hover:text-white transition text-sm"
                            >
                              Continue Shopping
                            </Link>

                            {/* Secondary Actions */}
                            {isAuthenticated && defaultPaymentMethod && (
                              <button
                                onClick={handleOneClickCheckout}
                                disabled={isOneClickProcessing}
                                className="block text-white/70 hover:text-white transition text-sm"
                              >
                                {isOneClickProcessing ? 'Processing...' : '1-Click Checkout'}
                              </button>
                            )}
                            <button
                              onClick={handleClearCart}
                              className="block text-white/50 hover:text-red-400 transition text-sm"
                            >
                              Clear Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* User Account Section - Always visible at bottom */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
                        <div className="md:col-span-4">
                          <h3 className="text-white font-medium text-sm mb-4">Account</h3>
                          <div className="flex items-center gap-6">
                            {isAuthenticated ? (
                              <>
                                <div className="text-white/70 text-sm">
                                  {user?.name || 'Account'}
                                </div>
                                <Link 
                                  href="/profile" 
                                  onClick={() => setIsCartOpen(false)}
                                  className="text-white/70 hover:text-white transition text-sm"
                                >
                                  Profile
                                </Link>
                                <Link 
                                  href="/orders" 
                                  onClick={() => setIsCartOpen(false)}
                                  className="text-white/70 hover:text-white transition text-sm"
                                >
                                  Orders
                                </Link>
                                <button
                                  onClick={() => {
                                    logout();
                                    setIsCartOpen(false);
                                  }}
                                  className="text-white/50 hover:text-red-400 transition text-sm"
                                >
                                  Sign Out
                                </button>
                              </>
                            ) : (
                              <>
                                <Link
                                  href="/auth/signin"
                                  onClick={() => setIsCartOpen(false)}
                                  className="text-white/70 hover:text-white transition text-sm"
                                >
                                  Sign In
                                </Link>
                                <Link 
                                  href="/auth/signin" 
                                  onClick={() => setIsCartOpen(false)}
                                  className="text-white/50 hover:text-white/70 transition text-sm"
                                >
                                  Create Account
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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
                        className={`block transition-colors text-2xl font-normal py-2.5 relative pl-4 ${
                          isActiveLink('/flower') && !searchParams.get('format')
                            ? 'text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        Flower
                        {isActiveLink('/flower') && !searchParams.get('format') && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
                      </Link>
                      <Link
                        href="/flower?format=preroll"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block transition-colors text-2xl font-normal py-2.5 relative pl-4 ${
                          isActiveLink('/flower?format=preroll')
                            ? 'text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        Pre Roll
                        {isActiveLink('/flower?format=preroll') && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
                      </Link>
                      <Link
                        href="/vape"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block transition-colors text-2xl font-normal py-2.5 relative pl-4 ${
                          isActiveLink('/vape')
                            ? 'text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        Vape
                        {isActiveLink('/vape') && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
                      </Link>
                      <Link
                        href="/wax"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block transition-colors text-2xl font-normal py-2.5 relative pl-4 ${
                          isActiveLink('/wax')
                            ? 'text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        Concentrates
                        {isActiveLink('/wax') && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
                      </Link>
                      <Link
                        href="/edible"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block transition-colors text-2xl font-normal py-2.5 relative pl-4 ${
                          isActiveLink('/edible')
                            ? 'text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        Edibles
                        {isActiveLink('/edible') && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
                      </Link>
                      <Link
                        href="/moonwater"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block transition-colors text-2xl font-normal py-2.5 relative pl-4 ${
                          isActiveLink('/moonwater')
                            ? 'text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        Moonwater
                        {isActiveLink('/moonwater') && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
                      </Link>
                      <Link
                        href="/apparel"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block transition-colors text-2xl font-normal py-2.5 relative pl-4 ${
                          isActiveLink('/apparel')
                            ? 'text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        Apparel
                        {isActiveLink('/apparel') && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
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