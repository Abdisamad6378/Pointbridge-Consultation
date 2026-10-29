import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi, type Testimonial } from "@/lib/admin-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({ meta: [{ title: "Feedback — Admin" }] }),
  component: AdminTestimonialsPage,
});

function TestimonialCard({ item }: { item: Testimonial }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(item.name);
  const [role, setRole] = useState(item.role);
  const [quote, setQuote] = useState(item.quote);
  const [image, setImage] = useState(item.image ?? "");
  const [approved, setApproved] = useState(item.approved);

  const saveMutation = useMutation({
    mutationFn: () =>
      adminApi.updateTestimonial(item.id, {
        name,
        role,
        quote,
        image: image.trim() || null,
        approved,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["site-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Feedback updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteTestimonial(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["site-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Feedback deleted");
    },
  });

  return (
    <Card className="overflow-hidden border-border/60">
      <div className="grid md:grid-cols-[140px_1fr]">
        <div className="flex items-center justify-center bg-muted p-6 md:min-h-[200px]">
          <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-secondary/20">
            {image ? (
              <img src={image} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                No photo
              </div>
            )}
          </div>
        </div>
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{item.name}</CardTitle>
              <Badge variant={approved ? "default" : "secondary"}>{approved ? "Approved" : "Pending"}</Badge>
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
              <Label htmlFor={`image-${item.id}`}>Profile image URL</Label>
              <Input
                id={`image-${item.id}`}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... or /path.jpg"
              />
            </div>
            <div>
              <Label htmlFor={`quote-${item.id}`}>Quote</Label>
              <Textarea id={`quote-${item.id}`} rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Show on website</p>
                <p className="text-xs text-muted-foreground">Approved feedback appears on the homepage.</p>
              </div>
              <Switch checked={approved} onCheckedChange={setApproved} />
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

function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: adminApi.testimonials,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      adminApi.createTestimonial({
        name,
        role,
        quote,
        image: image.trim() || null,
        approved: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["site-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setName("");
      setRole("");
      setQuote("");
      setImage("");
      setShowForm(false);
      toast.success("Feedback added");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Customer Feedback</h2>
          <p className="mt-1 text-muted-foreground">
            Manage client testimonials — names, titles, photos and quotes on the homepage.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Feedback
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Feedback</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Title / Organization" value={role} onChange={(e) => setRole(e.target.value)} />
            <Input
              className="sm:col-span-2"
              placeholder="Profile image URL (https://... or /path.jpg)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Textarea
              className="sm:col-span-2"
              placeholder="Quote"
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
            <Button className="sm:col-start-2" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Save feedback
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Loading feedback…</div>
      ) : (
        <div className="grid gap-4">
          {data?.items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
