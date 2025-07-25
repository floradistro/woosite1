import { Calendar, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { Subscription } from '../types';
import { useSubscriptionProducts } from '../../../hooks/useSubscriptionProducts';
import MobileBackButton from './MobileBackButton';

interface SubscriptionsTabContentProps {
  isMobile: boolean;
  activeSubscriptions: Subscription[];
  onSubscriptionAction: (action: string, subscriptionId: string) => void;
  onBackClick?: () => void;
}

export default function SubscriptionsTabContent({ 
  isMobile, 
  activeSubscriptions, 
  onSubscriptionAction,
  onBackClick
}: SubscriptionsTabContentProps) {
  const { products: availableSubscriptions, loading, error } = useSubscriptionProducts();

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-500/10';
      case 'paused': return 'text-yellow-600 bg-yellow-500/10';
      case 'cancelled': return 'text-red-600 bg-red-500/10';
      default: return 'text-gray-600 bg-gray-500/10';
    }
  };

  const formatDeliveryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotalSavings = () => {
    return activeSubscriptions.reduce((total, sub) => total + sub.savings, 0);
  };

  return (
    <div className={`${isMobile ? '' : ''}`}>
      {/* Mobile Back Button */}
      {isMobile && onBackClick && (
        <MobileBackButton onBackClick={onBackClick} title="Subscriptions" />
      )}

      {!isMobile && (
        <div className="mb-8 px-12">
          <h1 className="text-3xl font-semibold text-white mb-1">Subscriptions</h1>
          <p className="text-white/60 text-sm">Manage your recurring deliveries and subscription plans.</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Subscription Overview */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${!isMobile ? 'px-12' : ''}`}>
          <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'p-6 rounded-2xl bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 border border-white/10'} ${isMobile ? 'p-4' : ''}`}>
            <div className="text-center">
              <div className="text-3xl font-semibold text-white mb-2">
                {activeSubscriptions.length}
              </div>
              <div className={`text-white/60 ${isMobile ? 'text-base' : 'text-sm'}`}>Active Subscriptions</div>
            </div>
          </div>
          
          <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'p-6 rounded-2xl bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 border border-white/10'} ${isMobile ? 'p-4' : ''}`}>
            <div className="text-center">
              <div className="text-3xl font-semibold text-white mb-2">
                ${calculateTotalSavings().toFixed(2)}
              </div>
              <div className={`text-white/60 ${isMobile ? 'text-base' : 'text-sm'}`}>Monthly Savings</div>
            </div>
          </div>
          
          <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'p-6 rounded-2xl bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 border border-white/10'} ${isMobile ? 'p-4' : ''}`}>
            <div className="text-center">
              <div className="text-3xl font-semibold text-white mb-2">
                {activeSubscriptions.length > 0 
                  ? formatDeliveryDate(activeSubscriptions[0].nextDelivery)
                  : 'N/A'
                }
              </div>
              <div className={`text-white/60 ${isMobile ? 'text-base' : 'text-sm'}`}>Next Delivery</div>
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Your Subscriptions</h2>
        </div>
        
        <div className={`space-y-4 ${!isMobile ? 'px-12' : ''}`}>
          {activeSubscriptions.map((subscription) => {
            const Icon = subscription.icon;
            return (
              <div 
                key={subscription.id} 
                className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08]'} p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-white ${isMobile ? 'text-lg' : 'text-base'} font-semibold`}>
                          {subscription.name}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(subscription.status)}`}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </div>
                      </div>
                      <div className={`text-white/60 ${isMobile ? 'text-sm' : 'text-xs'} mb-2`}>
                        {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)} delivery
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-white ${isMobile ? 'text-lg' : 'text-base'} font-semibold`}>
                      <span className="text-green-400">$</span>{subscription.price.toFixed(2)}
                    </div>
                    <div className={`text-emerald-400 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                      Save <span className="text-green-400">$</span>{subscription.savings.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`text-white/70 ${isMobile ? 'text-sm' : 'text-xs'} mb-2 font-medium`}>
                    Included Products:
                  </div>
                  <ul className="space-y-1">
                    {subscription.products.map((product, index) => (
                      <li key={index} className={`text-white/60 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                        • {product}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className={`${isMobile ? 'text-sm' : 'text-xs'}`}>
                        Next: {formatDeliveryDate(subscription.nextDelivery)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span className={`${isMobile ? 'text-sm' : 'text-xs'}`}>
                        Since: {formatDeliveryDate(subscription.startDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSubscriptionAction('pause', subscription.id)}
                      className={`px-3 py-1.5 ${isMobile ? 'text-sm' : 'text-xs'} bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors`}
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => onSubscriptionAction('modify', subscription.id)}
                      className={`px-3 py-1.5 ${isMobile ? 'text-sm' : 'text-xs'} bg-black hover:bg-gray-900 text-white rounded-lg transition-colors`}
                    >
                      Modify
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {activeSubscriptions.length === 0 && (
          <div className={`text-center py-12 ${!isMobile ? 'mx-12' : ''}`}>
            <div className="text-white/50 text-lg mb-2">No active subscriptions</div>
            <div className="text-white/30 text-sm">Start a subscription to get regular deliveries and save money.</div>
          </div>
        )}

        {/* Available Subscription Products */}
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4 flex items-center gap-2`}>
            <ShoppingCart className="w-5 h-5" />
            Available Subscriptions
          </h2>
        </div>

        {loading && (
          <div className={`text-center py-8 ${!isMobile ? 'mx-12' : ''}`}>
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <p className="text-white/60 mt-2 text-sm">Loading available subscriptions...</p>
          </div>
        )}

        {error && (
          <div className={`text-center py-8 ${!isMobile ? 'mx-12' : ''}`}>
            <p className="text-red-400 text-sm mb-2">Error loading subscriptions: {error}</p>
          </div>
        )}

        {!loading && !error && availableSubscriptions.length > 0 && (
          <div className={`${!isMobile ? 'px-12' : ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {availableSubscriptions.map((product) => {
                const getEmojiFromName = (name: string) => {
                  const lowercaseName = name.toLowerCase();
                  if (lowercaseName.includes('flower') || lowercaseName.includes('drop')) return '🌿';
                  if (lowercaseName.includes('vape') || lowercaseName.includes('vault')) return '🔋';
                  if (lowercaseName.includes('edible') || lowercaseName.includes('gummy')) return '🍬';
                  if (lowercaseName.includes('wax') || lowercaseName.includes('concentrate')) return '🧪';
                  if (lowercaseName.includes('full') || lowercaseName.includes('spectrum')) return '🧪';
                  return '📦';
                };

                const getSubtitleFromName = (name: string) => {
                  const lowercaseName = name.toLowerCase();
                  if (lowercaseName.includes('flower')) return 'Monthly Flower Rotation';
                  if (lowercaseName.includes('vape')) return 'Monthly Disposable Drop';
                  if (lowercaseName.includes('edible')) return 'Monthly Gummy Drop';
                  if (lowercaseName.includes('wax')) return 'Monthly Concentrate Drop';
                  if (lowercaseName.includes('full')) return 'Mixed Category Subscription';
                  return 'Monthly Subscription';
                };

                // Extract features from description or use defaults
                const extractFeatures = (description: string) => {
                  const defaultFeatures = ['Premium curated products', 'Free shipping + 10% off site', 'Cancel anytime'];
                  
                  // Try to extract bullet points or numbered lists from description
                  const bulletRegex = /[•\-\*]\s*([^\n\r]+)/g;
                  const numberedRegex = /\d+[\.\)]\s*([^\n\r]+)/g;
                  
                  let features = [];
                  let match;
                  
                  while ((match = bulletRegex.exec(description)) !== null) {
                    features.push(match[1].trim());
                  }
                  
                  while ((match = numberedRegex.exec(description)) !== null) {
                    features.push(match[1].trim());
                  }
                  
                  return features.length > 0 ? features.slice(0, 3) : defaultFeatures;
                };

                const cleanDescription = product.short_description || product.description || '';
                const cleanedDesc = cleanDescription.replace(/<[^>]*>/g, '').trim();
                const features = extractFeatures(cleanedDesc);
                
                return (
                  <div
                    key={product.id}
                    className="group relative cursor-pointer bg-gradient-to-r from-white/12 to-white/8 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.08)] rounded-lg transition-all duration-200 p-1 hover:shadow-xl hover:from-white/16 hover:to-white/12 hover:border-white/30"
                  >
                    <div className="p-4">
                      {/* Header Section */}
                      <div className="flex items-start gap-3 mb-4">
                        {/* Emoji Icon */}
                        <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg backdrop-blur-sm border border-white/20">
                          {getEmojiFromName(product.name)}
                        </div>
                        
                        {/* Title and Subtitle */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-extralight text-base transition-colors duration-300 text-white/98 mb-0.5 leading-tight">
                            {product.name}
                          </h3>
                          <p className="text-xs text-white/70 font-light">{getSubtitleFromName(product.name)}</p>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-2xl font-extralight text-white/95"><span className="text-green-400">$</span>{product.price.toFixed(2)}</span>
                          <span className="text-white/60 text-xs">/mo</span>
                        </div>
                        {product.savings > 0 && (
                          <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-medium">
                            <span className="text-xs">💸</span>
                            <span>Save <span className="text-green-400">$</span>{product.savings.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-1.5 mb-4">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-emerald-400 text-xs mt-1 flex-shrink-0">•</span>
                            <span className="text-white/80 text-xs leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-1">
                          <span className="text-xs mt-0.5 flex-shrink-0">💸</span>
                          <p className="text-white/70 text-xs leading-relaxed">
                            {cleanedDesc.substring(0, 100) + (cleanedDesc.length > 100 ? '...' : '') || 'Premium monthly subscription with curated products.'}
                          </p>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">Optional add-ons available</p>
                      </div>

                      {/* Subscribe Button */}
                      <button 
                        onClick={() => window.open(`/subscriptions`, '_blank')}
                        className="w-full group relative inline-flex items-center justify-center gap-1 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg font-medium text-xs transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-0 select-none overflow-hidden"
                      >
                        <span className="relative z-10">SUBSCRIBE NOW</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && !error && availableSubscriptions.length === 0 && (
          <div className={`text-center py-8 ${!isMobile ? 'mx-12' : ''}`}>
            <div className="text-white/50 text-base mb-2">No subscription products available</div>
            <div className="text-white/30 text-sm">Check back later for new subscription options.</div>
          </div>
        )}
      </div>
    </div>
  );
} 