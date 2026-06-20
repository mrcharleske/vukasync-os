import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <section className={cn("ui-card", className)} {...rest}>
      {children}
    </section>
  );
}
