import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trainings } from "@/lib/site-data";
import { trainingIntro } from "@/lib/company-profile";
import { images } from "@/lib/images";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training — PointBridge Consulting" },
      { name: "description", content: "Executive and professional training in strategy, finance, leadership, and communications." },
      { property: "og:title", content: "Training — PointBridge Consulting" },
      { property: "og:description", content: "5,000+ professionals trained across leadership, finance, M&E and more." },
      { property: "og:url", content: "/training" },
    ],
    links: [{ rel: "canonical", href: "/training" }],
  }),
  component: Training,
});

function Training() {
  const [program, setProgram] = useState("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Registration received. We'll be in touch shortly.");
    (e.currentTarget as HTMLFormElement).reset();
    setProgram("");
  };

  return (
    <>
      <PageHero
        image={images.quickLinks.training}
        eyebrow="Training & Capacity Development"
        title="Structured programmes that build lasting skills"
        description={trainingIntro}
      />

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {trainings.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.06}>
              <Card className="h-full overflow-hidden hover:shadow-elegant transition-shadow group">
                <div className="aspect-[21/9] overflow-hidden">
                  <img
                    src={t.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-bold text-lg">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {t.modules.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-padding bg-muted/40 border-t border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">Register your interest</h2>
            <p className="mt-3 text-center text-muted-foreground">Tell us about you — we'll match you with the right cohort.</p>
          </Reveal>
          <Card className="mt-10 overflow-hidden shadow-elegant">
            <div className="grid md:grid-cols-5">
              <div className="hidden md:block md:col-span-2 relative min-h-full">
                <img src={trainings[0].image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <CardContent className="md:col-span-3 p-6 sm:p-8">
                <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2"><Label htmlFor="name">Full name</Label><Input id="name" required /></div>
                  <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
                  <div className="grid gap-2"><Label htmlFor="org">Organization</Label><Input id="org" /></div>
                  <div className="grid gap-2">
                    <Label htmlFor="program">Program</Label>
                    <Select value={program} onValueChange={setProgram}>
                      <SelectTrigger id="program"><SelectValue placeholder="Choose a program" /></SelectTrigger>
                      <SelectContent>
                        {trainings.map((t) => <SelectItem key={t.title} value={t.title}>{t.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 sm:col-span-2"><Label htmlFor="msg">Anything we should know?</Label><Textarea id="msg" rows={4} /></div>
                  <div className="sm:col-span-2 flex flex-wrap gap-3">
                    <Button type="submit">Submit registration</Button>
                    <Button asChild type="button" variant="outline"><Link to="/contact">Talk to us first</Link></Button>
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
