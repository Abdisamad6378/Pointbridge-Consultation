/** Official company profile content — PointBridge Consulting (2025). */

export const companyName = "PointBridge Consulting";

export const companyEstablished = "2019";

export const companyWebsite = "https://pointbridgeconsulting.com";

export const companyWebsiteDisplay = "www.pointbridgeconsulting.com";

export const companySlogan =
  "Delivering rigorous, actionable insights in complex and fragile settings.";

export const companyTagline = "Independent Advisory & Evaluation Firm";

export const companyEmails = {
  general: "pointbridgeconsulting@gmail.com",
  direct: "keynan@pointbridgeconsulting.com",
} as const;

export const companyPhone = "+252-613-685-943";

export const companyRegion = "Horn of Africa Region";

export const companyHours = "Sat–Thu: 8.00 to 17.00";

export const contactDetails = [
  { label: "Company", value: companyName },
  { label: "Est.", value: companyEstablished },
  { label: "Website", value: companyWebsiteDisplay, href: companyWebsite },
  { label: "Email", value: companyEmails.general, href: `mailto:${companyEmails.general}` },
  { label: "Email", value: companyEmails.direct, href: `mailto:${companyEmails.direct}` },
] as const;

export const companySummary =
  "PointBridge Consulting is an independent evaluation and advisory firm founded in 2019. We work with UN agencies, international NGOs, bilateral donors, and foundations to deliver rigorous, actionable evaluations in complex and fragile settings.";

export const companyAboutParagraphs = [
  companySummary,
  "We specialize in humanitarian development, peace-building programmes, and strategic advisory services across East Africa and beyond — helping partners strengthen institutions, generate evidence, and achieve measurable impact.",
  "Over the years, we have delivered more than 80 HR systems (including recruitment services), trained 5,000+ professionals, and supported 40+ institutions across governance, humanitarian response, health, education, and economic development.",
  "What sets us apart is our commitment to context-sensitivity, local ownership, and sustainable capacity development. Every engagement is tailored to the unique realities of the communities we serve.",
] as const;

export const trainingIntro =
  "PointBridge Consulting delivers structured training programmes across our specialized academies — spanning strategy, economics, finance, marketing, and leadership. Each programme blends practical workshops with clear curriculum frameworks, enabling organizations to build lasting internal capacity and measurable skills at every level.";

export const servicesIntro =
  "Our core service areas span policy and governance, peace-building, audit and risk, human capital, research, monitoring and evaluation, and business development — complemented by education, environmental, hospitality, and ICT solutions.";
