export function MascotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xs rounded-lg border border-line bg-white px-4 py-3 text-sm shadow-[0_12px_30px_-24px_rgba(24,24,24,0.8)]">
      {children}
    </div>
  );
}
