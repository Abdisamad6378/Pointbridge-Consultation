import heroImg from "@/assets/hero-consulting.jpg";
import aboutImg from "@/assets/about-banner.jpg";

export const images = {
  hero: heroImg,
  about: aboutImg,
  quickLinks: {
    blog: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    training: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    publications: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    projects: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  services: {
    "strategic-policy-governance": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    "peace-building": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    "audit-risk": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    "human-capital": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    "research-analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "monitoring-evaluation": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "business-development": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    "ict-solutions": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "education-consultancy": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    "environmental-climate": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    "hospitality-management": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  blog: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80",
  ],
  publications: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
  ],
  projects: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  ],
  team: [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  ],
  clients: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80",
  cta: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
} as const;

export type HeroSlide = {
  image: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  titleLine2?: string;
  description: string;
  primaryTo: string;
  primaryLabel: string;
  secondaryTo: string;
  secondaryLabel: string;
};

export const heroSlides: HeroSlide[] = [
  {
    image: "https://i.ibb.co/VWXQhGyB/hero-slide-1.jpg",
    title: "Expertise Beyond Boundaries",
    highlight: "Beyond Boundaries",
    titleLine2: "for Your Organization",
    description:
      "We empower organizations to achieve excellence through innovative solutions and sustainable transformation.",
    primaryTo: "/contact",
    primaryLabel: "Get Started",
    secondaryTo: "/about",
    secondaryLabel: "Watch Video",
  },
  {
    image: "https://i.ibb.co/TqrGBqnH/hero-slide-4.jpg",
    eyebrow: "Governance & Reform",
    title: "Building Capacity for",
    highlight: "Lasting Reform",
    description:
      "Policy advisory, institutional strengthening and leadership development for governments and donors across the Horn of Africa.",
    primaryTo: "/services",
    primaryLabel: "Our Services",
    secondaryTo: "/projects",
    secondaryLabel: "View Projects",
  },
  {
    image: "https://i.ibb.co/C5YT56Xr/hero-slide-5.jpg",
    eyebrow: "Training & Development",
    title: "Empowering Leaders Through",
    highlight: "Expert Training",
    description:
      "Professional programmes in M&E, governance, finance and leadership — delivered to international standards.",
    primaryTo: "/training",
    primaryLabel: "Explore Training",
    secondaryTo: "/contact",
    secondaryLabel: "Contact Us",
  },
  {
    image: "https://i.ibb.co/4wBBvpFV/hero-slide-2.jpg",
    eyebrow: "Research & Analytics",
    title: "Rigorous Insights in",
    highlight: "Complex Settings",
    description:
      "Mixed-methods research, baseline surveys and evaluations trusted by UN agencies, donors and governments.",
    primaryTo: "/publications",
    primaryLabel: "Publications",
    secondaryTo: "/blog",
    secondaryLabel: "Latest News",
  },
];
