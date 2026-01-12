import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Review } from "@shared/schema";

interface ReviewFormData {
  name: string;
  rating: number;
  textEn: string;
  textTr: string;
  source: string;
  avatarUrl: string;
}

export default function AdminReviews() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const form = useForm<ReviewFormData>({
    defaultValues: {
      name: "",
      rating: 5,
      textEn: "",
      textTr: "",
      source: "",
      avatarUrl: "",
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      if (editingReview) {
        await apiRequest("PUT", `/api/admin/reviews/${editingReview.id}`, data);
      } else {
        await apiRequest("POST", "/api/admin/reviews", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: editingReview ? "Review updated" : "Review created" });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Failed to save review", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review deleted" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete review", variant: "destructive" });
    },
  });

  const openDialog = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      form.reset({
        name: review.name,
        rating: review.rating,
        textEn: review.textEn,
        textTr: review.textTr,
        source: review.source || "",
        avatarUrl: review.avatarUrl || "",
      });
    } else {
      setEditingReview(null);
      form.reset({ name: "", rating: 5, textEn: "", textTr: "", source: "", avatarUrl: "" });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingReview(null);
    form.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reviews</h1>
            <p className="text-muted-foreground">Manage customer reviews</p>
          </div>
          <Button className="gap-2" onClick={() => openDialog()} data-testid="button-add-review">
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id} data-testid={`row-review-${review.id}`}>
                    <TableCell className="font-medium">{review.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{review.source || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openDialog(review)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteId(review.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">No reviews found</p>
            <Button onClick={() => openDialog()}>Add Your First Review</Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingReview ? "Edit Review" : "New Review"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rating" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="textEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Text (English)</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="textTr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Text (Turkish)</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="source" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source (e.g., TripAdvisor)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingReview ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review?
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
