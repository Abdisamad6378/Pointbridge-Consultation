import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ContentCardProps = {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  href?: string;
  cta?: string;
  layout?: "vertical" | "horizontal";
};

export function ContentCard({
  image,
  category,
  title,
  excerpt,
  date,
  readTime = "3 min read",
  href = "/blog",
  cta = "Read story",
  layout = "vertical",
}: ContentCardProps) {
  const meta = (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Badge variant="secondary" className="rounded-sm px-2 py-0 text-[10px] font-semibold uppercase">
        {category}
      </Badge>
      <time dateTime={date}>
        {new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
      </time>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {readTime}
      </span>
    </div>
  );

  if (layout === "horizontal") {
    return (
      <article className="group hover-lift overflow-hidden rounded-xl border border-border bg-card hover:border-primary/20">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-44 md:w-52">
            <img
              src={image}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            {meta}
            <h3 className="mt-2 font-bold leading-snug group-hover:text-primary transition-colors">{title}</h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground leading-relaxed">{excerpt}</p>
            <Link
              to={href}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              {cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group hover-lift overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <Badge className="absolute left-4 top-4 bg-primary/90 hover:bg-primary">{category}</Badge>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
          </time>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime}
          </span>
        </div>
        <h3 className="mt-3 font-bold leading-snug group-hover:text-primary transition-colors">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">{excerpt}</p>
        <Link
          to={href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
        >
          {cta} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
