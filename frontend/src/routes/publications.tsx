import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { publications, publicationCategories } from "@/lib/site-data";
import { images } from "@/lib/images";

export const Route = createFileRoute("/publications")({
  head: () => ({
    meta: [
      { title: "Research & Publications — PointBridge Consulting" },
      { name: "description", content: "Reports, evaluations and research publications by PointBridge Consulting." },
      { property: "og:title", content: "Research & Publications — PointBridge" },
      { property: "og:description", content: "Download our reports, evaluations and research." },
      { property: "og:url", content: "/publications" },
    ],
    links: [{ rel: "canonical", href: "/publications" }],
  }),
  component: Publications,
});

function Publications() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof publicationCategories)[number]>("All");
  const filtered = useMemo(() => {
    return publications.filter((p) => {
      const matchesCat = cat === "All" || p.category === cat;
      const matchesQ = !q || p.title.toLowerCase().includes(q.toLowerCase());
      return matchesCat && matchesQ;
    });
  }, [q, cat]);

  return (
    <>
      <PageHero
        image={images.quickLinks.publications}
        eyebrow="Research Library"
        title="Publications & Reports"
        description="Evidence we are proud to make public. Filter, search and download."
      />

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search publications…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-2">
              {publicationCategories.map((c) => (
                <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.04}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-elegant transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute left-4 top-4">{p.category}</Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs text-muted-foreground">{p.year} · {p.pages} pages</p>
                    <h3 className="mt-2 font-bold leading-snug flex-1">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-5 self-start"
                      onClick={() => toast.success("PDF download will start shortly.")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                No publications match your search.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
