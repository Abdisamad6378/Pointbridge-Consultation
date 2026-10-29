import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Globe, MapPin, Phone } from "lucide-react";
import { z } from "zod";

import { images } from "@/lib/images";
import { submitContact } from "@/lib/api";
import {
  companyEmails,
  companyEstablished,
  companyPhone,
  companyRegion,
  companySlogan,
  companyWebsite,
  companyWebsiteDisplay,
  contactDetails,
} from "@/lib/company-profile";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PointBridge Consulting" },
      { name: "description", content: `${companySlogan} Contact PointBridge Consulting — established ${companyEstablished}.` },
      { property: "og:title", content: "Contact — PointBridge Consulting" },
      { property: "og:description", content: "Get in touch with our team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  org: z.string().trim().max(120).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(10, "Please share a few details").max(2000),
});

const faqs = [
  { q: "What sectors do you work in?", a: "Public sector, multilateral & donor programs, INGOs and selected private-sector clients in fragile settings." },
  { q: "Do you take on small engagements?", a: "Yes — from short advisory sprints to multi-year programs, provided we can deliver to our quality bar." },
  { q: "How quickly will you reply?", a: "Within two business days, often sooner." },
  { q: "Can you partner with us on a bid?", a: "Often, yes. Send us the EOI/TOR and we will respond promptly." },
];

function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitContact(parsed.data);
      toast.success(result.message);
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        image={images.cta}
        eyebrow="Contact Information"
        title="Get in touch with PointBridge Consulting"
        description={companySlogan}
      />

      <section className="section-padding mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-elegant">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="name">Full name</Label><Input id="name" name="name" required maxLength={100} /></div>
                <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required maxLength={255} /></div>
                <div className="grid gap-2"><Label htmlFor="org">Organization</Label><Input id="org" name="org" maxLength={120} /></div>
                <div className="grid gap-2"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" required maxLength={150} /></div>
                <div className="grid gap-2 sm:col-span-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={6} required maxLength={2000} /></div>
                <div className="sm:col-span-2"><Button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send message"}</Button></div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-lg font-bold text-foreground">Contact Information</h2>
              <dl className="mt-4 divide-y divide-border">
                {contactDetails.map((row) => (
                  <div key={`${row.label}-${row.value}`} className="flex gap-4 py-3 text-sm first:pt-0 last:pb-0">
                    <dt className="w-24 shrink-0 font-semibold text-foreground">{row.label}</dt>
                    <dd className="text-muted-foreground">
                      {"href" in row && row.href ? (
                        <a href={row.href} className="font-medium text-primary hover:underline break-all">
                          {row.value}
                        </a>
                      ) : (
                        <span className="font-medium text-foreground">{row.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 border-t border-border pt-4 text-center text-sm italic text-primary/90">
                {companySlogan}
              </p>
            </CardContent>
          </Card>

          {[
            { icon: Phone, label: "Phone / WhatsApp", value: companyPhone, href: `tel:${companyPhone.replace(/-/g, "")}` },
            { icon: MapPin, label: "Region", value: companyRegion },
          ].map((c) => (
            <Card key={c.label}>
              <CardContent className="p-5 flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><c.icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  {c.href ? <a href={c.href} className="text-sm font-medium hover:text-primary break-all">{c.value}</a> : <div className="text-sm font-medium break-all">{c.value}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Reveal><h2 className="text-2xl font-bold">Find us</h2></Reveal>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-elegant">
            <iframe
              title="Map"
              src="https://www.google.com/maps?q=Horn+of+Africa&output=embed"
              className="w-full h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <Reveal><h2 className="text-3xl font-bold text-center">Frequently asked</h2></Reveal>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
