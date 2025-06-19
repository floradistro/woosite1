import { Home, Video, User, ShoppingBag, Bell } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/', icon: <Home size={24} />, label: 'Home' },
  { href: '/video', icon: <Video size={24} />, label: 'Video' },
  { href: '/friends', icon: <User size={24} />, label: 'Friends', badge: 1 },
  { href: '/marketplace', icon: <ShoppingBag size={24} />, label: 'Marketplace' },
  { href: '/notifications', icon: <Bell size={24} />, label: 'Notifications' },
];

export default function BottomNav() {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex justify-around items-center h-[83px] px-2">
        {navItems.map(({ href, icon, label, badge }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center justify-center relative text-gray-700 hover:text-black active:scale-95 transition-all duration-200 min-w-[44px] min-h-[44px] py-2"
          >
            <div className="relative">
              {icon}
              {badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
