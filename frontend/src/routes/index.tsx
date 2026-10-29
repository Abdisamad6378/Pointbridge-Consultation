import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/site/Reveal";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ServiceCard } from "@/components/site/ServiceCard";
import { ContentCard } from "@/components/site/ContentCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import { featuredServices, stats } from "@/lib/site-data";
import { companyTagline } from "@/lib/company-profile";
import { images } from "@/lib/images";
import {
  resolveBlogPosts,
  resolvePublications,
  resolveQuickLinkImage,
  siteImagesQueryOptions,
  usePublicClients,
  usePublicTestimonials,
  useSiteImageMap,
} from "@/lib/use-site-content";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(siteImagesQueryOptions());
  },
  head: () => ({
    meta: [
      { title: "PointBridge Consulting — Rigorous Insights in Complex Settings" },
      { name: "description", content: "Independent consulting in governance, peace-building, M&E, research, human capital and ICT — trusted by UN agencies, donors and governments." },
      { property: "og:title", content: "PointBridge Consulting" },
      { property: "og:description", content: "Rigorous, actionable insights in complex and fragile settings." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const quickLinkMeta = [
  { to: "/blog", label: "Stories & insights", sub: "Blogs", key: "blog" as const },
  { to: "/training", label: "Catalogue & apply", sub: "Training", key: "training" as const },
  { to: "/publications", label: "Reports & briefs", sub: "Research", key: "publications" as const },
  { to: "/projects", label: "News & highlights", sub: "Events", key: "projects" as const },
] as const;

function Home() {
  const { data: imageMap } = useSiteImageMap();
  const { data: testimonials = [] } = usePublicTestimonials();
  const { data: clients = [] } = usePublicClients();
  const blogPosts = resolveBlogPosts(imageMap);
  const publicationItems = resolvePublications(imageMap);
  const quickLinks = quickLinkMeta.map((item) => ({
    ...item,
    image: resolveQuickLinkImage(item.key, imageMap),
  }));
  const clientsImage = imageMap?.["section.clients"] ?? images.clients;

  return (
    <>
      <HeroSlider />

      {/* Quick access cards — bcf.so style */}
      <section className="relative z-10 -mt-12 px-4 sm:-mt-16 sm:px-6 md:-mt-20 lg:-mt-28 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {quickLinks.map((item, i) => (
            <Reveal key={item.to} delay={i * 0.06} variant={i % 2 === 0 ? "up" : "scale"}>
              <Link to={item.to} className="group hover-lift block overflow-hidden rounded-xl border border-border/50 bg-card shadow-elegant">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.07_260/0.92)] via-[oklch(0.18_0.07_260/0.35)] to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">{item.sub}</p>
                    <p className="mt-1 text-sm font-bold leading-snug sm:text-base">{item.label}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/75 group-hover:text-white">
                      Read more… <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Impact stats — Company Profile 2025 */}
      <section className="border-y border-border bg-[oklch(0.16_0.06_260)] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/75 sm:text-sm">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section className="section-padding mt-8 bg-[oklch(0.98_0.005_255)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="What We Do"
              title="Our Core Service Areas"
              description={companyTagline}
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <ServiceCard
                  title={s.title}
                  short={s.short}
                  image={images.services[s.slug as keyof typeof images.services]}
                  icon={s.icon}
                  slug={s.slug}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News & Publications */}
      <section className="section-padding border-y border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Insights & Media"
              title="Latest News & Publications"
              description="Stay up to date with our most recent insights and updates. Explore our three latest stories and publications, carefully selected and presented in chronological order, with the newest featured first."
            />
          </Reveal>

          <div className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold">Latest News</h3>
                  <p className="text-sm text-muted-foreground">Newest Articles First</p>
                </div>
                <Button asChild variant="link" size="sm" className="text-primary px-0">
                  <Link to="/blog">View All News</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.06}>
                    <ContentCard
                      layout="horizontal"
                      image={p.image}
                      category="news"
                      title={p.title}
                      excerpt={p.excerpt}
                      date={p.date}
                      href="/blog"
                    />
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold">Latest Publications</h3>
                  <p className="text-sm text-muted-foreground">Newest Briefs & Reports First</p>
                </div>
                <Button asChild variant="link" size="sm" className="text-primary px-0">
                  <Link to="/publications">View All Publications</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {publicationItems.slice(0, 3).map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.06}>
                    <ContentCard
                      layout="horizontal"
                      image={p.image}
                      category={p.category}
                      title={p.title}
                      excerpt={p.excerpt}
                      date={p.date}
                      href="/publications"
                      cta="Open document"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={clientsImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[oklch(0.18_0.07_260/0.9)]" />
        </div>
        <div className="section-padding text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                theme="light"
                eyebrow="Trusted organizations"
                title="Some Of Our Clients"
                description="We proudly collaborate with leading institutions and organizations to deliver impactful solutions and drive sustainable growth across the Horn of Africa."
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="flex min-h-[88px] items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-sm transition-colors hover:border-secondary/40 hover:bg-white/15"
                >
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-12 w-full object-contain brightness-0 invert"
                    />
                  ) : (
                    <span className="text-center text-sm font-semibold text-white">{client.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-[oklch(0.98_0.005_255)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Client voices" title="What our clients say" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name ?? i} delay={i * 0.08}>
                <Card className="h-full border-border/60 bg-white shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex gap-0.5 text-secondary">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full bg-muted ring-2 ring-secondary/20">
                        <img
                          src={t.image ?? images.team[i] ?? images.team[0]}
                          alt={t.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
