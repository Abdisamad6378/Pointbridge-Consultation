import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/site/Logo";
import { images } from "@/lib/images";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLabel: string;
};

export function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLabel,
}: AuthLayoutProps) {
  return (
    <section className="min-h-[calc(100dvh-80px)] bg-[oklch(0.98_0.005_255)]">
      <div className="mx-auto grid max-w-6xl lg:grid-cols-2 lg:min-h-[calc(100dvh-80px)]">
        <div className="relative hidden overflow-hidden lg:block">
          <img src={images.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.18_0.07_260/0.92)] to-[oklch(0.48_0.18_256/0.75)]" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Logo variant="footer" />
            <div>
              <h2 className="text-3xl font-bold leading-tight">PointBridge Consulting</h2>
              <p className="mt-3 max-w-sm text-white/85 leading-relaxed">
                Access training resources, publications and client portal features.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Logo variant="navbar" className="mx-auto" />
            </div>
            <Card className="border-border/60 shadow-elegant">
              <CardContent className="p-6 sm:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                <div className="mt-8">{children}</div>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  {footerText}{" "}
                  <Link to={footerLink} className="font-semibold text-primary hover:underline">
                    {footerLabel}
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} autoComplete={autoComplete} required={required} />
    </div>
  );
}
