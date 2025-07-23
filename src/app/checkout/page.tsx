"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Lock, Truck, User, Check, Shield } from 'lucide-react';
import Image from 'next/image';

interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: ''
  });

  // Billing Information
  const [billingInfo, setBillingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    sameAsShipping: true
  });

  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    holderName: '',
    useNewCard: true,
    selectedCardId: ''
  });

  // Mock saved payment methods (in real app, fetch from API)
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

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/');
    }
  }, [items.length, router, orderPlaced]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

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

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Clear cart and show success
    clearCart();
    setOrderPlaced(true);
    setIsProcessing(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#4a4a4a] text-white">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-white mb-6">Order Confirmed</h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Thank you for your order. You'll receive a confirmation email shortly.
            </p>
            <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70">Order Total:</span>
                <span className="text-white font-medium text-xl">${total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-white/50 bg-white/5 rounded p-3">
                Order #FD-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-light rounded border border-white/20 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white">
      {/* Simple Header */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <h1 className="text-lg font-light text-white">Secure Checkout</h1>
            
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Lock className="w-3 h-3" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information */}
            <div className="bg-black/15 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-light text-lg mb-6 flex items-center">
                <User className="w-4 h-4 mr-3 text-white/70" />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">First Name</label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                      className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                      className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-black/15 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-light text-lg mb-6 flex items-center">
                <Truck className="w-4 h-4 mr-3 text-white/70" />
                Shipping Address
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Enter street address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">City</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">State</label>
                    <select
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                    >
                      <option value="" className="bg-[#2a2a2a]">Select State</option>
                      <option value="CA" className="bg-[#2a2a2a]">California</option>
                      <option value="CO" className="bg-[#2a2a2a]">Colorado</option>
                      <option value="NY" className="bg-[#2a2a2a]">New York</option>
                      <option value="FL" className="bg-[#2a2a2a]">Florida</option>
                      <option value="TX" className="bg-[#2a2a2a]">Texas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="ZIP"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-black/15 rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-light text-lg flex items-center">
                  <Lock className="w-4 h-4 mr-3 text-white/70" />
                  Payment Information
                </h3>
                <div className="flex items-center gap-1 text-xs text-white/50">
                  <Shield className="w-3 h-3" />
                  <span>Secured</span>
                </div>
              </div>
              
              {isAuthenticated && savedPaymentMethods.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm text-white/70">Saved Payment Methods</h4>
                  {savedPaymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setPaymentInfo({
                          ...paymentInfo,
                          useNewCard: false,
                          selectedCardId: method.id
                        });
                      }}
                      className={`w-full p-4 rounded border transition-all text-left ${
                        !paymentInfo.useNewCard && paymentInfo.selectedCardId === method.id
                          ? 'border-white/40 bg-white/10'
                          : 'border-white/20 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-lg">{getCardIcon(method.type)}</div>
                          <div>
                            <div className="text-white font-light">•••• •••• •••• {method.lastFour}</div>
                            <div className="text-white/50 text-sm">{method.expiryMonth}/{method.expiryYear}</div>
                          </div>
                        </div>
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded border border-white/20">Default</span>
                        )}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setPaymentInfo({...paymentInfo, useNewCard: true})}
                    className="w-full p-4 rounded border border-dashed border-white/20 text-white/70 hover:text-white hover:border-white/30 transition-all text-center"
                  >
                    + Add New Payment Method
                  </button>
                </div>
              )}
              
              {(paymentInfo.useNewCard || (!isAuthenticated || savedPaymentMethods.length === 0)) && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                        const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                        setPaymentInfo({...paymentInfo, cardNumber: formattedValue});
                      }}
                      className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Month</label>
                      <select
                        value={paymentInfo.expiryMonth}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryMonth: e.target.value})}
                        className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                      >
                        <option value="" className="bg-[#2a2a2a]">MM</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')} className="bg-[#2a2a2a]">
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Year</label>
                      <select
                        value={paymentInfo.expiryYear}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryYear: e.target.value})}
                        className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                      >
                        <option value="" className="bg-[#2a2a2a]">YY</option>
                        {Array.from({length: 10}, (_, i) => (
                          <option key={i} value={String(new Date().getFullYear() + i).slice(-2)} className="bg-[#2a2a2a]">
                            {String(new Date().getFullYear() + i).slice(-2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">CVC</label>
                      <input
                        type="text"
                        value={paymentInfo.cvc}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvc: e.target.value.replace(/[^0-9]/g, '')})}
                        className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentInfo.holderName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, holderName: e.target.value})}
                      className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="Name on card"
                    />
                  </div>
                </div>
              )}
              
              {/* Security indicators */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-6 text-xs text-white/50">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Bank Grade Security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-black/15 rounded-lg p-6 border border-white/10 sticky top-8">
              <h3 className="text-white font-light text-lg mb-6">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-black/10 rounded border border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                      <span className="text-xs text-white/70">{item.weight}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-light text-sm">{item.title}</div>
                      <div className="text-white/50 text-xs">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-white font-light">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-2 pb-4 border-b border-white/10">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-white font-light text-lg mt-4 mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-light rounded border border-emerald-600 transition-all duration-300 mb-4"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Complete Order • ${total.toFixed(2)}</span>
                  </div>
                )}
              </button>
              
              {/* Trust indicators */}
              <div className="space-y-2 text-center text-white/50 text-xs">
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3" />
                  <span>Your payment is secure & encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 