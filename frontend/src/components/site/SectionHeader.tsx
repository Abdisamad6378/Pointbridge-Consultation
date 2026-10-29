import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  theme?: "default" | "light";
  children?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "default",
  children,
}: SectionHeaderProps) {
  const centered = align === "center";
  const isLight = theme === "light";

  return (
    <div
      className={cn(
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        children && "flex flex-wrap items-end justify-between gap-4",
      )}
    >
      <div className={centered && !children ? "" : "flex-1"}>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
        )}
        <h2
          className={cn(
            "mt-3 text-3xl font-bold tracking-tight md:text-4xl",
            isLight ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 leading-relaxed",
              centered && "mx-auto",
              isLight ? "text-white/85" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
