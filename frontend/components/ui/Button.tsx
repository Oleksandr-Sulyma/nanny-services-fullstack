import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  size?: "md" | "lg";
  disabled?: boolean;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  size = "lg",
  disabled = false,
}: ButtonProps) {
  const baseClassName =
    "inline-flex items-center justify-center min-h-12 py-3 rounded-[30px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const variantClassName =
    variant === "primary"
      ? "bg-brand text-white"
      : variant === "outline"
        ? "border border-white text-white"
        : "border border-brand bg-transparent text-brand hover:opacity-80";
  const sizeClassName = size === "lg" ? "px-10" : "px-7";

  return (
    <button
      type={type}
      className={`${baseClassName} ${variantClassName} ${sizeClassName} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
