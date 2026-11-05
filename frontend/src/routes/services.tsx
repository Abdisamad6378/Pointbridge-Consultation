import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { FieldPhotoTint } from "@/components/site/FieldPhotoTint";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/site/SectionHeader";
import { additionalServices, approachSteps, services } from "@/lib/site-data";
import { servicesIntro } from "@/lib/company-profile";
import { heroPhotoBlur, images } from "@/lib/images";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — PointBridge Consulting" },
      {
        name: "description",
        content:
          "Strategic policy, peace-building, audit & risk, human capital, research, M&E, business development, needs assessments, community engagement, proposal writing, ICT and more.",
      },
      { property: "og:title", content: "Services — PointBridge Consulting" },
      { property: "og:description", content: "Our core service areas — independent advisory & evaluation." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function ServiceBlock({ service, index }: { service: (typeof services)[number]; index: number }) {
  const image =
    images.services[service.slug as keyof typeof images.services] ??
    images.services["strategic-policy-governance"];
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [open, setOpen] = useState(false);

  // A link to this service, like "Learn more" on the home page, should show its details.
  useEffect(() => {
    if (hash === service.slug) setOpen(true);
  }, [hash, service.slug]);

  return (
    <Reveal delay={index * 0.04}>
      <Card id={service.slug} className="overflow-hidden scroll-mt-28 hover:shadow-elegant transition-shadow">
        <div className="grid md:grid-cols-5">
          <div className="relative min-h-56 overflow-hidden md:col-span-2 md:min-h-full">
            <img src={image} alt="" className={cn("absolute inset-0 h-full w-full object-cover", heroPhotoBlur(image))} loading="lazy" />
            <FieldPhotoTint src={image} />
          </div>
          <CardContent className="flex flex-col justify-center p-6 sm:p-8 md:col-span-3">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <service.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-2 text-muted-foreground">{service.short}</p>
              </div>
            </div>
            {/* Details are always shown from tablet width up, and expand on phones. */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="mt-5 self-start md:hidden"
            >
              {open ? "Hide details" : "View details"}
              <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", open && "rotate-180")} />
            </Button>
            <ul className={cn("mt-6 gap-4 sm:grid-cols-2 md:grid", open ? "grid" : "hidden")}>
              {service.items.map((it) => (
                <li key={it.title} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="font-medium text-foreground">{it.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{it.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>
      </Card>
    </Reveal>
  );
}

function Services() {
  return (
    <>
      <PageHero
        image={images.quickLinks.projects}
        eyebrow="Our Core Service Areas"
        title="Independent advisory & evaluation across sectors"
        description={servicesIntro}
      />

      <section className="section-padding">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          {services.map((s, i) => (
              <ServiceBlock key={s.slug} service={s} index={i} />
            ))}
        </div>
      </section>

      <section className="section-padding border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Additional Services"
              title="Specialized advisory beyond our core practice areas"
              description="Education, environmental, climate and hospitality consulting to complement our flagship services."
            />
          </Reveal>
          <div className="mt-10 space-y-8">
            {additionalServices.map((s, i) => (
              <ServiceBlock key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="How We Work" title="From question to decision" />
          </Reveal>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approachSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05}>
                <li className="h-full border-t-2 border-primary pt-5">
                  <span className="text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <div className="gradient-hero mt-12 flex flex-col gap-6 rounded-2xl p-8 text-white md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Have an assignment in a complex setting?</h2>
                <p className="mt-2 text-white/85">
                  Share your ToR and we'll respond with a tailored technical and financial proposal.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <Button asChild variant="secondary" size="lg">
                  <Link to="/contact">Request a proposal</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
