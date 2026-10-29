import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi, type ClientLogo } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/clients")({
  head: () => ({ meta: [{ title: "Client Logos — Admin" }] }),
  component: AdminClientsPage,
});

function ClientCard({ item }: { item: ClientLogo }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(item.name);
  const [logo, setLogo] = useState(item.logo ?? "");
  const [sortOrder, setSortOrder] = useState(String(item.sortOrder));

  const saveMutation = useMutation({
    mutationFn: () =>
      adminApi.updateClient(item.id, {
        name,
        logo: logo.trim() || null,
        sortOrder: Number(sortOrder) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["site-clients"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Client updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteClient(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["site-clients"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Client removed");
    },
  });

  return (
    <Card className="overflow-hidden border-border/60">
      <div className="grid md:grid-cols-[180px_1fr]">
        <div className="flex items-center justify-center bg-[oklch(0.18_0.07_260)] p-6 md:min-h-[160px]">
          {logo ? (
            <img src={logo} alt={name} className="max-h-14 w-full object-contain brightness-0 invert" />
          ) : (
            <span className="text-center text-sm font-semibold text-white">{name}</span>
          )}
        </div>
        <div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <CardTitle className="text-base">{name}</CardTitle>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate()}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div>
              <Label htmlFor={`name-${item.id}`}>Client name</Label>
              <Input id={`name-${item.id}`} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor={`logo-${item.id}`}>Logo image URL</Label>
              <Input
                id={`logo-${item.id}`}
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://... or /logos/un.png"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Use a PNG/SVG with transparent background. Shown white on the homepage.
              </p>
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

function AdminClientsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: adminApi.clients,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      adminApi.createClient({
        name,
        logo: logo.trim() || null,
        sortOrder: Number(sortOrder) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["site-clients"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setName("");
      setLogo("");
      setSortOrder("0");
      setShowForm(false);
      toast.success("Client added");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Client Logos</h2>
          <p className="mt-1 text-muted-foreground">
            Manage partner logos shown in the &quot;Some Of Our Clients&quot; section on the homepage.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          Add client
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              New client
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Client name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              placeholder="Logo URL (https://... or /logos/name.png)"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
            <Input
              type="number"
              min={0}
              placeholder="Display order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <Button className="sm:col-start-2" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Save client
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Loading clients…</div>
      ) : (
        <div className="grid gap-4">
          {data?.items.map((item) => (
            <ClientCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
