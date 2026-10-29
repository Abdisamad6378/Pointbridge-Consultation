import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { PasswordField } from "@/components/admin/PasswordField";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { forgotPasswordRequest } from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Reset Password — PointBridge Consulting" }],
  }),
  component: ForgotPasswordPage,
});

const CODE_TTL_SECONDS = 10 * 60;
const RESEND_AFTER_SECONDS = 60;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!sentAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [sentAt]);

  const elapsed = sentAt ? Math.floor((now - sentAt) / 1000) : 0;
  const expiresIn = Math.max(0, CODE_TTL_SECONDS - elapsed);
  const resendIn = Math.max(0, RESEND_AFTER_SECONDS - elapsed);

  const sendCode = async () => {
    setSending(true);
    try {
      const result = await forgotPasswordRequest(email.trim());
      toast.success(result.message);
      setCode("");
      setSentAt(Date.now());
      setNow(Date.now());
      setStep("code");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the code");
    } finally {
      setSending(false);
    }
  };

  const onRequest = (e: React.FormEvent) => {
    e.preventDefault();
    void sendCode();
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code from the email");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setResetting(true);
    try {
      const user = await resetPassword({ email: email.trim(), code, newPassword });
      toast.success(`Password updated. Welcome back, ${user.name}!`);
      navigate({ to: user.role === "admin" ? "/admin" : "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reset password");
      setCode("");
    } finally {
      setResetting(false);
    }
  };

  return (
    <AuthLayout
      title={step === "email" ? "Forgot password?" : "Enter your code"}
      subtitle={
        step === "email"
          ? "Enter your account email and we'll send you a 6-digit code to reset your password."
          : `We sent a 6-digit code to ${email}. Enter it below with your new password.`
      }
      footerText="Remembered it?"
      footerLink="/login"
      footerLabel="Back to Sign In"
    >
      {step === "email" ? (
        <form onSubmit={onRequest} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={sending || !email.trim()}>
            <Mail className="mr-1.5 h-4 w-4" />
            {sending ? "Sending code…" : "Send code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={onReset} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="reset-code">Verification code</Label>
            <InputOTP
              id="reset-code"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={setCode}
              autoComplete="one-time-code"
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-12 w-11 text-lg" />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <p className={`text-center text-xs ${expiresIn === 0 ? "text-destructive" : "text-muted-foreground"}`}>
              {expiresIn > 0 ? `Code expires in ${formatTime(expiresIn)}` : "This code has expired. Request a new one."}
            </p>
          </div>

          <PasswordField
            id="reset-new-password"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            hint="At least 8 characters"
            required
          />
          <PasswordField
            id="reset-confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />

          <Button type="submit" className="w-full rounded-full" disabled={resetting || expiresIn === 0}>
            {resetting ? "Updating password…" : "Reset password"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => setStep("email")}
            >
              <ArrowLeft className="h-4 w-4" /> Change email
            </button>
            <button
              type="button"
              className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
              disabled={resendIn > 0 || sending}
              onClick={() => void sendCode()}
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : sending ? "Sending…" : "Resend code"}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
