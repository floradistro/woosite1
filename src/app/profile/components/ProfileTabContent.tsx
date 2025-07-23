import { useState } from 'react';
import { User, ChevronRight } from 'lucide-react';
import { User as UserType, EditableProfile } from '../types';
import { useProfileData } from '../hooks/useProfileData';

interface ProfileTabContentProps {
  user: UserType | null;
  isMobile: boolean;
}

export default function ProfileTabContent({ user, isMobile }: ProfileTabContentProps) {
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
      {!isMobile && (
        <div className="mb-8 px-12">
          <h1 className="text-3xl font-semibold text-white mb-1">General</h1>
          <p className="text-white/60 text-sm">Manage your overall setup and preferences for your account.</p>
        </div>
      )}

      {/* About Section */}
      <div className="mb-8">
        <div className={`${isMobile ? 'bg-transparent border-0 rounded-none' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] mx-12'}`}>
          <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/8 to-white/4 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-white ${isMobile ? 'text-base' : 'text-sm'} font-normal`}>About</div>
                <div className={`text-white/50 ${isMobile ? 'text-sm' : 'text-xs'} mt-0.5`}>{user?.name} • {user?.email}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="mb-6">
        <div className={`${isMobile ? 'px-6' : 'px-12'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium text-white mb-4`}>Personal Information</h2>
        </div>
        <div className={`${isMobile ? 'bg-transparent border-0 rounded-none divide-y divide-white/[0.08]' : 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8 rounded-lg border border-white/[0.08] divide-y divide-white/[0.08] mx-12'}`}>
          
          {/* Full Name */}
          <div className="p-4">
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
          <div className="p-4">
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
          <div className="p-4">
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
          <div className="p-4">
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
          <div className="p-4">
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
          <div className="p-4">
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
          <div className="p-4">
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
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex justify-end ${isMobile ? 'px-6' : 'px-12'}`}>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 bg-black hover:bg-gray-900 text-white ${isMobile ? 'text-base' : 'text-sm'} rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95`}
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className={`px-4 py-2 bg-white/10 hover:bg-white/20 text-white ${isMobile ? 'text-base' : 'text-sm'} rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-4 py-2 bg-black hover:bg-gray-900 text-white ${isMobile ? 'text-base' : 'text-sm'} rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95`}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 