import { User, Shield, Bell, ChevronRight, Smartphone, Mail, MapPin } from 'lucide-react';
import { ToggleStates } from '../types';
import ToggleSwitch from './ToggleSwitch';

interface SettingsTabContentProps {
  isMobile: boolean;
  toggleStates: ToggleStates;
  onToggleChange: (key: keyof ToggleStates) => void;
}

export default function SettingsTabContent({ 
  isMobile, 
  toggleStates, 
  onToggleChange 
}: SettingsTabContentProps) {

  const notificationSettings = [
    {
      key: 'orderUpdates' as keyof ToggleStates,
      label: 'Order Updates',
      description: 'Get notified about order status changes',
      icon: Bell
    },
    {
      key: 'promotions' as keyof ToggleStates,
      label: 'Promotions & Offers',
      description: 'Receive special deals and promotions',
      icon: MapPin
    },
    {
      key: 'newProducts' as keyof ToggleStates,
      label: 'New Products',
      description: 'Be the first to know about new arrivals',
      icon: Bell
    },
    {
      key: 'smsNotifications' as keyof ToggleStates,
      label: 'SMS Notifications',
      description: 'Receive text message updates',
      icon: Smartphone
    },
    {
      key: 'emailUpdates' as keyof ToggleStates,
      label: 'Email Updates',
      description: 'Get updates via email',
      icon: Mail
    }
  ];

  const deliverySettings = [
    {
      key: 'leaveAtDoor' as keyof ToggleStates,
      label: 'Leave at Door',
      description: 'Allow contactless delivery',
      icon: MapPin
    }
  ];

  const securityItems = [
    {
      id: 'password',
      label: 'Change Password',
      description: 'Update your account password',
      icon: User
    },
    {
      id: 'two-factor',
      label: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      icon: Shield
    },
    {
      id: 'login-activity',
      label: 'Login Activity',
      description: 'View recent login attempts',
      icon: Shield
    }
  ];

  return (
    <div className={`${isMobile ? '' : ''}`}>
      {!isMobile && (
        <div className="mb-8 px-12">
          <h1 className="text-3xl font-semibold text-white mb-1">Account Settings</h1>
          <p className="text-white/60 text-sm">Manage your notifications, security, and account preferences.</p>
        </div>
      )}
      
      {/* Notifications */}
      <div className="mb-8">
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Notifications</h2>
        </div>
        <div className={`${isMobile ? 'bg-transparent border-0 rounded-none divide-y divide-white/[0.08]' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] divide-y divide-white/[0.08] mx-12'}`}>
          {notificationSettings.map((setting) => {
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
          {deliverySettings.map((setting) => {
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
      <div>
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Security & Privacy</h2>
        </div>
        <div className="space-y-3">
          {securityItems.map((item) => {
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
    </div>
  );
} 