"use client";
import { cn } from "@/lib/utils";

export interface ChatPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string
}

export function ChatPanel({ className, children, ...props }: ChatPanelProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
