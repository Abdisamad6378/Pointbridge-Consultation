import { Link } from "@tanstack/react-router";
import { ArrowUp, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import {
  companyEmails,
  companyEstablished,
  companyName,
  companyPhone,
  companyRegion,
  companySlogan,
  companyWebsite,
  companyWebsiteDisplay,
} from "@/lib/company-profile";

const linkClass = "text-white/75 transition-colors hover:text-secondary";
const headingClass = "text-sm font-bold uppercase tracking-wider text-secondary";

export function Footer() {
  return (
    <footer className="bg-[oklch(0.18_0.07_260)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block" aria-label="PointBridge Consulting — Home">
              <Logo variant="footer" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">
              {companySlogan}
            </p>
            <p className="mt-2 text-xs text-white/55">Est. {companyEstablished} · {companyName}</p>
            <SocialLinks variant="footer" className="mt-6" />
          </div>

          <div>
            <h4 className={headingClass}>Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" className={linkClass}>Home</Link></li>
              <li><Link to="/about" className={linkClass}>About Us</Link></li>
              <li><Link to="/services" className={linkClass}>Services</Link></li>
              <li><Link to="/contact" className={linkClass}>Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Our Services</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/services" hash="strategic-policy-governance" className={linkClass}>Strategic Policy</Link></li>
              <li><Link to="/services" hash="business-development" className={linkClass}>Business Development</Link></li>
              <li><Link to="/services" hash="research-analytics" className={linkClass}>Research & Analysis</Link></li>
              <li><Link to="/training" className={linkClass}>Training</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Contact Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                {companyRegion}
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href="tel:+252613685943" className="hover:text-secondary transition-colors">{companyPhone}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href={`mailto:${companyEmails.general}`} className="hover:text-secondary transition-colors break-all">
                  {companyEmails.general}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href={`mailto:${companyEmails.direct}`} className="hover:text-secondary transition-colors break-all">
                  {companyEmails.direct}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a
                  href={companyWebsite}
                  className="hover:text-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {companyWebsiteDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/60 sm:flex-row">
            <p className="text-white/70">© {new Date().getFullYear()} PointBridge Consulting. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link to="/contact" className={linkClass}>Privacy Policy</Link>
              <Link to="/contact" className={linkClass}>Terms of Services</Link>
              <Link to="/contact" className={linkClass}>Cookie Policy</Link>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 text-white/75 transition-colors hover:text-secondary"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
