import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PasswordField } from "@/components/admin/PasswordField";
import { adminApi, type AdminUser } from "@/lib/admin-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: AdminUsersPage,
});

function UserCard({ item }: { item: AdminUser }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(item.name);
  const [role, setRole] = useState<"admin" | "user">(item.role as "admin" | "user");
  const [password, setPassword] = useState("");

  const saveMutation = useMutation({
    mutationFn: () =>
      adminApi.updateUser(item.id, {
        name,
        role,
        ...(password ? { password } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setPassword("");
      toast.success("User updated successfully");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update user"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteUser(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("User deleted");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete user"),
  });

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm transition-all duration-300 hover:shadow-elegant">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 bg-muted/30 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{item.name}</CardTitle>
            <Badge variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>
          </div>
          <CardDescription className="mt-1">{item.email}</CardDescription>
          <p className="mt-1 text-xs text-muted-foreground">
            Joined {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => deleteMutation.mutate()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
        <div>
          <Label htmlFor={`name-${item.id}`}>Full name</Label>
          <Input id={`name-${item.id}`} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as "admin" | "user")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <PasswordField
          id={`password-${item.id}`}
          label="New password"
          value={password}
          onChange={setPassword}
          placeholder="Enter new password to change"
          hint="Stored passwords are encrypted. Set a new password here to update — use the eye icon to show/hide."
          className="sm:col-span-2"
        />
        <div className="sm:col-span-2">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !name.trim()}
            className="rounded-full px-6"
          >
            {saveMutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminApi.users,
  });

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    createMutation.mutate();
  };

  const createMutation = useMutation({
    mutationFn: () => adminApi.createUser({ name: name.trim(), email: email.trim().toLowerCase(), password, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setShowForm(false);
      toast.success("User created successfully");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not create user"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="mt-1 text-muted-foreground">Create and manage accounts stored in PostgreSQL.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="border-b border-border/60 bg-primary/5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="h-5 w-5 text-primary" />
              Create New User
            </CardTitle>
            <CardDescription>Fill in the details below. Password must be at least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="new-name">Full name</Label>
              <Input id="new-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                placeholder="user@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <PasswordField
              id="new-password"
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Minimum 8 characters"
              hint="Use the eye icon to show or hide the password while typing."
              required
              className="sm:col-span-2"
            />
            <div>
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "admin" | "user")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 sm:col-span-2">
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="rounded-full px-6"
              >
                {createMutation.isPending ? "Creating…" : "Create user"}
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Loading users…</div>
      ) : data?.items.length ? (
        <div className="grid gap-4">
          {data.items.map((item) => (
            <UserCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No users yet. Click &quot;Add User&quot; to create one.
        </div>
      )}
    </div>
  );
}
