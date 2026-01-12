import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import type { FAQ } from "@shared/schema";

interface FAQFormData {
  questionEn: string;
  answerEn: string;
  questionTr: string;
  answerTr: string;
  sortOrder: number;
}

export default function AdminFAQs() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: faqs, isLoading } = useQuery<FAQ[]>({
    queryKey: ["/api/faqs"],
  });

  const form = useForm<FAQFormData>({
    defaultValues: {
      questionEn: "",
      answerEn: "",
      questionTr: "",
      answerTr: "",
      sortOrder: 0,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: FAQFormData) => {
      if (editingFaq) {
        await apiRequest("PUT", `/api/admin/faqs/${editingFaq.id}`, data);
      } else {
        await apiRequest("POST", "/api/admin/faqs", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({ title: editingFaq ? "FAQ updated" : "FAQ created" });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Failed to save FAQ", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/faqs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({ title: "FAQ deleted" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete FAQ", variant: "destructive" });
    },
  });

  const openDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      form.reset({
        questionEn: faq.questionEn,
        answerEn: faq.answerEn,
        questionTr: faq.questionTr,
        answerTr: faq.answerTr,
        sortOrder: faq.sortOrder || 0,
      });
    } else {
      setEditingFaq(null);
      form.reset({ questionEn: "", answerEn: "", questionTr: "", answerTr: "", sortOrder: 0 });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingFaq(null);
    form.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">FAQs</h1>
            <p className="text-muted-foreground">Manage frequently asked questions</p>
          </div>
          <Button className="gap-2" onClick={() => openDialog()} data-testid="button-add-faq">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : faqs && faqs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question (EN)</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id} data-testid={`row-faq-${faq.id}`}>
                    <TableCell className="font-medium max-w-md truncate">
                      {faq.questionEn}
                    </TableCell>
                    <TableCell>{faq.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openDialog(faq)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(faq.id)}
                        >
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
            <p className="text-muted-foreground mb-4">No FAQs found</p>
            <Button onClick={() => openDialog()}>Add Your First FAQ</Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
              <FormField control={form.control} name="questionEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Question (English)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="answerEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer (English)</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="questionTr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Question (Turkish)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="answerTr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer (Turkish)</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="sortOrder" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingFaq ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this FAQ?
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
