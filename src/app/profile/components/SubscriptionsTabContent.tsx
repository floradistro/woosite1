import { Calendar, DollarSign, Package } from 'lucide-react';
import { Subscription } from '../types';

interface SubscriptionsTabContentProps {
  isMobile: boolean;
  activeSubscriptions: Subscription[];
  onSubscriptionAction: (action: string, subscriptionId: string) => void;
}

export default function SubscriptionsTabContent({ 
  isMobile, 
  activeSubscriptions, 
  onSubscriptionAction 
}: SubscriptionsTabContentProps) {

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
                      ${subscription.price.toFixed(2)}
                    </div>
                    <div className={`text-emerald-400 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                      Save ${subscription.savings.toFixed(2)}
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
      </div>
    </div>
  );
} 