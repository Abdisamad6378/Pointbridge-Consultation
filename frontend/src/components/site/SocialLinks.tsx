import { Facebook, Linkedin } from "lucide-react";

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/pointbridgeconsulting",
    icon: Facebook,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/pointbridge-consulting",
    icon: Linkedin,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@pointbridgeconsulting",
    icon: null,
  },
] as const;

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.76 1.52V6.76a4.85 4.85 0 0 1-1.09-.07z" />
    </svg>
  );
}

type SocialLinksProps = {
  variant?: "topbar" | "footer";
  className?: string;
};

export function SocialLinks({ variant = "topbar", className = "" }: SocialLinksProps) {
  const size = variant === "topbar" ? "h-4 w-4" : "h-5 w-5";
  const btnClass =
    variant === "topbar"
      ? "flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white"
      : "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:border-secondary/50 hover:bg-white/15 hover:text-secondary";

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {socialLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className={btnClass}
        >
          {s.icon ? <s.icon className={size} /> : <TikTokIcon className={size} />}
        </a>
      ))}
    </div>
  );
}
