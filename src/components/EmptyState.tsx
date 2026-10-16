export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface p-10 text-center text-ink-muted">
      {message}
    </div>
  );
}
