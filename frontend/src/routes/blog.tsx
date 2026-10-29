import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { ContentCard } from "@/components/site/ContentCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/site-data";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Insights — PointBridge Consulting" },
      { name: "description", content: "Insights on governance, peace-building, M&E, leadership and research from PointBridge practitioners." },
      { property: "og:title", content: "Blog — PointBridge Consulting" },
      { property: "og:description", content: "Field-tested insights from our practitioners." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  const [q, setQ] = useState("");
  const featured = blogPosts[0];
  const rest = useMemo(
    () => blogPosts.slice(1).filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  return (
    <>
      <PageHero
        image={featured.image}
        eyebrow="Insights & Media"
        title="Stories & insights from the field"
        description="Field notes, methodology and commentary from our practitioners working in complex settings."
      />

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <article className="group overflow-hidden rounded-3xl border border-border shadow-elegant">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-64 lg:min-h-full overflow-hidden">
                  <img
                    src={featured.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute left-6 top-6">Featured</Badge>
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary">{featured.category}</p>
                  <h2 className="mt-3 text-2xl font-bold md:text-3xl leading-snug">{featured.title}</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                  <p className="mt-5 text-sm text-muted-foreground">
                    {new Date(featured.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          <div className="mt-10 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <ContentCard
                  image={p.image}
                  category={p.category}
                  title={p.title}
                  excerpt={p.excerpt}
                  date={p.date}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
