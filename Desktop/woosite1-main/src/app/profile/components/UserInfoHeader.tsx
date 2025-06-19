import { User } from '../types';

interface UserInfoHeaderProps {
  user: User | null;
  isMobile: boolean;
}

export default function UserInfoHeader({ user, isMobile }: UserInfoHeaderProps) {
  return (
    <div className={`p-3 ${!isMobile ? 'border-b border-white/10' : ''} flex-shrink-0`}>
      <div className={`${isMobile ? 'bg-[#4a4a4a] rounded-xl p-4' : 'p-2'}`}>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center">
            <span className="text-white font-medium text-xl">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <div className="text-white text-lg font-medium">{user?.name}</div>
            <div className="text-white/50 text-sm">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 