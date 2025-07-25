import { useState } from 'react';
import { User, ChevronRight, Coins, Shield, Bell, Smartphone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import { User as UserType, EditableProfile, ToggleStates } from '../types';
import { useProfileData } from '../hooks/useProfileData';
import ToggleSwitch from './ToggleSwitch';
import MobileBackButton from './MobileBackButton';

interface ProfileTabContentProps {
  user: UserType | null;
  isMobile: boolean;
  onTabChange?: (tab: string) => void;
  onBackClick?: () => void;
  toggleStates?: ToggleStates;
  onToggleChange?: (key: keyof ToggleStates) => void;
}

export default function ProfileTabContent({ user, isMobile, onTabChange, onBackClick, toggleStates, onToggleChange }: ProfileTabContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<EditableProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [useAsShippingAddress, setUseAsShippingAddress] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const { updateProfile, profileLoading } = useProfileData();

  const handleSave = async () => {
    try {
      const success = await updateProfile(editedProfile);
      if (success) {
        setIsEditing(false);
        // Profile updated successfully
      } else {
        // Handle error - could show toast notification
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedProfile({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className={`${isMobile ? '' : ''}`}>
      {/* Mobile Back Button */}
      {isMobile && onBackClick && (
        <MobileBackButton onBackClick={onBackClick} title="General" />
      )}

      {!isMobile && (
        <div className="mb-8 px-12">
          <h1 className="text-3xl font-semibold text-white mb-1">General</h1>
          <p className="text-white/60 text-sm">Manage your profile, notifications, delivery preferences, and account settings.</p>
        </div>
      )}

      {/* Mobile Flora Chip Section - Very Top */}
      {isMobile && (
        <div className="px-6 py-4 bg-gradient-to-br from-white/8 to-white/4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Image 
              src="/flora_chip_no_background.png" 
              alt="Flora Chip" 
              width={64}
              height={64}
              className="w-16 h-16 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-white mb-0.5">Flora Chip</div>
              <div className="text-2xl font-bold text-emerald-400 mb-0.5">2,847</div>
              <div className="text-xs text-white/70">Available Chips</div>
            </div>
            <button
              onClick={() => onTabChange?.('rewards')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 flex-shrink-0"
            >
              Earn Chips
            </button>
          </div>
        </div>
      )}

      {/* Mobile Flora Rewards Grid - Under Flora Chip */}
      {isMobile && (
        <div className="px-2 py-2 border-b border-white/10">
          <div className="grid grid-cols-4 gap-1">
            {/* Lifetime Earned */}
            <div className="bg-gradient-to-br from-white/12 to-white/6 rounded border border-white/20 px-1 py-1.5 text-center hover:from-white/16 hover:to-white/10 transition-all duration-200">
              <div className="text-xs font-bold text-white mb-0.5">4,203</div>
              <div className="text-[9px] text-white/70 leading-tight">
                Lifetime<br />Earned
              </div>
            </div>
            
            {/* Total Redeemed */}
            <div className="bg-gradient-to-br from-white/12 to-white/6 rounded border border-white/20 px-1 py-1.5 text-center hover:from-white/16 hover:to-white/10 transition-all duration-200">
              <div className="text-xs font-bold text-white mb-0.5">1,356</div>
              <div className="text-[9px] text-white/70 leading-tight">
                Total<br />Redeemed
              </div>
            </div>
            
            {/* Rewards Claimed */}
            <div className="bg-gradient-to-br from-white/12 to-white/6 rounded border border-white/20 px-1 py-1.5 text-center hover:from-white/16 hover:to-white/10 transition-all duration-200">
              <div className="text-xs font-bold text-white mb-0.5">12</div>
              <div className="text-[9px] text-white/70 leading-tight">
                Rewards<br />Claimed
              </div>
            </div>
            
            {/* Total Value */}
            <div className="bg-gradient-to-br from-white/12 to-white/6 rounded border border-white/20 px-1 py-1.5 text-center hover:from-white/16 hover:to-white/10 transition-all duration-200">
              <div className="text-xs font-bold text-green-400 mb-0.5">$42.03</div>
              <div className="text-[9px] text-white/70 leading-tight">
                Total<br />Value
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-2 gap-8 px-12'} mb-6`}>
        
        {/* Left Column - Personal Information */}
        <div className="h-fit">
          <div className={`${isMobile ? 'px-6' : ''} flex items-center justify-between mb-3`}>
            <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white`}>Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`px-3 py-1.5 bg-black hover:bg-gray-900 text-white ${isMobile ? 'text-sm' : 'text-xs'} rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95`}
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className={`px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white ${isMobile ? 'text-sm' : 'text-xs'} rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`px-3 py-1.5 bg-black hover:bg-gray-900 text-white ${isMobile ? 'text-sm' : 'text-xs'} rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95`}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          <div className={`${isMobile ? 'bg-transparent border-0 rounded-none divide-y divide-white/[0.08]' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] divide-y divide-white/[0.08]'} h-[380px] overflow-y-auto`}>
          
          {/* Full Name */}
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="text-right bg-[#3a3a3a]/50 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                />
              ) : (
                <span className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'}`}>{user?.name || 'Not provided'}</span>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="text-right bg-[#3a3a3a]/50 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                />
              ) : (
                <span className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'}`}>{user?.email || 'Not provided'}</span>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="text-right bg-[#3a3a3a]/50 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                />
              ) : (
                <span className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'}`}>{editedProfile.phone || 'Not provided'}</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street"
                  className="text-right bg-[#3a3a3a]/50 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                />
              ) : (
                <span className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'}`}>{editedProfile.address || 'Not provided'}</span>
              )}
            </div>
          </div>

          {/* City */}
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.city}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="San Francisco"
                  className="text-right bg-[#3a3a3a]/50 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                />
              ) : (
                <span className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'}`}>{editedProfile.city || 'Not provided'}</span>
              )}
            </div>
          </div>

          {/* State */}
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>State</label>
              {isEditing ? (
                <select
                  value={editedProfile.state}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, state: e.target.value }))}
                  className="text-right bg-[#3a3a3a]/50 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 appearance-none cursor-pointer"
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              ) : (
                <span className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'}`}>{editedProfile.state || 'Not provided'}</span>
              )}
            </div>
          </div>

          {/* Zip Code */}
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>Zip Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.zipCode}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="94102"
                  className="text-right bg-[#3a3a3a]/50 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                />
              ) : (
                <span className={`text-white/50 ${isMobile ? 'text-base' : 'text-sm'}`}>{editedProfile.zipCode || 'Not provided'}</span>
              )}
            </div>
            </div>

            {/* Shipping Address Checkbox */}
            {isEditing && (
              <div className="px-4 py-3 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useAsShippingAddress}
                    onChange={(e) => setUseAsShippingAddress(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 bg-[#3a3a3a]/50 border-white/20 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <div>
                    <div className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'} font-medium`}>
                      Use as shipping address
                    </div>
                    <div className={`text-white/60 ${isMobile ? 'text-sm' : 'text-xs'} mt-1`}>
                      This address will be used for order deliveries and shipping calculations
                    </div>
                  </div>
                </label>

                {/* Separate Shipping Address Fields */}
                {!useAsShippingAddress && (
                  <div className="mt-4 space-y-3">
                    <div className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'} font-medium mb-2`}>
                      Shipping Address
                    </div>
                    
                    {/* Shipping Address */}
                    <div className="flex items-center justify-between">
                      <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>Address</label>
                      <input
                        type="text"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="123 Main Street"
                        className="text-right bg-[#3a3a3a]/50 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                      />
                    </div>

                    {/* Shipping City */}
                    <div className="flex items-center justify-between">
                      <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="San Francisco"
                        className="text-right bg-[#3a3a3a]/50 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                      />
                    </div>

                    {/* Shipping State */}
                    <div className="flex items-center justify-between">
                      <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>State</label>
                      <select
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="text-right bg-[#3a3a3a]/50 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 appearance-none cursor-pointer"
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                      </select>
                    </div>

                    {/* Shipping Zip Code */}
                    <div className="flex items-center justify-between">
                      <label className={`text-white/90 ${isMobile ? 'text-base' : 'text-sm'}`}>Zip Code</label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="94102"
                        className="text-right bg-[#3a3a3a]/50 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] rounded px-2 py-1 w-48"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Points & Rewards - Desktop Only */}
        {!isMobile && (
          <div className="h-fit">
            <div className="mb-3">
              <h2 className="text-lg font-medium text-white">Flora Rewards</h2>
            </div>
            <div className="bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] p-4 h-[380px] flex flex-col">
              
              {/* Points Grid - Playing Card Style */}
              <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
                {/* Lifetime Earned */}
                <div className="bg-gradient-to-br from-white/12 to-white/6 rounded-xl border border-white/20 p-3 text-center hover:from-white/16 hover:to-white/10 transition-all duration-200 flex flex-col justify-center">
                  <div className="text-xl font-bold text-white mb-1">4,203</div>
                  <div className="text-xs text-white/70 leading-tight">
                    Lifetime<br />Earned
                  </div>
                </div>
                
                {/* Total Redeemed */}
                <div className="bg-gradient-to-br from-white/12 to-white/6 rounded-xl border border-white/20 p-3 text-center hover:from-white/16 hover:to-white/10 transition-all duration-200 flex flex-col justify-center">
                  <div className="text-xl font-bold text-white mb-1">1,356</div>
                  <div className="text-xs text-white/70 leading-tight">
                    Total<br />Redeemed
                  </div>
                </div>
                
                {/* Rewards Claimed */}
                <div className="bg-gradient-to-br from-white/12 to-white/6 rounded-xl border border-white/20 p-3 text-center hover:from-white/16 hover:to-white/10 transition-all duration-200 flex flex-col justify-center">
                  <div className="text-xl font-bold text-white mb-1">12</div>
                  <div className="text-xs text-white/70 leading-tight">
                    Rewards<br />Claimed
                  </div>
                </div>
                
                {/* Total Value */}
                <div className="bg-gradient-to-br from-white/12 to-white/6 rounded-xl border border-white/20 p-3 text-center hover:from-white/16 hover:to-white/10 transition-all duration-200 flex flex-col justify-center">
                  <div className="text-xl font-bold text-green-400 mb-1">$42.03</div>
                  <div className="text-xs text-white/70 leading-tight">
                    Total<br />Value
                  </div>
                </div>
              </div>

              {/* Flora Chip Section - Desktop Only */}
              <div className="border-t border-white/10 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/flora_chip_no_background.png" 
                    alt="Flora Chip" 
                    width={64}
                    height={64}
                    className="w-16 h-16 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-0.5">Flora Chip</div>
                    <div className="text-2xl font-bold text-emerald-400 mb-0.5">2,847</div>
                    <div className="text-xs text-white/70">Available Chips</div>
                  </div>
                  <button
                    onClick={() => onTabChange?.('rewards')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 flex-shrink-0"
                  >
                    Earn Chips
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Sections */}
      {toggleStates && onToggleChange && (
        <>
          {/* Notifications */}
          <div className="mb-8">
            <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
              <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Notifications</h2>
            </div>
            <div className={`${isMobile ? 'bg-transparent border-0 rounded-none divide-y divide-white/[0.08]' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] divide-y divide-white/[0.08] mx-12'}`}>
              {[
                { key: 'orderUpdates' as keyof ToggleStates, label: 'Order Updates', description: 'Get notified about order status changes', icon: Bell },
                { key: 'promotions' as keyof ToggleStates, label: 'Promotions & Offers', description: 'Receive special deals and promotions', icon: MapPin },
                { key: 'newProducts' as keyof ToggleStates, label: 'New Products', description: 'Be the first to know about new arrivals', icon: Bell },
                { key: 'smsNotifications' as keyof ToggleStates, label: 'SMS Notifications', description: 'Receive text message updates', icon: Smartphone },
                { key: 'emailUpdates' as keyof ToggleStates, label: 'Email Updates', description: 'Get updates via email', icon: Mail }
              ].map((setting) => {
                const Icon = setting.icon;
                return (
                  <div key={setting.key} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/8 to-white/4 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className={`text-white ${isMobile ? 'text-base' : 'text-sm'}`}>{setting.label}</div>
                          <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mt-0.5`}>{setting.description}</div>
                        </div>
                      </div>
                      <ToggleSwitch 
                        isOn={toggleStates[setting.key]} 
                        onToggle={() => onToggleChange(setting.key)} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Preferences */}
          <div className="mb-8">
            <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
              <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Delivery Preferences</h2>
            </div>
            <div className={`${isMobile ? 'bg-transparent border-0 rounded-none divide-y divide-white/[0.08]' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] divide-y divide-white/[0.08] mx-12'}`}>
              {[
                { key: 'leaveAtDoor' as keyof ToggleStates, label: 'Leave at Door', description: 'Allow contactless delivery', icon: MapPin }
              ].map((setting) => {
                const Icon = setting.icon;
                return (
                  <div key={setting.key} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/8 to-white/4 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className={`text-white ${isMobile ? 'text-base' : 'text-sm'}`}>{setting.label}</div>
                          <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mt-0.5`}>{setting.description}</div>
                        </div>
                      </div>
                      <ToggleSwitch 
                        isOn={toggleStates[setting.key]} 
                        onToggle={() => onToggleChange(setting.key)} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="mb-8">
            <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
              <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Security & Privacy</h2>
            </div>
            <div className="space-y-3">
              {[
                { id: 'password', label: 'Change Password', description: 'Update your account password', icon: User },
                { id: 'two-factor', label: 'Two-Factor Authentication', description: 'Add an extra layer of security', icon: Shield },
                { id: 'login-activity', label: 'Login Activity', description: 'View recent login attempts', icon: Shield }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] mx-12'} p-4 hover:bg-white/[0.02] transition-colors cursor-pointer`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/8 to-white/4 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className={`text-white ${isMobile ? 'text-base' : 'text-sm'}`}>{item.label}</div>
                          <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mt-0.5`}>{item.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
} 