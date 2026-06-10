import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  size?: "md" | "lg" | "hero";
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
    "inline-flex items-center justify-center min-h-12 py-3 rounded-[30px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
  const variantClassName =
  variant === "primary"
    ? "bg-brand text-white hover:bg-white hover:text-brand"
    : variant === "outline"
      ? "border border-white/40 bg-transparent text-white hover:bg-white hover:text-brand"
      : "border border-brand bg-transparent text-brand hover:bg-brand hover:text-white";
  const sizeClassName =
  size === "hero"
    ? "min-h-[64px] px-[50px] text-[20px] gap-[18px]"
    : size === "lg"
      ? "min-h-[48px] px-10"
      : "min-h-[48px] px-7";

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
