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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BlogPostWithDetails } from "@shared/schema";

interface BlogFormData {
  slug: string;
  imageUrl: string;
  tags: string;
  published: boolean;
  titleEn: string;
  contentEn: string;
  excerptEn: string;
  seoTitleEn: string;
  seoDescriptionEn: string;
  titleTr: string;
  contentTr: string;
  excerptTr: string;
  seoTitleTr: string;
  seoDescriptionTr: string;
}

export default function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = id && id !== "new";

  const { data: post, isLoading: postLoading } = useQuery<BlogPostWithDetails>({
    queryKey: ["/api/admin/blog", id],
    enabled: !!isEditing,
  });

  const form = useForm<BlogFormData>({
    defaultValues: {
      slug: "",
      imageUrl: "",
      tags: "",
      published: false,
      titleEn: "",
      contentEn: "",
      excerptEn: "",
      seoTitleEn: "",
      seoDescriptionEn: "",
      titleTr: "",
      contentTr: "",
      excerptTr: "",
      seoTitleTr: "",
      seoDescriptionTr: "",
    },
  });

  useEffect(() => {
    if (post) {
      const enTrans = post.translations.find((t) => t.locale === "en");
      const trTrans = post.translations.find((t) => t.locale === "tr");
      form.reset({
        slug: post.slug,
        imageUrl: post.imageUrl || "",
        tags: post.tags || "",
        published: post.published,
        titleEn: enTrans?.title || "",
        contentEn: enTrans?.content || "",
        excerptEn: enTrans?.excerpt || "",
        seoTitleEn: enTrans?.seoTitle || "",
        seoDescriptionEn: enTrans?.seoDescription || "",
        titleTr: trTrans?.title || "",
        contentTr: trTrans?.content || "",
        excerptTr: trTrans?.excerpt || "",
        seoTitleTr: trTrans?.seoTitle || "",
        seoDescriptionTr: trTrans?.seoDescription || "",
      });
    }
  }, [post, form]);

  const mutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const payload = {
        post: {
          slug: data.slug,
          imageUrl: data.imageUrl || null,
          tags: data.tags || null,
          published: data.published,
        },
        translations: {
          en: {
            title: data.titleEn,
            content: data.contentEn,
            excerpt: data.excerptEn,
            seoTitle: data.seoTitleEn,
            seoDescription: data.seoDescriptionEn,
          },
          tr: {
            title: data.titleTr,
            content: data.contentTr,
            excerpt: data.excerptTr,
            seoTitle: data.seoTitleTr,
            seoDescription: data.seoDescriptionTr,
          },
        },
      };

      if (isEditing) {
        await apiRequest("PUT", `/api/admin/blog/${id}`, payload);
      } else {
        await apiRequest("POST", "/api/admin/blog", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: isEditing ? "Post updated" : "Post created" });
      setLocation("/admin/blog");
    },
    onError: () => {
      toast({ title: "Failed to save post", variant: "destructive" });
    },
  });

  if (postLoading) {
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
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/blog")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Blog Post" : "New Blog Post"}
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
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl><Input placeholder="best-phuket-beaches" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl><Input placeholder="travel, phuket, beaches" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="published" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Published</FormLabel>
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
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
                    <FormField control={form.control} name="excerptEn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl><Textarea rows={2} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contentEn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (Markdown)</FormLabel>
                        <FormControl><Textarea rows={12} {...field} /></FormControl>
                        <FormMessage />
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
                    <FormField control={form.control} name="excerptTr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Özet</FormLabel>
                        <FormControl><Textarea rows={2} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contentTr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>İçerik (Markdown)</FormLabel>
                        <FormControl><Textarea rows={12} {...field} /></FormControl>
                        <FormMessage />
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

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setLocation("/admin/blog")}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
