export function GridSkeleton({ items = 8 }: { items?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="h-72 animate-pulse rounded-card bg-surface ring-1 ring-line" />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="h-48 animate-pulse bg-gradient-to-br from-brand/60 to-brand-accent/60" aria-hidden />;
}
