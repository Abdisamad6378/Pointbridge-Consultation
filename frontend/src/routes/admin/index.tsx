import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Download,
  ImageIcon,
  Mail,
  MessageSquareQuote,
  Server,
  UserPlus,
  Users,
} from "lucide-react";
import { adminApi, type AdminUser, type ContactMessage } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — PointBridge" }] }),
  component: AdminDashboard,
});

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "green" | "blue" | "amber" | "violet";
  icon: typeof Mail;
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function buildActivity(contacts: ContactMessage[], users: AdminUser[]): ActivityItem[] {
  const items: ActivityItem[] = [];

  contacts.slice(0, 3).forEach((contact) => {
    items.push({
      id: `contact-${contact.id}`,
      title: contact.status === "new" ? "New contact message" : "Message updated",
      description: `${contact.name} — ${contact.subject}`,
      time: contact.createdAt,
      tone: contact.status === "new" ? "green" : "blue",
      icon: Mail,
    });
  });

  users.slice(0, 2).forEach((user) => {
    items.push({
      id: `user-${user.id}`,
      title: "New user registered",
      description: `${user.name} joined as ${user.role}`,
      time: user.createdAt,
      tone: "violet",
      icon: UserPlus,
    });
  });

  return items
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);
}

const toneStyles = {
  green: "bg-secondary/15 text-secondary",
  blue: "bg-primary/10 text-primary",
  amber: "bg-amber-500/15 text-amber-600",
  violet: "bg-violet-500/15 text-violet-600",
};

function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  to,
  index,
}: {
  title: string;
  value: number;
  trend: string;
  icon: typeof Mail;
  to: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Card className="border-border/50 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="rounded-lg bg-secondary/15 p-2 text-secondary">
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
          <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          <Link
            to={to}
            className="mt-4 inline-flex items-center text-xs font-semibold text-primary hover:underline"
          >
            Manage
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AdminDashboard() {
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.stats,
  });

  const contactsQuery = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: adminApi.contacts,
  });

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminApi.users,
  });

  const isLoading = statsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const data = statsQuery.data;
  const activity = buildActivity(contactsQuery.data?.items ?? [], usersQuery.data?.items ?? []);

  const newMessages = data?.contacts.new ?? 0;
  const pendingFeedback = data?.testimonials.pending ?? 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Real-time system performance and user engagement metrics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full border-border/60 bg-white">
            Last 30 Days
          </Button>
          <Button size="sm" className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Contact Messages"
          value={data?.contacts.total ?? 0}
          trend={newMessages > 0 ? `+${newMessages} new this week` : "No new messages"}
          icon={Mail}
          to="/admin/messages"
          index={0}
        />
        <StatCard
          title="Feedback"
          value={data?.testimonials.total ?? 0}
          trend={pendingFeedback > 0 ? `${pendingFeedback} pending approval` : "Stable engagement"}
          icon={MessageSquareQuote}
          to="/admin/testimonials"
          index={1}
        />
        <StatCard
          title="Site Images"
          value={data?.images.total ?? 0}
          trend="Optimized library"
          icon={ImageIcon}
          to="/admin/images"
          index={2}
        />
        <StatCard
          title="Users"
          value={data?.users.total ?? 0}
          trend={`${data?.users.total ?? 0} registered accounts`}
          icon={Users}
          to="/admin/users"
          index={3}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <Card className="border-border/50 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Recent System Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 pb-6">
              {activity.length ? (
                activity.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-muted/40",
                        index !== activity.length - 1 && "border-b border-border/40",
                      )}
                    >
                      <div className={cn("mt-0.5 rounded-full p-2.5", toneStyles[item.tone])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(item.time)}</span>
                    </div>
                  );
                })
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No recent activity yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <Card className="overflow-hidden border-0 bg-[oklch(0.16_0.06_260)] text-white shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-lg text-white">System Health</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-60" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
                  </span>
                  <p className="text-sm font-semibold tracking-wide text-secondary">ALL SYSTEMS NOMINAL</p>
                </div>
                <p className="mt-3 text-sm text-white/60">
                  API, database and admin services are running normally.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 w-full rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  View Infrastructure Logs
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
            <Card className="overflow-hidden border-border/50 bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent p-6">
                  <div className="mb-4 flex h-24 items-center justify-center rounded-xl bg-white/80 shadow-inner">
                    <BarChart3 className="h-14 w-14 text-primary/70" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">New Analytics Module</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Track engagement trends and export insights from your admin panel.
                  </p>
                  <Button asChild variant="link" className="mt-2 h-auto px-0 text-primary">
                    <Link to="/admin/messages">Learn More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
