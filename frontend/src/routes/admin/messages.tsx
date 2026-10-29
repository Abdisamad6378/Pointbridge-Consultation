import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi, type ContactMessage } from "@/lib/admin-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Admin" }] }),
  component: AdminMessagesPage,
});

function MessageCard({ item }: { item: ContactMessage }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (status: ContactMessage["status"]) => adminApi.updateContact(item.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Message updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteContact(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Message deleted");
    },
  });

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{item.subject}</CardTitle>
            <Badge variant={item.status === "new" ? "default" : "secondary"}>{item.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.name} · {item.email}
            {item.org ? ` · ${item.org}` : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={item.status} onValueChange={(v) => updateMutation.mutate(v as ContactMessage["status"])}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => deleteMutation.mutate()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{item.message}</p>
        <div className="mt-4 flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}>
              <Mail className="mr-2 h-4 w-4" />
              Reply by Email
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminMessagesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: adminApi.contacts,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <p className="mt-1 text-muted-foreground">All messages sent through the website contact form.</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Loading messages…</div>
      ) : data?.items.length ? (
        <div className="space-y-4">
          {data.items.map((item) => (
            <MessageCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No contact messages yet.
        </div>
      )}
    </div>
  );
}
