type ChipProps = {
  label: string;
  value: string | number;
};

export default function Chip({ label, value }: ChipProps) {
  return (
    <p className="min-h-10 rounded-3xl bg-background px-4 py-2 text-sm leading-6 text-[var(--color-muted)]">
      {label}: <strong className="text-foreground">{value}</strong>
    </p>
  );
}