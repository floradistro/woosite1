export function ProfileLoadingState() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span className="text-white/60">Loading profile...</span>
      </div>
    </div>
  );
}

export function AuthRequiredState() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <div>
          <div className="text-white/90 text-lg font-medium mb-1">Authentication Required</div>
          <div className="text-white/60 text-sm">Redirecting to sign in...</div>
        </div>
      </div>
    </div>
  );
}

export function SuspenseLoadingState() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span className="text-white/60">Loading profile...</span>
      </div>
    </div>
  );
} 