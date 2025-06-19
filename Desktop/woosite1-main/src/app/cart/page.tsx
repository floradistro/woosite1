"use client"

import { useCart } from '../context/CartContext';
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#4a4a4a] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h1>
          <p className="text-white/60 mb-6">Add some products to get started</p>
          <Link 
            href="/flower"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4a4a4a] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-white">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-white/60 hover:text-red-400 transition-colors text-sm"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={`${item.id}-${item.weight}`} className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-white/50" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.weight}</p>
                  <p className="text-emerald-400 font-semibold">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70">Subtotal</span>
            <span className="text-white font-semibold">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-white font-semibold text-lg">Total</span>
            <span className="text-emerald-400 font-bold text-xl">${getTotalPrice().toFixed(2)}</span>
          </div>
          
          <Link
            href="/checkout"
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
} 