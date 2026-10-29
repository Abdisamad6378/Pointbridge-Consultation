import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthField, AuthLayout } from "@/components/site/AuthLayout";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Sign Up — PointBridge Consulting" }],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (String(data.password).length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (String(data.password) !== String(data.confirm)) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const user = await signup({
        name: String(data.name),
        email: String(data.email),
        password: String(data.password),
        organization: String(data.organization ?? "").trim() || undefined,
      });
      toast.success(`Account created. Welcome, ${user.name}!`);
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join PointBridge to access training, resources and updates."
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Sign In"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <AuthField id="name" label="Full name" autoComplete="name" />
        <AuthField id="email" label="Email" type="email" autoComplete="email" />
        <AuthField id="organization" label="Organization" required={false} />
        <AuthField id="password" label="Password" type="password" autoComplete="new-password" />
        <AuthField id="confirm" label="Confirm password" type="password" autoComplete="new-password" />
        <Button type="submit" className="w-full rounded-full bg-primary" disabled={loading}>
          {loading ? "Creating account…" : "Sign Up"}
        </Button>
      </form>
    </AuthLayout>
  );
}
