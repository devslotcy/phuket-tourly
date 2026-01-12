import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n";
import type { BlogPostWithDetails } from "@shared/schema";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { locale, t } = useLanguage();

  const { data: post, isLoading } = useQuery<BlogPostWithDetails>({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="aspect-video rounded-lg mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!post) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("common.noResults")}</h1>
          <Link href="/blog">
            <Button variant="outline">{t("common.back")}</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const translation = post.translations.find((tr) => tr.locale === locale) || post.translations[0];
  const tags = post.tags ? post.tags.split(",") : [];

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back-blog">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
        </Link>

        {post.imageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden mb-8">
            <img
              src={post.imageUrl}
              alt={translation?.title || "Blog post"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="gap-1">
              <Tag className="h-3 w-3" />
              {tag.trim()}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {translation?.title || "Untitled"}
        </h1>

        <div className="flex items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.createdAt as unknown as string)}</span>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {translation?.content?.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </PublicLayout>
  );
}
