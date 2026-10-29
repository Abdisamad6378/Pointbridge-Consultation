import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/site/SectionHeader";
import { additionalServices, services } from "@/lib/site-data";
import { servicesIntro } from "@/lib/company-profile";
import { images } from "@/lib/images";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — PointBridge Consulting" },
      {
        name: "description",
        content:
          "Strategic policy, peace-building, audit & risk, human capital, research, M&E, business development, ICT and more.",
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
    </>
  );
}
