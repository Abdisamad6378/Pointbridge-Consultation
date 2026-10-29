import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { adminApi, type TeamMember } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/team")({
  head: () => ({ meta: [{ title: "Leadership Team — Admin" }] }),
  component: AdminTeamPage,
});

function TeamMemberCard({ item }: { item: TeamMember }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(item.name);
  const [role, setRole] = useState(item.role);
  const [bio, setBio] = useState(item.bio);
  const [image, setImage] = useState(item.image);
  const [sortOrder, setSortOrder] = useState(String(item.sortOrder));

  const saveMutation = useMutation({
    mutationFn: () =>
      adminApi.updateTeamMember(item.id, {
        name,
        role,
        bio,
        image,
        sortOrder: Number(sortOrder) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["site-team"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Team member updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteTeamMember(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["site-team"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Team member removed");
    },
  });

  return (
    <Card className="overflow-hidden border-border/60">
      <div className="grid md:grid-cols-[200px_1fr]">
        <div className="relative aspect-square bg-muted md:aspect-auto md:min-h-[220px]">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate()}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label htmlFor={`name-${item.id}`}>Name</Label>
                <Input id={`name-${item.id}`} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor={`role-${item.id}`}>Title / Role</Label>
                <Input id={`role-${item.id}`} value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor={`image-${item.id}`}>Image URL</Label>
              <Input
                id={`image-${item.id}`}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... or /path.jpg"
              />
            </div>
            <div>
              <Label htmlFor={`bio-${item.id}`}>Description</Label>
              <Textarea id={`bio-${item.id}`} rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="max-w-[140px]">
              <Label htmlFor={`sort-${item.id}`}>Display order</Label>
              <Input
                id={`sort-${item.id}`}
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              Save changes
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

function AdminTeamPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: adminApi.team,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      adminApi.createTeamMember({
        name,
        role,
        bio,
        image,
        sortOrder: Number(sortOrder) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["site-team"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setName("");
      setRole("");
      setBio("");
      setImage("");
      setSortOrder("0");
      setShowForm(false);
      toast.success("Team member added");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Leadership Team</h2>
          <p className="mt-1 text-muted-foreground">
            Edit names, titles, photos and descriptions shown on the About page.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          Add member
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              New team member
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Title / Role" value={role} onChange={(e) => setRole(e.target.value)} />
            <Input
              className="sm:col-span-2"
              placeholder="Image URL (https://... or /path.jpg)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Textarea
              className="sm:col-span-2"
              placeholder="Description"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <Input
              type="number"
              min={0}
              placeholder="Display order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <Button className="sm:col-start-2" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Save member
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Loading team…</div>
      ) : (
        <div className="grid gap-4">
          {data?.items.map((item) => (
            <TeamMemberCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
