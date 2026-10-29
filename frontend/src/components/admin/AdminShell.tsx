import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bell,
  HelpCircle,
  Building2,
  ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  PanelLeft,
  PanelLeftClose,
  Search,
  Settings,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "pb-admin-sidebar-collapsed";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/testimonials", label: "Feedback", icon: MessageSquareQuote },
  { to: "/admin/team", label: "Leadership", icon: UserCircle2 },
  { to: "/admin/clients", label: "Client Logos", icon: Building2 },
  { to: "/admin/images", label: "Images", icon: ImageIcon },
  { to: "/admin/users", label: "Users", icon: Users },
] as const;

const bottomNavItems = [
  { to: "/admin/users", label: "Settings", icon: Settings },
  { href: "/contact", label: "Support", icon: HelpCircle },
] as const;

function NavItem({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        collapsed && "justify-center px-2",
        active
          ? "bg-secondary text-secondary-foreground shadow-sm"
          : "text-white/70 hover:bg-white/8 hover:text-white",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function BottomNavItem({
  item,
  collapsed,
  onClick,
}: {
  item: (typeof bottomNavItems)[number];
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const className = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/8 hover:text-white/90",
    collapsed && "justify-center px-2",
  );

  const content =
    "href" in item ? (
      <a href={item.href} className={className} onClick={onClick}>
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </a>
    ) : (
      <Link to={item.to} className={className} onClick={onClick}>
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD"
  );
}

export function AdminShell() {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const filteredNav = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return navItems;
    return navItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [search]);

  const sidebarContent = (isMobile = false) => (
    <>
      <div
        className={cn(
          "flex items-start border-b border-white/10 px-4 py-5",
          collapsed && !isMobile ? "flex-col items-center gap-3 px-2" : "justify-between gap-2",
        )}
      >
        <Link
          to="/admin"
          className={cn(
            "block min-w-0 transition-opacity hover:opacity-90",
            collapsed && !isMobile && "text-center",
          )}
        >
          {collapsed && !isMobile ? (
            <img
              src="/pointbridge-logo.png"
              alt="PointBridge"
              className="mx-auto h-9 w-9 object-contain brightness-0 invert"
            />
          ) : (
            <>
              <p className="text-lg font-bold tracking-tight text-white">PointBridge</p>
              <p className="mt-0.5 text-xs text-white/45">Control Center</p>
            </>
          )}
        </Link>

        {!isMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="shrink-0 rounded-lg p-1.5 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
              >
                {collapsed ? (
                  <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
                ) : (
                  <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.75} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {filteredNav.map((item) => {
          const active = pathname.startsWith(item.to);
          return (
            <NavItem
              key={item.to}
              item={item}
              active={active}
              collapsed={collapsed && !isMobile}
              onClick={isMobile ? () => setMobileOpen(false) : undefined}
            />
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-white/10 px-3 py-4">
        {bottomNavItems.map((item) => (
          <BottomNavItem
            key={item.label}
            item={item}
            collapsed={collapsed && !isMobile}
            onClick={isMobile ? () => setMobileOpen(false) : undefined}
          />
        ))}
      </div>
    </>
  );

  const roleLabel = user?.role === "admin" ? "Super Administrator" : "User";

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-dvh bg-[oklch(0.97_0.005_255)]">
        <div className="flex min-h-dvh">
          <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden shrink-0 flex-col overflow-hidden bg-[oklch(0.16_0.06_260)] text-white lg:flex"
          >
            {sidebarContent()}
          </motion.aside>

          {mobileOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[oklch(0.16_0.06_260)] text-white shadow-2xl lg:hidden"
              >
                <button
                  type="button"
                  className="absolute right-3 top-4 rounded-lg p-1 text-white/70 hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
                {sidebarContent(true)}
              </motion.aside>
            </>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-border/60 bg-white">
              <div className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden shrink-0 text-muted-foreground lg:inline-flex"
                  onClick={toggleCollapsed}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? (
                    <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  ) : (
                    <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <p className="hidden shrink-0 text-sm font-semibold text-foreground sm:block lg:text-base">
                  PointBridge Consulting
                </p>

                <div className="relative mx-auto hidden max-w-md flex-1 md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search systems..."
                    className="h-10 rounded-full border-border/60 bg-muted/40 pl-9 text-sm"
                  />
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" aria-label="Notifications">
                    <Bell className="h-[18px] w-[18px]" />
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                    <Link to="/admin" aria-label="Dashboard">
                      <LayoutGrid className="h-[18px] w-[18px]" />
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted/60 sm:gap-3 sm:pr-3"
                      >
                        <Avatar className="h-9 w-9 border border-border/60">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {getInitials(user?.name ?? "Admin")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden text-left sm:block">
                          <span className="block text-sm font-semibold leading-tight text-foreground">
                            {user?.name ?? "Admin User"}
                          </span>
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {roleLabel}
                          </span>
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/">View Website</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
