import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "dark" | "outline" | "white" | "green";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}

function getButtonClassName(variant: ButtonVariant, fullWidth?: boolean, className?: string) {
  const classes = ["btn", `btn-${variant}`];

  if (fullWidth) {
    classes.push("btn-block");
  }

  if (className) {
    classes.push(className);
  }

  return classes.join(" ");
}

export function Button({ children, variant = "primary", fullWidth, className, ...props }: ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={getButtonClassName(variant, fullWidth, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ children, variant = "primary", fullWidth, className, href, ...props }: ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link className={getButtonClassName(variant, fullWidth, className)} href={href} {...props}>
      {children}
    </Link>
  );
}