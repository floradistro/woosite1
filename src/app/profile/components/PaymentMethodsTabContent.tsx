import { Plus, Trash2 } from 'lucide-react';
import { PaymentMethod } from '../types';
import MobileBackButton from './MobileBackButton';

interface PaymentMethodsTabContentProps {
  isMobile: boolean;
  paymentMethods: PaymentMethod[];
  onAddCard: () => void;
  onDeleteCard: (id: string) => void;
  onSetDefault: (id: string) => void;
  onBackClick?: () => void;
}

export default function PaymentMethodsTabContent({ 
  isMobile, 
  paymentMethods, 
  onAddCard, 
  onDeleteCard, 
  onSetDefault,
  onBackClick
}: PaymentMethodsTabContentProps) {

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return (
          <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-light">VISA</span>
          </div>
        );
      case 'mastercard':
        return (
          <div className="w-8 h-6 bg-red-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-light">MC</span>
          </div>
        );
      case 'amex':
        return (
          <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-light">AMEX</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-6 bg-gray-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-light">CARD</span>
          </div>
        );
    }
  };

  return (
    <div className={`${isMobile ? '' : ''}`}>
      {/* Mobile Back Button */}
      {isMobile && onBackClick && (
        <MobileBackButton onBackClick={onBackClick} title="Payment Methods" />
      )}

      {!isMobile && (
        <div className="mb-8 px-12">
          <h1 className="text-3xl font-semibold text-white mb-1">Payment Methods</h1>
          <p className="text-white/60 text-sm">Manage your saved payment cards and billing information.</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Add New Card Button */}
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <button
            onClick={onAddCard}
            className={`flex items-center gap-3 w-full p-4 bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] transition-all duration-200 hover:scale-[1.01]`}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className={`text-white ${isMobile ? 'text-base' : 'text-sm'} font-medium`}>Add New Card</div>
              <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mt-0.5`}>Add a payment method to your account</div>
            </div>
          </button>
        </div>

        {/* Saved Cards */}
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Saved Cards</h2>
        </div>
        
        <div className={`space-y-3 ${!isMobile ? 'px-12' : ''}`}>
          {paymentMethods.map((method) => (
            <div 
              key={method.id} 
              className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08]'} p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCardIcon(method.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-white ${isMobile ? 'text-base' : 'text-sm'} font-medium`}>
                        •••• •••• •••• {method.lastFour}
                      </span>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mt-0.5`}>
                      Expires {method.expiryMonth}/{method.expiryYear} • {method.holderName}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => onSetDefault(method.id)}
                      className={`px-3 py-1.5 ${isMobile ? 'text-sm' : 'text-xs'} bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors`}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteCard(method.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {paymentMethods.length === 0 && (
          <div className={`text-center py-12 ${!isMobile ? 'mx-12' : ''}`}>
            <div className="text-white/50 text-lg mb-2">No payment methods</div>
            <div className="text-white/30 text-sm">Add a payment method to make purchases easier.</div>
          </div>
        )}
      </div>
    </div>
  );
} 