type ProfileFieldProps = {
  label: string;
  value?: string | number | null;
  className?: string;
};

export default function ProfileField({
  label,
  value,
  className = "",
}: ProfileFieldProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-sm text-(--color-muted)">{label}</p>
      <p className="mt-1 whitespace-pre-wrap wrap-break-word font-medium">
        {value || "Not specified"}
      </p>
    </div>
  );
}
