import { createFileRoute } from "@tanstack/react-router";
import { Compass, Target, Heart, Sparkles } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { timeline } from "@/lib/site-data";
import { companyAboutParagraphs, companySummary, companyTagline } from "@/lib/company-profile";
import { images } from "@/lib/images";
import { usePublicTeamMembers } from "@/lib/use-site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PointBridge Consulting" },
      { name: "description", content: companySummary },
      { property: "og:title", content: "About — PointBridge Consulting" },
      { property: "og:description", content: companyTagline },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  { icon: Compass, title: "Rigor", text: "Methodological discipline in everything we deliver." },
  { icon: Target, title: "Impact", text: "Insight that translates into decisions and outcomes." },
  { icon: Heart, title: "Integrity", text: "Independent, ethical and accountable to evidence." },
  { icon: Sparkles, title: "Local roots", text: "Globally informed, locally grounded teams." },
];

function About() {
  const { data: teamMembers = [] } = usePublicTeamMembers();

  return (
    <>
      <PageHero
        image={images.about}
        eyebrow="About PointBridge Consulting"
        title="Independent advisory & evaluation since 2019"
        description={companySummary}
      />

      <section className="section-padding border-b border-border bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">About Us</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {companyAboutParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {[
            { title: "Our Mission", text: "To deliver rigorous, actionable evaluations and advisory services that strengthen institutions and improve lives in complex and fragile settings.", img: images.services["strategic-policy-governance"] },
            { title: "Our Vision", text: "A region where every leader and programme has the evidence needed to make decisions that hold up under scrutiny.", img: images.services["research-analytics"] },
            { title: "Our Approach", text: "Context-sensitive, partnership-driven, and grounded in international standards with deep local presence across East Africa.", img: images.services["peace-building"] },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <Card className="h-full overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={b.img} alt="" className="h-full w-full object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg">{b.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-padding bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">Core values</h2></Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                      <v.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Leadership</h2>
            <p className="mt-3 text-muted-foreground">Experienced practitioners leading every engagement.</p>
          </Reveal>
          <div id="leadership" className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 scroll-mt-28">
            {teamMembers.map((m, i) => (
              <Reveal key={m.name ?? i} delay={i * 0.06}>
                <Card className="h-full overflow-hidden group hover:shadow-elegant transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold">{m.name}</h3>
                    <p className="text-xs font-semibold text-secondary">{m.role}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/40 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal><h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">Our journey since 2019</h2></Reveal>
          <ol className="mt-12 relative border-l-2 border-primary/20 pl-8 space-y-10">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <li className="relative">
                  <div className="absolute -left-[2.45rem] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-4 ring-background">
                    {t.year.slice(2)}
                  </div>
                  <h3 className="font-bold text-lg">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
