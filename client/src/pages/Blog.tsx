import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n";
import type { BlogPostWithDetails } from "@shared/schema";

export default function Blog() {
  const { locale, t } = useLanguage();

  const { data: posts, isLoading } = useQuery<BlogPostWithDetails[]>({
    queryKey: ["/api/blog"],
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const featuredPost = posts?.[0];
  const otherPosts = posts?.slice(1);

  return (
    <PublicLayout>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center text-white">
          <BookOpen className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t("blog.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            {t("blog.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="aspect-video rounded-lg" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-video rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-16">
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Card className="overflow-visible hover-elevate" data-testid={`card-blog-featured`}>
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="aspect-video md:aspect-auto overflow-hidden rounded-t-md md:rounded-l-md md:rounded-tr-none">
                        {featuredPost.imageUrl ? (
                          <img
                            src={featuredPost.imageUrl}
                            alt={
                              featuredPost.translations.find((tr) => tr.locale === locale)?.title ||
                              "Featured post"
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted min-h-[300px]" />
                        )}
                      </div>
                      <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                        <Badge className="w-fit mb-4">Featured</Badge>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                          {featuredPost.translations.find((tr) => tr.locale === locale)?.title ||
                            featuredPost.translations[0]?.title}
                        </h2>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {featuredPost.translations.find((tr) => tr.locale === locale)?.excerpt ||
                            featuredPost.translations[0]?.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(featuredPost.createdAt as unknown as string)}</span>
                          </div>
                        </div>
                        <Button className="w-fit gap-2">
                          {t("blog.readMore")}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              )}

              {otherPosts && otherPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherPosts.map((post) => {
                    const translation =
                      post.translations.find((tr) => tr.locale === locale) || post.translations[0];
                    const tags = post.tags ? post.tags.split(",").slice(0, 2) : [];

                    return (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <Card
                          className="overflow-visible hover-elevate h-full"
                          data-testid={`card-blog-${post.id}`}
                        >
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
                            <h3 className="font-semibold text-lg line-clamp-2">
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
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">{t("common.noResults")}</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
