"use client"

interface UrgencyBannerProps {
  timeUntilDeadline: string;
  shouldHidePopups: boolean;
}

export default function UrgencyBanner({ timeUntilDeadline, shouldHidePopups }: UrgencyBannerProps) {
  if (shouldHidePopups) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 py-2 text-center z-40">
      <p className="text-black font-medium text-sm md:text-base px-4">
        <span className="hidden md:inline">🚚 Order in {timeUntilDeadline} for same-day shipping • First order? Use code FLORA15 for 15% off</span>
        <span className="md:hidden">🚚 Same-day ship • Code: FLORA15</span>
      </p>
    </div>
  );
} 