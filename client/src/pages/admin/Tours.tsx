import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, Star, TrendingUp } from "lucide-react";
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
import type { TourWithDetails } from "@shared/schema";

export default function AdminTours() {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: tours, isLoading } = useQuery<TourWithDetails[]>({
    queryKey: ["/api/tours"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/tours/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({ title: "Tour deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete tour", variant: "destructive" });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tours</h1>
            <p className="text-muted-foreground">Manage your tour offerings</p>
          </div>
          <Link href="/admin/tours/new">
            <Button className="gap-2" data-testid="button-add-tour">
              <Plus className="h-4 w-4" />
              Add Tour
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : tours && tours.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tours.map((tour) => {
                  const enTranslation = tour.translations.find((t) => t.locale === "en");
                  return (
                    <TableRow key={tour.id} data-testid={`row-tour-${tour.id}`}>
                      <TableCell className="font-medium">
                        {enTranslation?.title || "Untitled"}
                      </TableCell>
                      <TableCell>
                        {tour.category?.nameEn || "-"}
                      </TableCell>
                      <TableCell>${tour.priceFrom}</TableCell>
                      <TableCell>{tour.duration}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {tour.featured && (
                            <Badge variant="default" className="gap-1">
                              <Star className="h-3 w-3" />
                              Featured
                            </Badge>
                          )}
                          {tour.popular && (
                            <Badge variant="secondary" className="gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Popular
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/tours/${tour.id}`}>
                            <Button size="icon" variant="ghost" data-testid={`button-edit-tour-${tour.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteId(tour.id)}
                            data-testid={`button-delete-tour-${tour.id}`}
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
            <p className="text-muted-foreground mb-4">No tours found</p>
            <Link href="/admin/tours/new">
              <Button data-testid="button-add-first-tour">Add Your First Tour</Button>
            </Link>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tour</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tour? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
