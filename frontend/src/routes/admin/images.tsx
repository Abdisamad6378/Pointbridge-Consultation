import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi, type SiteImage } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/images")({
  head: () => ({ meta: [{ title: "Images — Admin" }] }),
  component: AdminImagesPage,
});

function ImageCard({ item }: { item: SiteImage }) {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState(item.label);
  const [url, setUrl] = useState(item.url);
  const [category, setCategory] = useState(item.category);

  const saveMutation = useMutation({
    mutationFn: () => adminApi.updateImage(item.id, { label, url, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-images"] });
      toast.success("Image updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteImage(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-images"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Image removed");
    },
  });

  return (
    <Card className="overflow-hidden border-border/60">
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative aspect-[4/3] bg-muted md:aspect-auto md:min-h-[180px]">
          <img src={url} alt={label} className="h-full w-full object-cover" />
        </div>
        <div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">{item.key}</CardTitle>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate()}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div>
              <Label>Label</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://... or /path.png" />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              Save image
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

function AdminImagesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("other");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-images"],
    queryFn: adminApi.images,
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createImage({ key, label, url, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-images"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setKey("");
      setLabel("");
      setUrl("");
      setCategory("other");
      setShowForm(false);
      toast.success("Image added");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not add image"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Website Images</h2>
          <p className="mt-1 text-muted-foreground">
            Update image links used across the website. Paste a direct URL or a public path like `/pointbridge-logo.png`.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              New Image
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Unique key (e.g. blog.my-post)" value={key} onChange={(e) => setKey(e.target.value)} />
            <Input placeholder="Category (hero, blog, logo…)" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} className="sm:col-span-2" />
            <Input placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} className="sm:col-span-2" />
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Save image
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Loading images…</div>
      ) : (
        <div className="grid gap-4">
          {data?.items.map((item) => (
            <ImageCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
