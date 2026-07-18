import type { ReactNode } from "react";

type MasonryBoardProps = {
  children: ReactNode;
  className?: string;
};

export function MasonryBoard({ children, className = "" }: MasonryBoardProps) {
  return <div className={`masonry ${className}`}>{children}</div>;
}
