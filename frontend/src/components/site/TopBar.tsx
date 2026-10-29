import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SocialLinks } from "./SocialLinks";

export function TopBar() {
  return (
    <>
      {/* Mobile + small tablet compact bar */}
      <div className="border-b border-white/10 bg-[oklch(0.42_0.12_230)] text-white md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2">
          <a
            href="tel:+252613685943"
            className="inline-flex min-w-0 items-center gap-1.5 truncate text-[11px] font-medium transition-colors hover:text-secondary"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">+252-613-685-943</span>
          </a>
          <SocialLinks variant="topbar" />
        </div>
      </div>

      {/* Tablet + desktop full bar */}
      <div className="hidden border-b border-white/10 bg-[oklch(0.42_0.12_230)] text-white md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:gap-x-5">
            <a href="tel:+252613685943" className="inline-flex items-center gap-1.5 transition-colors hover:text-secondary">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              +252-613-685-943
            </a>
            <a
              href="mailto:pointbridgeconsulting@gmail.com"
              className="hidden items-center gap-1.5 transition-colors hover:text-secondary lg:inline-flex"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              pointbridgeconsulting@gmail.com
            </a>
            <span className="hidden items-center gap-1.5 text-white/90 xl:inline-flex">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Sat–Thu: 8.00 to 17.00
            </span>
            <span className="hidden items-center gap-1.5 text-white/90 2xl:inline-flex">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Horn of Africa Region
            </span>
          </div>
          <SocialLinks variant="topbar" />
        </div>
      </div>
    </>
  );
}
