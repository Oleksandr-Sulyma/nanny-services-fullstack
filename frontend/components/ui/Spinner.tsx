import { LoaderCircle } from "lucide-react";

type SpinnerProps = {
  label?: string;
  className?: string;
};

export default function Spinner({
  label = "Loading...",
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={`flex items-center gap-3 text-sm text-(--color-muted) ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="h-5 w-5 animate-spin text-brand" />
      <span>{label}</span>
    </div>
  );
}