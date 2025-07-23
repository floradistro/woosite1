import { Order } from '../types';

interface OrdersTabContentProps {
  isMobile: boolean;
  orders: Order[];
  selectedOrder: string | null;
  onOrderSelect: (orderId: string | null) => void;
  ordersLoading?: boolean;
}

export default function OrdersTabContent({ 
  isMobile, 
  orders, 
  selectedOrder, 
  onOrderSelect,
  ordersLoading = false
}: OrdersTabContentProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed': return 'text-green-600 bg-green-500/10';
      case 'shipped': return 'text-blue-600 bg-blue-500/10';
      case 'processing': return 'text-yellow-600 bg-yellow-500/10';
      case 'pending': return 'text-orange-600 bg-orange-500/10';
      case 'on-hold': return 'text-purple-600 bg-purple-500/10';
      case 'cancelled': return 'text-red-600 bg-red-500/10';
      case 'refunded': return 'text-red-600 bg-red-500/10';
      case 'failed': return 'text-red-600 bg-red-500/10';
      default: return 'text-gray-600 bg-gray-500/10';
    }
  };

  return (
    <div className={`${isMobile ? '' : ''}`}>
      {!isMobile && (
        <div className="mb-8 px-12">
          <h1 className="text-3xl font-semibold text-white mb-1">Order History</h1>
          <p className="text-white/60 text-sm">View and track your previous orders.</p>
        </div>
      )}

      <div className="space-y-4">
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Recent Orders</h2>
        </div>
        
        {ordersLoading ? (
          <div className={`text-center py-12 ${!isMobile ? 'mx-12' : ''}`}>
            <div className="text-white/50 text-lg mb-2">Loading orders...</div>
          </div>
        ) : (
          <div className={`${isMobile ? 'bg-transparent border-0 rounded-none divide-y divide-white/[0.08]' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] divide-y divide-white/[0.08] mx-12'}`}>
            {orders.map((order) => (
            <div 
              key={order.id} 
              className={`p-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                selectedOrder === order.id ? 'bg-white/[0.05]' : ''
              }`}
              onClick={() => onOrderSelect(selectedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <span className={`text-white/70 ${isMobile ? 'text-base' : 'text-sm'} font-medium`}>
                    {order.id}
                  </span>
                </div>
                <span className={`text-white ${isMobile ? 'text-base' : 'text-sm'} font-medium`}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
              
              <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mb-2`}>
                {order.date}
              </div>
              
              {selectedOrder === order.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className={`text-white/70 ${isMobile ? 'text-sm' : 'text-xs'} mb-2 font-medium`}>
                    Items:
                  </div>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className={`text-white/60 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
                      ))}
            
            {orders.length === 0 && (
              <div className={`text-center py-12 ${!isMobile ? 'mx-12' : ''}`}>
                <div className="text-white/50 text-lg mb-2">No orders yet</div>
                <div className="text-white/30 text-sm">Your order history will appear here once you make your first purchase.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 