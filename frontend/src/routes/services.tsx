import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/site/SectionHeader";
import { additionalServices, approachSteps, services } from "@/lib/site-data";
import { servicesIntro } from "@/lib/company-profile";
import { images } from "@/lib/images";

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

  return (
    <Reveal delay={index * 0.04}>
      <Card id={service.slug} className="overflow-hidden scroll-mt-28 hover:shadow-elegant transition-shadow">
        <div className="grid md:grid-cols-5">
          <div className="relative min-h-56 md:col-span-2 md:min-h-full">
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/10 md:bg-gradient-to-l md:from-transparent md:to-card" />
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
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
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
