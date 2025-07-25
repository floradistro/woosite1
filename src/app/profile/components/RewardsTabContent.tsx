import { Copy, Gift, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { RewardsData, AvailableReward, RewardsHistoryItem } from '../types';
import MobileBackButton from './MobileBackButton';

interface RewardsTabContentProps {
  isMobile: boolean;
  rewardsData: RewardsData;
  availableRewards: AvailableReward[];
  rewardsHistory: RewardsHistoryItem[];
  onRewardRedeem: (rewardId: string, pointsCost: number) => void;
  onBackClick?: () => void;
}

export default function RewardsTabContent({ 
  isMobile, 
  rewardsData, 
  availableRewards, 
  rewardsHistory,
  onRewardRedeem,
  onBackClick
}: RewardsTabContentProps) {
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(rewardsData.referralCode);
  };

  return (
    <div className={`${isMobile ? '' : ''}`}>
      {/* Mobile Back Button */}
      {isMobile && onBackClick && (
        <MobileBackButton onBackClick={onBackClick} title="Rewards" />
      )}

      {!isMobile && (
        <div className="mb-8 px-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-1">Chips & Rewards</h1>
              <p className="text-white/60 text-sm">Earn chips on every purchase. Redeem for exclusive rewards.</p>
            </div>
            
            {/* How to Earn Chips */}
            <div className="text-center">
              <div className="text-red-400 text-xs font-medium mb-2">How to Earn</div>
              <div className="flex items-center gap-6">
                <span className="text-white/80 text-xs font-medium">$1 SPEND = 1 CHIP</span>
                <span className="text-white/80 text-xs font-medium">REFERRAL = 100 CHIPS</span>
              </div>
            </div>
            
            {/* Referral Section - Moved to top right */}
            <div className="bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] p-4">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-white font-medium text-sm mb-1">Share & Earn 100 Chips</div>
                  <div className="text-white/60 text-xs">Your friend gets 50 chips too</div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-white/10 px-3 py-2 rounded-lg text-white font-mono text-xs font-medium">
                    {rewardsData.referralCode}
                  </code>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                  >
                    <Copy className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Points Balance - Hero Section */}
      <div className="mb-8">
        <div className={`${isMobile ? 'px-6' : 'px-12'} grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-3 gap-6'}`}>
          
          {/* Left Section - Flora Chip Stats */}
          <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-xl border border-white/[0.08]'} p-6 w-full h-96 relative`}>
            {/* Playing Card Layout */}
            <div className="absolute inset-0 p-6">
              {/* Top Left Corner */}
              <div className="absolute top-4 left-4 text-center">
                <div className="text-white font-bold text-lg">4,203</div>
                <div className="text-white/50 text-xs leading-tight">Lifetime<br/>Earned</div>
              </div>
              
              {/* Top Right Corner */}
              <div className="absolute top-4 right-4 text-center">
                <div className="text-white font-bold text-lg">1,356</div>
                <div className="text-white/50 text-xs leading-tight">Total<br/>Redeemed</div>
              </div>
              
              {/* Bottom Left Corner */}
              <div className="absolute bottom-4 left-4 text-center">
                <div className="text-white font-bold text-lg">12</div>
                <div className="text-white/50 text-xs leading-tight">Rewards<br/>Claimed</div>
              </div>
              
              {/* Bottom Right Corner */}
              <div className="absolute bottom-4 right-4 text-center">
                <div className="text-white font-bold text-lg">$42.03</div>
                <div className="text-white/50 text-xs leading-tight">Total<br/>Value</div>
              </div>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Image 
                  src="/flora_chip_no_background.png" 
                  alt="Flora Chip" 
                  width={120} 
                  height={120} 
                  className="flex-shrink-0 mb-4"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">2,847</div>
                  <div className="text-white/60 text-sm mb-1">Available Chips</div>
                  <div className="text-white/40 text-xs">1 chip = $0.01 value</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle Section - Trading Chart */}
          <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-black/20 rounded-lg border border-white/10'} h-full`}>
              {/* Chart Header */}
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">CHIPS/WEEK</span>
                  <span className="text-white/40 text-xs">7D</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-sm font-mono">▲ +12.4%</span>
                </div>
              </div>
              
              {/* Price Display */}
              <div className="p-3 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-bold text-xl font-mono">1,247</span>
                  <span className="text-white/60 text-sm">chips</span>
                </div>
                <div className="text-green-400 text-xs font-mono">+142 (+12.8%) this week</div>
              </div>
              
              {/* Chart Area */}
              <div className="p-3">
                <div className="relative bg-black/40 rounded border border-white/5" style={{height: '120px'}}>
                  {/* Price Scale */}
                  <div className="absolute right-1 inset-y-0 flex flex-col justify-between text-white/40 text-xs font-mono py-2">
                    <span>100</span>
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                  </div>
                  
                  {/* Grid */}
                  <div className="absolute inset-0 p-2 pr-8">
                    {[20, 40, 60, 80, 100].map((value, i) => (
                      <div key={i} className="absolute w-full border-t border-white/[0.03]" style={{bottom: `${(value/100) * 100}%`}}></div>
                    ))}
                    {/* Vertical grid */}
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="absolute h-full border-l border-white/[0.03]" style={{left: `${(i/6) * 100}%`}}></div>
                    ))}
                  </div>
                  
                  {/* Candlesticks */}
                  <div className="absolute inset-0 flex items-end justify-between p-2 pr-8">
                    {[
                      {open: 45, high: 72, low: 42, close: 68, volume: 180},
                      {open: 68, high: 85, low: 65, close: 78, volume: 220},
                      {open: 78, high: 82, low: 58, close: 62, volume: 165},
                      {open: 62, high: 95, low: 60, close: 89, volume: 280},
                      {open: 89, high: 92, low: 70, close: 75, volume: 195},
                      {open: 0, high: 0, low: 0, close: 0, volume: 0},
                      {open: 0, high: 0, low: 0, close: 0, volume: 0}
                    ].map((candle, i) => (
                      <div key={i} className="flex flex-col items-center justify-end h-full">
                        {candle.close > 0 ? (
                          <div className="relative flex-1 flex items-end">
                            {/* High-Low Wick */}
                            <div 
                              className="absolute w-px bg-white/60 left-1/2 transform -translate-x-1/2"
                              style={{
                                height: `${((candle.high - candle.low) / 100) * 100}%`,
                                bottom: `${((candle.low - 20) / 80) * 100}%`
                              }}
                            ></div>
                            {/* Open-Close Body */}
                            <div 
                              className={`absolute w-2 left-1/2 transform -translate-x-1/2 ${
                                candle.close >= candle.open 
                                  ? 'bg-green-500' 
                                  : 'bg-red-500'
                              }`}
                              style={{
                                height: `${(Math.abs(candle.close - candle.open) / 100) * 100}%`,
                                bottom: `${((Math.min(candle.open, candle.close) - 20) / 80) * 100}%`
                              }}
                            ></div>
                          </div>
                        ) : (
                          <div className="w-2 h-px bg-white/20"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Time Scale */}
                <div className="flex justify-between mt-2 text-white/40 text-xs font-mono">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                    <span key={i} className={i < 5 ? 'text-white/60' : 'text-white/30'}>{day}</span>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-between p-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500"></div>
                    <span className="text-white/60">Bullish</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500"></div>
                    <span className="text-white/60">Bearish</span>
                  </div>
                </div>
                <span className="text-white/40 font-mono">Volume: 1,040</span>
              </div>
          </div>

          {/* Right Section - Chips Activity */}
          <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08]'}`}>
            <div className="p-4">
              <h3 className="text-white font-medium mb-3 text-sm">Chips Activity</h3>
            </div>
            <div className="divide-y divide-white/[0.08] max-h-80 overflow-y-auto">
              {[
                { id: 1, description: 'Chanel Candy - 3.5g', date: '2024-01-15', amount: 157, type: 'earned', icon: '/categories/FLOWER.png' },
                { id: 2, description: 'Redeemed 10% off coupon', date: '2024-01-10', amount: -500, type: 'redeemed', icon: '/categories/EDIBLES.png' },
                { id: 3, description: 'Pink Runtz - 1g', date: '2024-01-05', amount: 89, type: 'earned', icon: '/categories/FLOWER.png' },
                { id: 4, description: 'Moonwater Berry - 4pk', date: '2024-01-01', amount: 250, type: 'earned', icon: '/icons/Moonwater.png' }
              ].map((item) => {
                const isEarned = item.amount > 0;
                
                return (
                  <div key={item.id} className="p-3 flex items-center justify-between border-b border-white/5 last:border-b-0">
                    <div className="flex items-center gap-3 flex-1">
                      <Image 
                        src={item.icon} 
                        alt="Product" 
                        width={24} 
                        height={24} 
                        className="rounded-md flex-shrink-0"
                      />
                      <div>
                        <div className="text-white text-sm font-medium">{item.description}</div>
                        <div className="text-white/50 text-xs mt-0.5">{item.date}</div>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-semibold ${isEarned ? 'text-green-400' : 'text-red-400'}`}>
                        {isEarned ? '+' : '-'}{Math.abs(item.amount)}
                      </div>
                      <div className="text-white/40 text-xs">
                        ${(Math.abs(item.amount) * 0.01).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {rewardsHistory.length === 0 && (
                <div className="p-6 text-center">
                  <Image 
                    src="/flora_chip_no_background.png" 
                    alt="Flora Chip" 
                    width={48} 
                    height={48} 
                    className="mx-auto mb-2 opacity-20"
                  />
                  <div className="text-white/60 font-medium mb-1 text-sm">No Activity</div>
                  <div className="text-white/40 text-xs">Start shopping to earn chips!</div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Trade for Treasures - Card Deck */}
      <div className="mb-8">
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-1`}>Trade for Treasures</h2>
          <p className="text-white/60 text-sm mb-4">Available Redemptions • Changes Weekly</p>
        </div>
        
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            
                        {/* Card 1: Free Pre-roll - 50 chips */}
            <div className="group perspective-1000 cursor-pointer">
              <div className="relative w-full max-w-[180px] mx-auto h-64 transform-style-preserve-3d transition-transform duration-500 hover:rotate-y-6 hover:scale-105">
                <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-2xl border border-gray-300 p-4 backface-hidden">
                  {/* Card Corner - Top Left */}
                  <div className="absolute top-2 left-2 text-left">
                    <div className="text-green-600 font-bold text-sm">5</div>
                    <div className="text-green-600 text-xs">♠</div>
                  </div>
                  
                  {/* Card Corner - Bottom Right (rotated) */}
                  <div className="absolute bottom-2 right-2 text-right transform rotate-180">
                    <div className="text-green-600 font-bold text-sm">5</div>
                    <div className="text-green-600 text-xs">♠</div>
                  </div>
                  
                  {/* Center Content */}
                  <div className="flex flex-col items-center justify-center h-full text-center px-1">
                    <div className="text-gray-800 font-semibold text-xs mb-1">Free Pre-roll</div>
                    <div className="text-green-600 font-bold text-sm mb-2">50 chips</div>
                    <div className="text-gray-600 text-xs mb-3">$0.50 value</div>
                    <button 
                      onClick={() => onRewardRedeem('preroll-free', 50)}
                      disabled={rewardsData.points < 50}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        rewardsData.points >= 50 
                          ? 'bg-green-600 hover:bg-green-500 text-white shadow-md' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {rewardsData.points >= 50 ? 'Trade' : 'Locked'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: 10% Off Coupon - 250 chips */}
            <div className="group perspective-1000 cursor-pointer">
              <div className="relative w-full max-w-[180px] mx-auto h-64 transform-style-preserve-3d transition-transform duration-500 hover:rotate-y-6 hover:scale-105">
                <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-2xl border border-gray-300 p-4 backface-hidden">
                  {/* Card Corner - Top Left */}
                  <div className="absolute top-2 left-2 text-left">
                    <div className="text-yellow-600 font-bold text-sm">10</div>
                    <div className="text-yellow-600 text-xs">♦</div>
                  </div>
                  
                  {/* Card Corner - Bottom Right (rotated) */}
                  <div className="absolute bottom-2 right-2 text-right transform rotate-180">
                    <div className="text-yellow-600 font-bold text-sm">10</div>
                    <div className="text-yellow-600 text-xs">♦</div>
                  </div>
                  
                  {/* Center Content */}
                  <div className="flex flex-col items-center justify-center h-full text-center px-1">
                    <div className="text-gray-800 font-semibold text-xs mb-1">10% Off Coupon</div>
                    <div className="text-yellow-600 font-bold text-sm mb-2">250 chips</div>
                    <div className="text-gray-600 text-xs mb-3">$2.50 value</div>
                    <button 
                      onClick={() => onRewardRedeem('coupon-10', 250)}
                      disabled={rewardsData.points < 250}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        rewardsData.points >= 250 
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-md' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {rewardsData.points >= 250 ? 'Trade' : 'Locked'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Premium Eighth - 300 chips */}
            <div className="group perspective-1000 cursor-pointer">
              <div className="relative w-full max-w-[180px] mx-auto h-64 transform-style-preserve-3d transition-transform duration-500 hover:rotate-y-6 hover:scale-105">
                                {rewardsData.points >= 300 ? (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-2xl border border-gray-300 p-4 backface-hidden">
                    {/* Card Corner - Top Left */}
                    <div className="absolute top-2 left-2 text-left">
                      <div className="text-purple-600 font-bold text-sm">Q</div>
                      <div className="text-purple-600 text-xs">♥</div>
                    </div>
                    
                    {/* Card Corner - Bottom Right (rotated) */}
                    <div className="absolute bottom-2 right-2 text-right transform rotate-180">
                      <div className="text-purple-600 font-bold text-sm">Q</div>
                      <div className="text-purple-600 text-xs">♥</div>
                    </div>
                    
                    {/* Center Content */}
                    <div className="flex flex-col items-center justify-center h-full text-center px-1">
                      <div className="text-gray-800 font-semibold text-xs mb-1">Premium Eighth</div>
                      <div className="text-purple-600 font-bold text-sm mb-2">300 chips</div>
                      <div className="text-gray-600 text-xs mb-3">$3.00 value</div>
                      <button 
                        onClick={() => onRewardRedeem('eighth-premium', 300)}
                        disabled={rewardsData.points < 300}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                          rewardsData.points >= 300 
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {rewardsData.points >= 300 ? 'Trade' : 'Locked'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gray-800 rounded-xl shadow-2xl border border-gray-600 p-4 backface-hidden">
                    {/* Card Back Pattern */}
                    <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg opacity-80"></div>
                    <div className="absolute inset-4 border-2 border-gray-500 rounded-lg opacity-60"></div>
                    
                                         {/* Center Content */}
                     <div className="relative flex flex-col items-center justify-center h-full text-center">
                       <div className="text-gray-400 font-semibold text-sm mb-1">Mystery Card</div>
                       <div className="text-gray-500 text-xs mb-3">Unlocks at 300 chips</div>
                       <div className="bg-gray-700 px-3 py-1.5 rounded-lg text-xs text-gray-400">
                         {300 - rewardsData.points} chips to unlock
                       </div>
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card 4: Free Oz - 1500 chips */}
            <div className="group perspective-1000 cursor-pointer">
              <div className="relative w-full max-w-[180px] mx-auto h-64 transform-style-preserve-3d transition-transform duration-500 hover:rotate-y-6 hover:scale-105">
                                {rewardsData.points >= 1500 ? (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-2xl border border-gray-300 p-4 backface-hidden">
                    {/* Card Corner - Top Left */}
                    <div className="absolute top-2 left-2 text-left">
                      <div className="text-red-600 font-bold text-sm">K</div>
                      <div className="text-red-600 text-xs">♦</div>
                    </div>
                    
                    {/* Card Corner - Bottom Right (rotated) */}
                    <div className="absolute bottom-2 right-2 text-right transform rotate-180">
                      <div className="text-red-600 font-bold text-sm">K</div>
                      <div className="text-red-600 text-xs">♦</div>
                    </div>
                    
                    {/* Center Content */}
                    <div className="flex flex-col items-center justify-center h-full text-center px-1">
                      <div className="text-gray-800 font-semibold text-xs mb-1">Free Oz</div>
                      <div className="text-red-600 font-bold text-sm mb-2">1500 chips</div>
                      <div className="text-gray-600 text-xs mb-3">$15.00 value</div>
                      <button 
                        onClick={() => onRewardRedeem('free-oz', 1500)}
                        disabled={rewardsData.points < 1500}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                          rewardsData.points >= 1500 
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-md' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {rewardsData.points >= 1500 ? 'Trade' : 'Locked'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gray-800 rounded-xl shadow-2xl border border-gray-600 p-4 backface-hidden">
                    {/* Card Back Pattern */}
                    <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg opacity-80"></div>
                    <div className="absolute inset-4 border-2 border-gray-500 rounded-lg opacity-60"></div>
                    
                                         {/* Center Content */}
                     <div className="relative flex flex-col items-center justify-center h-full text-center">
                       <div className="text-gray-400 font-semibold text-sm mb-1">Mystery Card</div>
                       <div className="text-gray-500 text-xs mb-3">Unlocks at 1500 chips</div>
                       <div className="bg-gray-700 px-3 py-1.5 rounded-lg text-xs text-gray-400">
                         {1500 - rewardsData.points} chips to unlock
                       </div>
                     </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>




    </div>
  );
} 