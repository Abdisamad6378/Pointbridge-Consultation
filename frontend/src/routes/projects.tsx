import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FieldPhotoTint } from "@/components/site/FieldPhotoTint";
import { SectionHeader } from "@/components/site/SectionHeader";
import { fieldGallery, projects, projectCategories } from "@/lib/site-data";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

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
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <FieldPhotoTint src={p.image} />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{p.category}</Badge>
                      {p.year && <span className="text-xs text-muted-foreground">{p.year}</span>}
                    </div>
                    <h3 className="mt-3 font-bold leading-snug">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.summary}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
            {/* Fills the last row on desktop, whichever category is selected. */}
            {filtered.length % 3 !== 0 && (
              <Reveal className={cn("hidden h-full lg:block", filtered.length % 3 === 1 && "lg:col-span-2")}>
                <div className="gradient-hero flex h-full flex-col justify-center rounded-xl p-8 text-white">
                  <h3 className="text-2xl font-bold">Have an assignment?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    Tell us what you need and we will put the right team on it.
                  </p>
                  <Button asChild variant="secondary" className="mt-6 self-start">
                    <Link to="/contact">Talk to us</Link>
                  </Button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="From the Field"
              title="Our teams, on the ground"
              description="Data collection, consultations and site verification across South and Central Somalia."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fieldGallery.map((photo, i) => (
              <Reveal key={photo.label} delay={i * 0.05}>
                <figure>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                    <img src={photo.image} alt={photo.alt} loading="lazy" className="h-full w-full object-cover object-top" />
                    <FieldPhotoTint src={photo.image} />
                  </div>
                  <figcaption className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{photo.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{photo.caption}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {active && (
            <>
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={active.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <FieldPhotoTint src={active.image} />
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle>{active.title}</DialogTitle>
                  <DialogDescription>{active.year ? `${active.category} · ${active.year}` : active.category}</DialogDescription>
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
