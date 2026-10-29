import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  title: string;
  short: string;
  image: string;
  icon: LucideIcon;
  slug: string;
};

export function ServiceCard({ title, short, image, icon: Icon, slug }: ServiceCardProps) {
  return (
    <article className="group hover-lift overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.07_260/0.7)] to-transparent" />
        <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-primary shadow-md">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold leading-snug">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{short}</p>
        <Link
          to="/services"
          hash={slug}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
        >
          Learn more <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
