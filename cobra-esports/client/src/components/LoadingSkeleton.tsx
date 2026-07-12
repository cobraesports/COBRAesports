import { useTheme } from '../context/useTheme';

export default function LoadingSkeleton({ className = 'h-24 w-full' }: { className?: string }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`animate-pulse-slow rounded-xl ${className} ${
        isDark ? 'bg-cobra-charcoal' : 'bg-black/5'
      }`}
    />
  );
}
