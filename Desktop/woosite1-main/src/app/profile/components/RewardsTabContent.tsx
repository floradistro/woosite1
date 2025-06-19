import { Copy } from 'lucide-react';
import { RewardsData, AvailableReward, RewardsHistoryItem } from '../types';

interface RewardsTabContentProps {
  isMobile: boolean;
  rewardsData: RewardsData;
  availableRewards: AvailableReward[];
  rewardsHistory: RewardsHistoryItem[];
  onRewardRedeem: (rewardId: string, pointsCost: number) => void;
}

export default function RewardsTabContent({ 
  isMobile, 
  rewardsData, 
  availableRewards, 
  rewardsHistory,
  onRewardRedeem 
}: RewardsTabContentProps) {
  
  const getTierProgress = () => {
    const totalPointsNeeded = rewardsData.points + rewardsData.pointsToNextTier;
    return (rewardsData.points / totalPointsNeeded) * 100;
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(rewardsData.referralCode);
  };

  return (
    <div className={`${isMobile ? '' : ''}`}>
      {!isMobile && (
        <div className="mb-8 px-12">
          <h1 className="text-3xl font-semibold text-white mb-1">Rewards Program</h1>
          <p className="text-white/60 text-sm">Earn points on every purchase and redeem them for exclusive rewards.</p>
        </div>
      )}
      
      {/* Points Overview */}
      <div className="mb-8">
        <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] mx-12'} p-6`}>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-semibold text-white">{rewardsData.points.toLocaleString()}</div>
              <div className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'} mt-1`}>Available Points</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-white">{rewardsData.tier}</div>
              <div className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'} mt-1`}>Current Tier</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-white">{rewardsData.pointsToNextTier}</div>
              <div className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'} mt-1`}>Points to {rewardsData.nextTier}</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className={`flex justify-between ${isMobile ? 'text-base' : 'text-sm'} text-white/70 mb-2`}>
              <span>Tier Progress</span>
              <span>{getTierProgress().toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${getTierProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="mb-8">
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Available Rewards</h2>
        </div>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 ${!isMobile ? 'px-12' : ''}`}>
          {availableRewards.map((reward) => {
            const Icon = reward.icon;
            const canAfford = rewardsData.points >= reward.points;
            
            return (
              <div key={reward.id} className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08]'} p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-white ${isMobile ? 'text-base' : 'text-sm'} font-normal`}>{reward.title}</div>
                    <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mt-0.5`}>{reward.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`${isMobile ? 'text-base' : 'text-sm'} font-medium text-yellow-400`}>
                    {reward.points.toLocaleString()} pts
                  </div>
                  <button
                    onClick={() => onRewardRedeem(reward.id, reward.points)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 ${isMobile ? 'text-base' : 'text-xs'} rounded-lg font-medium transition-all duration-200 ${
                      canAfford 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white' 
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem' : 'Insufficient Points'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referral Section */}
      <div className="mb-8">
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Refer Friends</h2>
        </div>
        <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] mx-12'} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-white ${isMobile ? 'text-base' : 'text-sm'} mb-1`}>Your Referral Code</div>
              <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'}`}>Share with friends and earn bonus points</div>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-white/10 px-3 py-2 rounded-lg text-white font-mono text-sm">
                {rewardsData.referralCode}
              </code>
              <button
                onClick={copyReferralCode}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Recent Activity</h2>
        </div>
        <div className={`${isMobile ? 'bg-transparent border-0 rounded-none divide-y divide-white/[0.08]' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] divide-y divide-white/[0.08] mx-12'}`}>
          {rewardsHistory.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.type === 'earned' ? 'bg-green-500/20' :
                    item.type === 'redeemed' ? 'bg-red-500/20' :
                    'bg-yellow-500/20'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      item.type === 'earned' ? 'text-green-400' :
                      item.type === 'redeemed' ? 'text-red-400' :
                      'text-yellow-400'
                    }`} />
                  </div>
                  <div>
                    <div className={`text-white ${isMobile ? 'text-base' : 'text-sm'}`}>{item.description}</div>
                    <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mt-0.5`}>{item.date}</div>
                  </div>
                </div>
                <div className={`${isMobile ? 'text-base' : 'text-sm'} font-medium ${item.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount} pts
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 