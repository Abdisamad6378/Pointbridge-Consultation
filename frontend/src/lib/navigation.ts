import { services } from "@/lib/site-data";

export const aboutLinks = [
  { to: "/about", label: "About Us" },
  { to: "/about", hash: "leadership", label: "Our Team" },
  { to: "/projects", label: "Our Projects" },
] as const;

export const serviceLinks = services.map((s) => ({
  to: "/services" as const,
  hash: s.slug,
  label: s.title,
}));

export const mainNav = [
  { to: "/", label: "Home" },
  { to: "/training", label: "Training" },
  { to: "/projects", label: "Events" },
  { to: "/publications", label: "Publications" },
  { to: "/blog", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;
