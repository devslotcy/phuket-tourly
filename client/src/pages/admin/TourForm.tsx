import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Category, TourWithDetails } from "@shared/schema";

interface TourFormData {
  slug: string;
  featured: boolean;
  popular: boolean;
  priceFrom: number;
  duration: string;
  categoryId: string;
  titleEn: string;
  summaryEn: string;
  highlightsEn: string;
  itineraryEn: string;
  includesEn: string;
  excludesEn: string;
  pickupInfoEn: string;
  cancellationPolicyEn: string;
  seoTitleEn: string;
  seoDescriptionEn: string;
  titleTr: string;
  summaryTr: string;
  highlightsTr: string;
  itineraryTr: string;
  includesTr: string;
  excludesTr: string;
  pickupInfoTr: string;
  cancellationPolicyTr: string;
  seoTitleTr: string;
  seoDescriptionTr: string;
  images: string;
}

export default function TourForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = id && id !== "new";

  const { data: tour, isLoading: tourLoading } = useQuery<TourWithDetails>({
    queryKey: ["/api/admin/tours", id],
    enabled: !!isEditing,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<TourFormData>({
    defaultValues: {
      slug: "",
      featured: false,
      popular: false,
      priceFrom: 0,
      duration: "",
      categoryId: "",
      titleEn: "",
      summaryEn: "",
      highlightsEn: "",
      itineraryEn: "",
      includesEn: "",
      excludesEn: "",
      pickupInfoEn: "",
      cancellationPolicyEn: "",
      seoTitleEn: "",
      seoDescriptionEn: "",
      titleTr: "",
      summaryTr: "",
      highlightsTr: "",
      itineraryTr: "",
      includesTr: "",
      excludesTr: "",
      pickupInfoTr: "",
      cancellationPolicyTr: "",
      seoTitleTr: "",
      seoDescriptionTr: "",
      images: "",
    },
  });

  useEffect(() => {
    if (tour) {
      const enTrans = tour.translations.find((t) => t.locale === "en");
      const trTrans = tour.translations.find((t) => t.locale === "tr");
      form.reset({
        slug: tour.slug,
        featured: tour.featured,
        popular: tour.popular,
        priceFrom: tour.priceFrom,
        duration: tour.duration,
        categoryId: tour.categoryId || "",
        titleEn: enTrans?.title || "",
        summaryEn: enTrans?.summary || "",
        highlightsEn: enTrans?.highlights || "",
        itineraryEn: enTrans?.itinerary || "",
        includesEn: enTrans?.includes || "",
        excludesEn: enTrans?.excludes || "",
        pickupInfoEn: enTrans?.pickupInfo || "",
        cancellationPolicyEn: enTrans?.cancellationPolicy || "",
        seoTitleEn: enTrans?.seoTitle || "",
        seoDescriptionEn: enTrans?.seoDescription || "",
        titleTr: trTrans?.title || "",
        summaryTr: trTrans?.summary || "",
        highlightsTr: trTrans?.highlights || "",
        itineraryTr: trTrans?.itinerary || "",
        includesTr: trTrans?.includes || "",
        excludesTr: trTrans?.excludes || "",
        pickupInfoTr: trTrans?.pickupInfo || "",
        cancellationPolicyTr: trTrans?.cancellationPolicy || "",
        seoTitleTr: trTrans?.seoTitle || "",
        seoDescriptionTr: trTrans?.seoDescription || "",
        images: tour.images.map((img) => img.url).join("\n"),
      });
    }
  }, [tour, form]);

  const mutation = useMutation({
    mutationFn: async (data: TourFormData) => {
      const payload = {
        tour: {
          slug: data.slug,
          featured: data.featured,
          popular: data.popular,
          priceFrom: data.priceFrom,
          duration: data.duration,
          categoryId: data.categoryId || null,
        },
        translations: {
          en: {
            title: data.titleEn,
            summary: data.summaryEn,
            highlights: data.highlightsEn,
            itinerary: data.itineraryEn,
            includes: data.includesEn,
            excludes: data.excludesEn,
            pickupInfo: data.pickupInfoEn,
            cancellationPolicy: data.cancellationPolicyEn,
            seoTitle: data.seoTitleEn,
            seoDescription: data.seoDescriptionEn,
          },
          tr: {
            title: data.titleTr,
            summary: data.summaryTr,
            highlights: data.highlightsTr,
            itinerary: data.itineraryTr,
            includes: data.includesTr,
            excludes: data.excludesTr,
            pickupInfo: data.pickupInfoTr,
            cancellationPolicy: data.cancellationPolicyTr,
            seoTitle: data.seoTitleTr,
            seoDescription: data.seoDescriptionTr,
          },
        },
        images: data.images.split("\n").filter((url) => url.trim()).map((url) => ({ url: url.trim() })),
      };

      if (isEditing) {
        await apiRequest("PUT", `/api/admin/tours/${id}`, payload);
      } else {
        await apiRequest("POST", "/api/admin/tours", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({ title: isEditing ? "Tour updated" : "Tour created" });
      setLocation("/admin/tours");
    },
    onError: () => {
      toast({ title: "Failed to save tour", variant: "destructive" });
    },
  });

  if (tourLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/tours")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Tour" : "New Tour"}
            </h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="phi-phi-island-tour" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price From ($) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Day (8 hours)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Featured</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="popular"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Popular</FormLabel>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Translations</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="en">
                  <TabsList>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="tr">Türkçe</TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="space-y-4 mt-4">
                    <FormField control={form.control} name="titleEn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="summaryEn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary *</FormLabel>
                        <FormControl><Textarea rows={3} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="highlightsEn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlights (one per line)</FormLabel>
                        <FormControl><Textarea rows={4} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="itineraryEn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Itinerary (one per line)</FormLabel>
                        <FormControl><Textarea rows={4} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="includesEn" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Includes (one per line)</FormLabel>
                          <FormControl><Textarea rows={4} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="excludesEn" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excludes (one per line)</FormLabel>
                          <FormControl><Textarea rows={4} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="pickupInfoEn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Info</FormLabel>
                        <FormControl><Textarea rows={2} {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="cancellationPolicyEn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cancellation Policy</FormLabel>
                        <FormControl><Textarea rows={2} {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="seoTitleEn" render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Title</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="seoDescriptionEn" render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Description</FormLabel>
                          <FormControl><Textarea rows={2} {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </TabsContent>
                  <TabsContent value="tr" className="space-y-4 mt-4">
                    <FormField control={form.control} name="titleTr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="summaryTr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Özet *</FormLabel>
                        <FormControl><Textarea rows={3} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="highlightsTr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Öne Çıkanlar (satır başına bir)</FormLabel>
                        <FormControl><Textarea rows={4} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="itineraryTr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program (satır başına bir)</FormLabel>
                        <FormControl><Textarea rows={4} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="includesTr" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dahil Olanlar</FormLabel>
                          <FormControl><Textarea rows={4} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="excludesTr" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dahil Olmayanlar</FormLabel>
                          <FormControl><Textarea rows={4} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="pickupInfoTr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alış Bilgileri</FormLabel>
                        <FormControl><Textarea rows={2} {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="cancellationPolicyTr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>İptal Politikası</FormLabel>
                        <FormControl><Textarea rows={2} {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="seoTitleTr" render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Başlığı</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="seoDescriptionTr" render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Açıklaması</FormLabel>
                          <FormControl><Textarea rows={2} {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs (one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setLocation("/admin/tours")}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Tour" : "Create Tour"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
