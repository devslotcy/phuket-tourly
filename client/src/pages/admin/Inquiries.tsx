import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, MessageSquare } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Inquiry } from "@shared/schema";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  CONFIRMED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

export default function AdminInquiries() {
  const { toast } = useToast();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState("");

  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status?: string; notes?: string }) => {
      await apiRequest("PATCH", `/api/admin/inquiries/${id}`, { status, internalNotes: notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
      toast({ title: "Inquiry updated" });
    },
    onError: () => {
      toast({ title: "Failed to update inquiry", variant: "destructive" });
    },
  });

  const openDetail = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setInternalNotes(inquiry.internalNotes || "");
  };

  const closeDetail = () => {
    setSelectedInquiry(null);
    setInternalNotes("");
  };

  const handleStatusChange = (status: string) => {
    if (selectedInquiry) {
      updateMutation.mutate({ id: selectedInquiry.id, status });
      setSelectedInquiry({ ...selectedInquiry, status: status as Inquiry["status"] });
    }
  };

  const saveNotes = () => {
    if (selectedInquiry) {
      updateMutation.mutate({ id: selectedInquiry.id, notes: internalNotes });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inquiries</h1>
          <p className="text-muted-foreground">Manage booking inquiries</p>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} data-testid={`row-inquiry-${inquiry.id}`}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.date || "-"}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[inquiry.status]}>
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDetail(inquiry)}
                        data-testid={`button-view-inquiry-${inquiry.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No inquiries yet</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedInquiry} onOpenChange={closeDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedInquiry.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Date</p>
                  <p className="font-medium">{selectedInquiry.date || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">People</p>
                  <p className="font-medium">{selectedInquiry.peopleCount || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hotel</p>
                  <p className="font-medium">{selectedInquiry.hotel || "-"}</p>
                </div>
              </div>

              {selectedInquiry.message && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Message</p>
                  <p className="p-3 bg-muted rounded-md">{selectedInquiry.message}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Internal Notes</p>
                <Textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={4}
                  placeholder="Add private notes about this inquiry..."
                />
                <Button
                  className="mt-2"
                  size="sm"
                  onClick={saveNotes}
                  disabled={updateMutation.isPending}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
