import type { ReactNode } from "react";

type SquareGridProps = {
  children: ReactNode;
  className?: string;
};

export function SquareGrid({ children, className = "" }: SquareGridProps) {
  return <div className={`square-grid ${className}`}>{children}</div>;
}
