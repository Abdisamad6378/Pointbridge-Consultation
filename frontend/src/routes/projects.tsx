import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { projects, projectCategories } from "@/lib/site-data";
import { images } from "@/lib/images";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — PointBridge Consulting" },
      { name: "description", content: "Selected projects across governance, peace-building, research, M&E and HR development." },
      { property: "og:title", content: "Projects — PointBridge Consulting" },
      { property: "og:description", content: "Case studies from complex and fragile settings." },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: Projects,
});

function Projects() {
  const [cat, setCat] = useState<(typeof projectCategories)[number]>("All");
  const [active, setActive] = useState<(typeof projects)[number] | null>(null);

  const filtered = useMemo(
    () => (cat === "All" ? projects : projects.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <>
      <PageHero
        image={images.quickLinks.projects}
        eyebrow="Selected Work"
        title="Projects & case studies"
        description="A snapshot of engagements across governance, peace, research and institutional reform."
      />

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {projectCategories.map((c) => (
              <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>
                {c}
              </Button>
            ))}
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <Card
                  className="h-full overflow-hidden cursor-pointer hover:shadow-elegant transition-all group"
                  onClick={() => setActive(p)}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{p.category}</Badge>
                      <span className="text-xs text-muted-foreground">{p.year}</span>
                    </div>
                    <h3 className="mt-3 font-bold leading-snug">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.summary}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {active && (
            <>
              <div className="aspect-video overflow-hidden">
                <img
                  src={active.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle>{active.title}</DialogTitle>
                  <DialogDescription>{active.category} · {active.year}</DialogDescription>
                </DialogHeader>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{active.summary}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Engagement combined desk research, key-informant interviews, primary data
                  collection, and stakeholder co-design — delivered to international quality
                  standards with full client confidentiality.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
