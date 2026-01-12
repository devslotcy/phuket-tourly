import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BlogPostWithDetails } from "@shared/schema";

export default function AdminBlog() {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery<BlogPostWithDetails[]>({
    queryKey: ["/api/blog"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post deleted" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete post", variant: "destructive" });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog content</p>
          </div>
          <Link href="/admin/blog/new">
            <Button className="gap-2" data-testid="button-add-blog">
              <Plus className="h-4 w-4" />
              Add Post
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => {
                  const enTrans = post.translations.find((t) => t.locale === "en");
                  return (
                    <TableRow key={post.id} data-testid={`row-blog-${post.id}`}>
                      <TableCell className="font-medium">
                        {enTrans?.title || "Untitled"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{post.slug}</TableCell>
                      <TableCell>
                        {post.published ? (
                          <Badge className="gap-1 bg-green-500">
                            <Eye className="h-3 w-3" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <EyeOff className="h-3 w-3" />
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/blog/${post.id}`}>
                            <Button size="icon" variant="ghost">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteId(post.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">No blog posts found</p>
            <Link href="/admin/blog/new">
              <Button>Add Your First Post</Button>
            </Link>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
