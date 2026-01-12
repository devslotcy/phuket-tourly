import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n";
import type { BlogPostWithDetails } from "@shared/schema";

export function BlogPreview() {
  const { locale, t } = useLanguage();

  const { data: allPosts, isLoading } = useQuery<BlogPostWithDetails[]>({
    queryKey: ["/api/blog"],
  });
  
  const posts = allPosts?.slice(0, 3);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {t("blog.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("blog.subtitle")}
            </p>
          </div>
          <Link href="/blog">
            <Button variant="outline" className="gap-2" data-testid="link-view-all-blog">
              {t("nav.blog")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const translation = post.translations.find((tr) => tr.locale === locale) || post.translations[0];
              const tags = post.tags ? post.tags.split(",").slice(0, 2) : [];

              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="overflow-visible hover-elevate h-full" data-testid={`card-blog-${post.id}`}>
                    <div className="aspect-video overflow-hidden rounded-t-md">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={translation?.title || "Blog post"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {translation?.title || "Untitled"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {translation?.excerpt || ""}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.createdAt as unknown as string)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("common.noResults")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
