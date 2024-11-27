"use client";
import { cn } from "@/lib/utils";

export interface UiContextPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string
}

export function UiContextPanel({ className, children, ...props }: UiContextPanelProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
