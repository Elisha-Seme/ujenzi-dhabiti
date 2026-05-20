import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ud-burgundy text-ud-white border border-ud-burgundy hover:bg-ud-burgundy-hover transition-colors duration-200",
  secondary:
    "bg-transparent text-ud-burgundy border border-ud-burgundy hover:bg-ud-burgundy hover:text-ud-white transition-colors duration-200",
  ghost:
    "bg-transparent text-ud-white border border-ud-white hover:bg-ud-white hover:text-ud-dark transition-colors duration-200",
};

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-[4px] tracking-wide cursor-pointer";
  const classes = `${base} ${variantClasses[variant]} ${className}`;

  if (href) {
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
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
