import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { fetchMe, getToken } from "@/lib/admin-api";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;

    if (!getToken()) {
      throw redirect({ to: "/admin/login" });
    }

    try {
      const { user } = await fetchMe();
      if (user.role !== "admin") {
        throw redirect({ to: "/" });
      }
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  return <AdminShell />;
}
