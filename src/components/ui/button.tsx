import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "sm";

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: never;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string
) {
  return cn(
    "ui-button",
    `ui-button-${variant}`,
    `ui-button-${size}`,
    className
  );
}

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    size = "md",
    variant = "primary"
  } = props;

  if ("href" in props && props.href) {
    return (
      <Link
        className={getButtonClassName(variant, size, className)}
        href={props.href}
      >
        {children}
      </Link>
    );
  }

  const { type, ...buttonProps } = props as ButtonAsButton;

  return (
    <button
      className={getButtonClassName(variant, size, className)}
      type={type ?? "button"}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
