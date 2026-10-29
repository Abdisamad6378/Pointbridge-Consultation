import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  FileText,
  GraduationCap,
  Home,
  Info,
  Menu,
  MessageCircle,
  Newspaper,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { TopBar } from "./TopBar";
import { HeaderAuthActions, MobileAuthActions } from "./UserMenu";
import { aboutLinks, mainNav, serviceLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const navIcons: Record<string, LucideIcon> = {
  "/": Home,
  "/training": GraduationCap,
  "/projects": Calendar,
  "/publications": FileText,
  "/blog": Newspaper,
  "/contact": MessageCircle,
};

const navItemClass =
  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-1.5 py-2 text-xs font-medium transition-all duration-300 xl:px-2 xl:text-[13px] 2xl:gap-2 2xl:px-3 2xl:text-sm";

const navIconClass = "inline-flex h-3.5 w-3.5 shrink-0 opacity-80 xl:h-4 xl:w-4";

function NavLink({
  to,
  label,
  hash,
  active,
  onClick,
  icon: Icon,
}: {
  to: string;
  label: string;
  hash?: string;
  active?: boolean;
  onClick?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <Link
      to={to}
      hash={hash}
      onClick={onClick}
      className={cn(
        "relative",
        navItemClass,
        active
          ? "text-primary after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-secondary after:transition-all 2xl:after:left-3 2xl:after:right-3"
          : "text-foreground/80 hover:bg-primary/5 hover:text-primary hover:-translate-y-px",
      )}
    >
      {Icon && <Icon className={navIconClass} />}
      {label}
    </Link>
  );
}

const menuEase = [0.22, 1, 0.36, 1] as const;

const menuVariants: Variants = {
  closed: { opacity: 0, height: 0 },
  open: { opacity: 1, height: "auto", transition: { duration: 0.35, ease: menuEase } },
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: -16 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: menuEase },
  }),
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isAboutActive = pathname === "/about" || pathname === "/projects";
  const isServicesActive = pathname === "/services";

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <nav
        className={cn(
          "border-b border-border/60 bg-gradient-to-b from-white to-[oklch(0.98_0.005_255)] transition-shadow duration-500",
          scrolled && "nav-scrolled",
        )}
      >
        <div className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:min-h-[72px] sm:px-6 xl:min-h-[76px] xl:px-8">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center py-1 transition-transform duration-300 hover:scale-[1.02] hover:opacity-90"
            aria-label="PointBridge Consulting — Home"
          >
            <Logo variant="navbar" />
          </Link>

          {/* Desktop nav — xl+ only, single row, no wrap */}
          <div className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
            <ul className="flex flex-nowrap items-center justify-center gap-0.5 2xl:gap-1">
              <li>
                <NavLink to="/" label="Home" active={pathname === "/"} icon={Home} />
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      navItemClass,
                      "outline-none hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30",
                      isAboutActive ? "text-primary" : "text-foreground/80",
                    )}
                  >
                    <Info className={navIconClass} />
                    About
                    <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px] animate-in fade-in-0 zoom-in-95">
                    {aboutLinks.map((l) => (
                      <DropdownMenuItem key={l.label} asChild>
                        <Link to={l.to} hash={"hash" in l ? l.hash : undefined} className="cursor-pointer">
                          {l.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      navItemClass,
                      "outline-none hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30",
                      isServicesActive ? "text-primary" : "text-foreground/80",
                    )}
                  >
                    <Briefcase className={navIconClass} />
                    Services
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-[320px] min-w-[280px] overflow-y-auto animate-in fade-in-0 zoom-in-95">
                    {serviceLinks.map((l) => (
                      <DropdownMenuItem key={l.hash} asChild>
                        <Link to={l.to} hash={l.hash} className="cursor-pointer text-sm">
                          {l.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              {mainNav.slice(1).map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} label={l.label} active={pathname === l.to} icon={navIcons[l.to]} />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:gap-3 2xl:gap-4">
            <HeaderAuthActions />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 transition-transform duration-300 hover:scale-105 xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile + tablet menu */}
        <AnimatePresence>
          {open && (
            <>
              <motion.button
                type="button"
                aria-label="Close menu overlay"
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                className="relative z-50 overflow-hidden border-t border-border bg-background xl:hidden"
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
              >
                <ul className="max-h-[calc(100dvh-8rem)] space-y-1 overflow-y-auto px-4 py-4 pb-8">
                  <motion.li custom={0} variants={itemVariants} initial="closed" animate="open">
                    <Link
                      to="/"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                        pathname === "/"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted hover:translate-x-1",
                      )}
                    >
                      <Home className="h-4 w-4 shrink-0" /> Home
                    </Link>
                  </motion.li>

                  <motion.li custom={1} variants={itemVariants} initial="closed" animate="open">
                    <button
                      type="button"
                      onClick={() => setAboutOpen((v) => !v)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-muted"
                    >
                      <span className="flex items-center gap-3">
                        <Info className="h-4 w-4" /> About
                      </span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", aboutOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {aboutOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-4 mt-1 space-y-1 overflow-hidden border-l-2 border-primary/20 pl-4"
                        >
                          {aboutLinks.map((l) => (
                            <li key={l.label}>
                              <Link
                                to={l.to}
                                hash={"hash" in l ? l.hash : undefined}
                                onClick={() => setOpen(false)}
                                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>

                  <motion.li custom={2} variants={itemVariants} initial="closed" animate="open">
                    <button
                      type="button"
                      onClick={() => setServicesOpen((v) => !v)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-muted"
                    >
                      <span className="flex items-center gap-3">
                        <Briefcase className="h-4 w-4" /> Services
                      </span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", servicesOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-4 mt-1 max-h-52 space-y-1 overflow-y-auto overflow-x-hidden border-l-2 border-primary/20 pl-4"
                        >
                          {serviceLinks.map((l) => (
                            <li key={l.hash}>
                              <Link
                                to={l.to}
                                hash={l.hash}
                                onClick={() => setOpen(false)}
                                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>

                  {mainNav.slice(1).map((l, i) => {
                    const Icon = navIcons[l.to];
                    return (
                      <motion.li key={l.to} custom={i + 3} variants={itemVariants} initial="closed" animate="open">
                        <Link
                          to={l.to}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                            pathname === l.to
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted hover:translate-x-1",
                          )}
                        >
                          {Icon && <Icon className="h-4 w-4 shrink-0" />}
                          {l.label}
                        </Link>
                      </motion.li>
                    );
                  })}

                  <motion.li custom={10} variants={itemVariants} initial="closed" animate="open" className="pt-4 md:hidden">
                    <MobileAuthActions onNavigate={() => setOpen(false)} />
                  </motion.li>

                  <motion.li custom={11} variants={itemVariants} initial="closed" animate="open" className="flex justify-center pt-4">
                    <SocialLinks variant="footer" />
                  </motion.li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
