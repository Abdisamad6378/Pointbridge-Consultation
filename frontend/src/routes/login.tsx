import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthField, AuthLayout } from "@/components/site/AuthLayout";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign In — PointBridge Consulting" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);
    try {
      const user = await login(String(data.email), String(data.password));
      toast.success(`Welcome back, ${user.name}!`);
      navigate({ to: user.role === "admin" ? "/admin" : "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back. Sign in to your PointBridge account."
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLabel="Sign Up"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <AuthField id="email" label="Email" type="email" autoComplete="email" />
        <AuthField id="password" label="Password" type="password" autoComplete="current-password" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-border" />
            Remember me
          </label>
          <Link to="/contact" className="text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
}
