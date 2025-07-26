import { ChevronLeft } from 'lucide-react';

interface MobileBackButtonProps {
  onBackClick: () => void;
  title?: string;
}

export default function MobileBackButton({ onBackClick, title }: MobileBackButtonProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#4a4a4a] border-b border-white/10">
      <button
        onClick={onBackClick}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      {title && (
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      )}
    </div>
  );
} 