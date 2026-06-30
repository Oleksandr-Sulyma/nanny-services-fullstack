type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl bg-surface p-8 text-center">
      <p className="text-lg font-medium">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-(--color-muted)">{description}</p>
      )}
    </div>
  );
}