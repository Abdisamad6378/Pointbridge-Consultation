import {
  Scale,
  HandshakeIcon,
  ShieldCheck,
  Users,
  LineChart,
  Activity,
  TrendingUp,
  Monitor,
  GraduationCap,
  Leaf,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type ServiceItem = {
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: LucideIcon;
  items: ServiceItem[];
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "strategic-policy-governance",
    title: "Strategic Policy & Governance",
    short:
      "Comprehensive policy development and governance frameworks for sustainable institutional growth.",
    icon: Scale,
    featured: true,
    items: [
      {
        title: "Policy Development",
        description:
          "Comprehensive policy development for public institutions, NGOs, and private sector clients.",
      },
      {
        title: "National Policy Design",
        description: "Design of national policies, governance frameworks, and institutional strategies.",
      },
      {
        title: "Decentralization Support",
        description: "Support for decentralization, public sector reform, and regulatory review.",
      },
      {
        title: "Capacity Building",
        description: "Capacity building in public policy, legislative drafting, and strategic planning.",
      },
      {
        title: "Stakeholder Facilitation",
        description: "Facilitation of stakeholder consultations and participatory policy processes.",
      },
      {
        title: "Governance Frameworks",
        description: "Institutional governance design aligned with global best practices.",
      },
    ],
  },
  {
    slug: "peace-building",
    title: "Peace-Building Programs",
    short:
      "Conflict-sensitive and fragility-responsive advisory supporting durable peace, social cohesion, and resilience.",
    icon: HandshakeIcon,
    featured: true,
    items: [
      {
        title: "Conflict Analysis & Fragility Assessments",
        description:
          "Political economy analysis, conflict mapping, Do No Harm analysis, and early warning systems.",
      },
      {
        title: "Social Cohesion & Reconciliation",
        description:
          "Inter-community dialogue, traditional peacemaking support, and trauma-informed reconciliation.",
      },
      {
        title: "Conflict-Sensitive Programme Design",
        description:
          "Mainstreaming conflict sensitivity and the Humanitarian–Development–Peace nexus in fragile settings.",
      },
      {
        title: "Security Sector Reform & Peace Governance",
        description: "SSR advisory, rule of law strengthening, DDR support, and peace architecture.",
      },
      {
        title: "Youth & Women in Peace Processes",
        description:
          "Programming ensuring meaningful participation of youth, women, and marginalized groups.",
      },
      {
        title: "M&E for Peace Programmes",
        description:
          "Peace-sensitive results frameworks, outcome harvesting, and conflict marker tracking.",
      },
    ],
  },
  {
    slug: "audit-risk",
    title: "Audit Assurance & Risk Management",
    short:
      "Comprehensive audit and risk management solutions to maintain transparency, accountability, and security.",
    icon: ShieldCheck,
    featured: true,
    items: [
      {
        title: "Internal Audits & Compliance",
        description: "Financial reviews ensuring organizational integrity and regulatory adherence.",
      },
      {
        title: "Forensic Audit Investigations",
        description: "Specialized forensic investigations and advanced fraud detection systems.",
      },
      {
        title: "Enterprise Risk Assessments",
        description: "Comprehensive risk assessments and strategic mitigation planning.",
      },
      {
        title: "Risk Management Frameworks",
        description: "Development of risk frameworks and robust internal control systems.",
      },
      {
        title: "Audit Readiness Training",
        description: "Training programs focused on audit readiness for NGOs and SMEs.",
      },
      {
        title: "Compliance Monitoring",
        description: "Continuous compliance monitoring and reporting systems.",
      },
    ],
  },
  {
    slug: "human-capital",
    title: "Institution & Human Capital Development",
    short:
      "Comprehensive HR management solutions and capacity building programs to enhance organizational effectiveness.",
    icon: Users,
    featured: true,
    items: [
      {
        title: "End-to-End HR Management",
        description: "HR systems design, staff performance frameworks, and efficiency audits.",
      },
      {
        title: "Performance Appraisal Systems",
        description: "KPI design, evaluation frameworks, and 360-degree feedback systems.",
      },
      {
        title: "HR Policies & Procedures",
        description: "Policies aligned with local labor laws and global best practices.",
      },
      {
        title: "Capacity Building Programs",
        description: "Custom training curricula and post-training evaluation.",
      },
      {
        title: "Leadership & Skills Development",
        description: "Executive leadership programs, technical skills training, and knowledge transfer.",
      },
      {
        title: "Organizational Development",
        description: "Org structure redesign, change management, and institutional effectiveness.",
      },
    ],
  },
  {
    slug: "research-analytics",
    title: "Research & Analytics",
    short:
      "Data-driven research and analytics solutions to drive informed decision-making and strategic planning.",
    icon: LineChart,
    featured: true,
    items: [
      {
        title: "Market Research & Analysis",
        description: "In-depth market analysis to inform strategic decisions and identify growth opportunities.",
      },
      {
        title: "Baseline Surveys & Assessments",
        description: "Establishing benchmarks and measuring program progress over time.",
      },
      {
        title: "Impact Assessment & Evaluation",
        description: "Comprehensive program effectiveness measurement for policy development.",
      },
      {
        title: "Data Analytics & Insights",
        description: "Advanced data analysis driving evidence-based decision-making.",
      },
      {
        title: "Socio-economic Studies",
        description: "Research to understand community dynamics and development needs.",
      },
      {
        title: "Statistical Analysis & Modeling",
        description: "Advanced statistical techniques providing robust predictive analytics.",
      },
    ],
  },
  {
    slug: "monitoring-evaluation",
    title: "Monitoring & Evaluation",
    short:
      "Design and implementation of comprehensive M&E systems with real-time tracking capabilities.",
    icon: Activity,
    featured: true,
    items: [
      {
        title: "M&E Systems Design",
        description: "Comprehensive design and implementation of monitoring and evaluation systems.",
      },
      {
        title: "Results Frameworks",
        description: "Development of log frames, results frameworks, and performance indicators.",
      },
      {
        title: "Project Evaluations",
        description: "Baseline, mid-term, and final evaluations across sectors.",
      },
      {
        title: "Digital Dashboards",
        description: "M&E tools and digital dashboards for real-time tracking and reporting.",
      },
      {
        title: "Capacity Building",
        description: "Training in M&E for staff and institutions to enhance performance.",
      },
      {
        title: "Adaptive Management",
        description: "Learning, reporting, and adaptive management for continuous improvement.",
      },
    ],
  },
  {
    slug: "business-development",
    title: "Business & Development Services",
    short:
      "Strategic business growth initiatives and comprehensive project management across development sectors.",
    icon: TrendingUp,
    featured: true,
    items: [
      {
        title: "Tailored BDS Solutions",
        description: "Business Development Services for micro, medium, and corporate-level enterprises.",
      },
      {
        title: "Investment Readiness",
        description:
          "Strengthening financial, managerial, and market readiness for sustainable growth.",
      },
      {
        title: "Micro-Enterprise Support",
        description: "Financial literacy, business planning, and market linkages for micro-enterprises.",
      },
      {
        title: "Capital Access",
        description: "Bridging supply and demand sides of capital by aligning needs with investor criteria.",
      },
      {
        title: "Inclusive Finance",
        description: "Promoting access to finance for women and youth-led enterprises.",
      },
      {
        title: "Entrepreneur Mentoring",
        description: "Mentoring and coaching for entrepreneurs to refine business strategies.",
      },
    ],
  },
  {
    slug: "ict-solutions",
    title: "ICT Solutions",
    short: "Website development, technical troubleshooting, and cybersecurity services.",
    icon: Monitor,
    featured: true,
    items: [
      {
        title: "Website Development",
        description: "Professional websites and digital platforms for institutions and enterprises.",
      },
      {
        title: "Technical Support",
        description: "Ongoing technical troubleshooting and systems maintenance.",
      },
      {
        title: "Cybersecurity",
        description: "Security assessments and protection for organizational digital assets.",
      },
      {
        title: "Digital Transformation",
        description: "Advisory on digitizing workflows, data systems, and service delivery.",
      },
    ],
  },
];

export const additionalServices: Service[] = [
  {
    slug: "education-consultancy",
    title: "Education & Consultancy",
    short:
      "Curriculum development, school improvement, TVET, and digital transformation for academic institutions.",
    icon: GraduationCap,
    featured: false,
    items: [
      {
        title: "Curriculum Development",
        description: "Design and review of academic and vocational curricula.",
      },
      {
        title: "School Improvement",
        description: "Institutional strengthening and quality assurance for schools.",
      },
      {
        title: "TVET Programmes",
        description: "Technical and vocational education advisory and programme design.",
      },
      {
        title: "Digital Transformation",
        description: "EdTech integration and digital learning strategies for institutions.",
      },
    ],
  },
  {
    slug: "environmental-climate",
    title: "Environmental & Climate Consulting",
    short:
      "Environmental impact assessments, climate adaptation strategies, and urban resilience planning.",
    icon: Leaf,
    featured: false,
    items: [
      {
        title: "Environmental Impact Assessments",
        description: "Rigorous EIA studies aligned with national and international standards.",
      },
      {
        title: "Climate Adaptation Strategies",
        description: "Programme design for climate resilience in vulnerable communities.",
      },
      {
        title: "Urban Resilience Planning",
        description: "Planning support for cities facing environmental and demographic pressures.",
      },
    ],
  },
  {
    slug: "hospitality-management",
    title: "Hospitality & Hotel Management",
    short: "Advisory and management consulting for the hospitality and hotel sector.",
    icon: Building2,
    featured: false,
    items: [
      {
        title: "Operations Advisory",
        description: "Efficiency reviews and service quality improvement for hospitality businesses.",
      },
      {
        title: "Management Consulting",
        description: "Strategic and operational support for hotels and tourism enterprises.",
      },
    ],
  },
];

export const featuredServices = services.filter((s) => s.featured !== false);

export const allServices = [...services, ...additionalServices];

export const stats = [
  { value: "80+", label: "HR Systems Delivered" },
  { value: "5,000+", label: "Professionals Trained" },
  { value: "40+", label: "Institutions Supported" },
  { value: "2019", label: "Year Established" },
];

export const trainings = [
  {
    title: "Strategy & Economics",
    desc: "Advanced strategic planning and economic analysis programmes.",
    modules: [
      "Strategic planning frameworks",
      "Public economics and policy analysis",
      "Market systems and scenario modeling",
      "Macro and micro economic advisory",
    ],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  },
  {
    title: "Finance & Compliance",
    desc: "Financial management, audit readiness, and regulatory compliance training.",
    modules: [
      "Public financial management (PFM)",
      "IFRS, IPSAS and donor compliance",
      "Internal controls and audit readiness",
      "Financial reporting for NGOs and SMEs",
    ],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  },
  {
    title: "Leadership Development",
    desc: "Executive and mid-level leadership programmes for organizational growth.",
    modules: [
      "Executive and change leadership",
      "Women in leadership programmes",
      "Team effectiveness and negotiation",
      "Public sector leadership academies",
    ],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  },
  {
    title: "Marketing & Communications",
    desc: "Practical marketing strategy and stakeholder communication workshops.",
    modules: [
      "Strategic communications and advocacy",
      "Stakeholder engagement",
      "Digital marketing fundamentals",
      "Brand building and outreach",
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
];

export const projects = [
  {
    title: "National HR Systems Reform",
    category: "HR Development",
    year: 2024,
    summary:
      "Designed and delivered end-to-end HR systems across public institutions, including recruitment services and performance frameworks.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    title: "Peace & Reconciliation Programme",
    category: "Peace Building",
    year: 2023,
    summary:
      "Conflict-sensitive programme design and social cohesion initiatives across multiple regions in the Horn of Africa.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  },
  {
    title: "M&E Digital Dashboard",
    category: "M&E",
    year: 2024,
    summary:
      "Real-time M&E dashboards and results frameworks for a multi-donor development programme.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  },
  {
    title: "Governance Reform Advisory",
    category: "Governance",
    year: 2022,
    summary:
      "National policy advisory, decentralization support, and capacity building for institutional reform.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
  },
  {
    title: "Socio-economic Baseline Study",
    category: "Research",
    year: 2023,
    summary:
      "Mixed-methods baseline surveys and statistical analysis in complex and fragile settings.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
  },
  {
    title: "Professional Training Academy",
    category: "Training",
    year: 2024,
    summary:
      "Structured capacity development programmes training 1,200+ professionals in leadership, finance, and M&E.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  },
];

export const projectCategories = [
  "All",
  "Governance",
  "Peace Building",
  "Research",
  "M&E",
  "HR Development",
  "Training",
] as const;

export const testimonials = [
  {
    name: "Dr. Amina Yusuf",
    role: "Director, Ministry of Planning",
    quote:
      "PointBridge delivered rigorous evaluations with discipline and integrity in one of our most complex reform programmes.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Mark Johansson",
    role: "Country Director, INGO",
    quote:
      "Their M&E framework changed how we report results to donors — clear, defensible, and on time.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Hodan Ahmed",
    role: "Programme Manager, UN Agency",
    quote:
      "Rigorous, ethical and locally grounded. Exactly what fragile contexts need from an advisory partner.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
];

export const partners = [
  "UN Agencies",
  "International NGOs",
  "Bilateral Donors",
  "Foundations",
  "World Bank",
  "EU Delegation",
  "USAID",
  "African Union",
];

export const publications = [
  {
    slug: "governance-fragile-states",
    title: "Governance Reform in Fragile States: A Practitioner's Guide",
    category: "Report",
    year: 2024,
    pages: 86,
    date: "2026-04-04",
    excerpt:
      "A practical framework for designing and implementing governance reforms in complex and fragile settings.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
  },
  {
    slug: "livelihoods-baseline",
    title: "Baseline Survey: Livelihoods in Post-Conflict Communities",
    category: "Research",
    year: 2023,
    pages: 124,
    date: "2026-04-02",
    excerpt:
      "Mixed-methods baseline examining livelihood recovery and socio-economic dynamics in post-conflict areas.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
  },
  {
    slug: "peace-program-evaluation",
    title: "Evaluation of a Multi-Donor Peace-Building Program",
    category: "Evaluation",
    year: 2024,
    pages: 62,
    date: "2026-03-18",
    excerpt:
      "Independent evaluation assessing outcomes, sustainability and lessons from a regional peace initiative.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
  },
  {
    slug: "hr-maturity-model",
    title: "HR Systems Maturity Model for Public Institutions",
    category: "Report",
    year: 2023,
    pages: 48,
    date: "2026-02-10",
    excerpt:
      "A diagnostic tool for ministries and public agencies to assess and strengthen HR system performance.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    slug: "digital-me",
    title: "Digital M&E: From Indicators to Insight",
    category: "Publication",
    year: 2024,
    pages: 54,
    date: "2026-01-22",
    excerpt:
      "How digital dashboards transform monitoring from a compliance exercise into decision support.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    slug: "sme-investment",
    title: "Investment Readiness for SMEs in Frontier Markets",
    category: "Publication",
    year: 2022,
    pages: 72,
    date: "2025-11-05",
    excerpt:
      "Guidance for entrepreneurs and development partners on building investable, growth-ready businesses.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
  },
];

export const publicationCategories = ["All", "Report", "Research", "Evaluation", "Publication"] as const;

export const blogPosts = [
  {
    slug: "rigor-in-fragile-contexts",
    title: "Why Rigor Matters in Fragile Contexts",
    category: "Insights",
    date: "2026-05-12",
    excerpt:
      "Methodological discipline is what separates credible evidence from advocacy in complex settings.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    slug: "designing-m-e-that-leaders-use",
    title: "Designing M&E That Leaders Actually Use",
    category: "M&E",
    date: "2026-04-02",
    excerpt: "Dashboards fail when they answer the wrong questions. Start with decisions.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    slug: "leadership-public-sector-reform",
    title: "Leadership Lessons from Public Sector Reform",
    category: "Leadership",
    date: "2026-02-21",
    excerpt: "Reform is a coalition exercise. The technical work is only part of the solution.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  },
  {
    slug: "peace-building-evidence",
    title: "Building Peace, Building Evidence",
    category: "Peace",
    date: "2026-01-15",
    excerpt: "How to evaluate something as contested and political as peace itself.",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80",
  },
];

export const teamMembers = [
  {
    name: "Keynan A. Mohamed",
    role: "Managing Partner",
    bio: "20+ years across governance, M&E and institutional reform in East Africa.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    name: "Dr. Fatuma Hassan",
    role: "Director, Research & Analytics",
    bio: "Mixed-methods researcher specializing in fragile and humanitarian contexts.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Ahmed Warsame",
    role: "Head of Audit & Risk",
    bio: "CPA, CIA. Former Big Four assurance leader with deep NGO and public sector experience.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Layla Ibrahim",
    role: "Director, Human Capital",
    bio: "HR systems architect for ministries, UN agencies and international NGOs.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
];

export const timeline = [
  {
    year: "2019",
    title: "Company Founded",
    text: "PointBridge Consulting established as an independent evaluation and advisory firm in East Africa.",
  },
  {
    year: "2020",
    title: "First Major HR Reform",
    text: "Engaged on national HR systems design and public sector institutional strengthening.",
  },
  {
    year: "2022",
    title: "Regional Expansion",
    text: "Extended peace-building, research and M&E services across the Horn of Africa with donor partners.",
  },
  {
    year: "2024",
    title: "Digital M&E & Training Scale-up",
    text: "Launched digital dashboards and expanded structured training academies for public and NGO leaders.",
  },
  {
    year: "2025",
    title: "5,000+ Professionals Trained",
    text: "Surpassed 5,000 professionals trained and 40+ institutions supported across multiple sectors.",
  },
];
