const LOGO_NAVBAR = "/pointbridge-logo.png";
const LOGO_FOOTER = "/pointbridge-logo-footer.png";

type LogoProps = {
  variant?: "navbar" | "footer";
  className?: string;
};

const variantStyles = {
  navbar:
    "h-10 w-auto max-h-10 min-w-[88px] max-w-[140px] object-contain object-left xs:h-11 xs:max-h-11 sm:h-12 sm:max-h-12 sm:max-w-[180px] lg:h-14 lg:max-h-14 lg:max-w-[200px] xl:h-16 xl:max-h-16 xl:max-w-[220px] 2xl:h-[72px] 2xl:max-h-[72px] 2xl:max-w-[240px]",
  footer:
    "h-11 w-auto max-h-11 max-w-[240px] object-contain object-left sm:h-12 sm:max-h-12 sm:max-w-[280px] md:max-w-[320px]",
} as const;

export function Logo({ variant = "navbar", className = "" }: LogoProps) {
  const isFooter = variant === "footer";

  return (
    <img
      src={isFooter ? LOGO_FOOTER : LOGO_NAVBAR}
      alt="PointBridge Consulting"
      className={`block shrink-0 transition-opacity duration-200 hover:opacity-85 ${variantStyles[variant]} ${className}`}
      width={isFooter ? 320 : 200}
      height={isFooter ? 48 : 72}
      decoding="async"
      fetchPriority={variant === "navbar" ? "high" : "auto"}
    />
  );
}
