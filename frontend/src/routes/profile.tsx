import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, KeyRound, Loader2, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PasswordField } from "@/components/admin/PasswordField";
import { UserAvatar, useAvatarPicker } from "@/components/site/UserMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordRequest } from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "My Profile — PointBridge Consulting" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const photo = useAvatarPicker();

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setOrganization(user.organization);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const profileChanged = name.trim() !== user.name || organization.trim() !== user.organization;

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), organization: organization.trim() });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      await changePasswordRequest({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <section className="bg-[oklch(0.98_0.005_255)] px-4 py-12 sm:py-16">
      <div className="mx-auto grid max-w-3xl gap-6">
        {photo.input}
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <UserAvatar user={user} busy={photo.busy} className="h-24 w-24 text-4xl" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold tracking-tight">{user.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Button size="sm" className="rounded-full" onClick={photo.choose} disabled={photo.busy}>
                <Camera className="mr-1.5 h-4 w-4" />
                {user.avatarUrl ? "Change photo" : "Upload photo"}
              </Button>
              {user.avatarUrl && (
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => void photo.remove()} disabled={photo.busy}>
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Any common image format. Cropped to a square automatically.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserRound className="h-5 w-5" />
              Personal details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-org">Organization</Label>
                <Input id="profile-org" value={organization} onChange={(e) => setOrganization(e.target.value)} maxLength={200} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={user.email} disabled />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="rounded-full" disabled={saving || !profileChanged}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5" />
              Change password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={savePassword} className="grid gap-4 sm:grid-cols-2">
              <PasswordField
                id="current-password"
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                required
                className="sm:col-span-2"
              />
              <PasswordField id="new-password" label="New password" value={newPassword} onChange={setNewPassword} hint="At least 8 characters" required />
              <PasswordField id="confirm-password" label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} required />
              <div className="sm:col-span-2">
                <Button type="submit" variant="outline" className="rounded-full" disabled={changingPassword || !currentPassword || !newPassword}>
                  {changingPassword ? "Updating…" : "Update password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
