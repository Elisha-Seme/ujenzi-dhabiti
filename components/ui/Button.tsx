import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ud-burgundy text-ud-white border border-ud-burgundy hover:bg-ud-burgundy-hover transition-colors duration-200",
  secondary:
    "bg-transparent text-ud-burgundy border border-ud-burgundy hover:bg-ud-burgundy hover:text-ud-white transition-colors duration-200",
  ghost:
    "bg-transparent text-ud-white border border-ud-white hover:bg-ud-white hover:text-ud-dark transition-colors duration-200",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-[4px] tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const classes = `${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classes}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
