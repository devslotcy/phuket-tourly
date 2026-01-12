import { useQuery } from "@tanstack/react-query";
import { Map, MessageSquare, AlertCircle, FileText, Star, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalTours: number;
  totalInquiries: number;
  newInquiries: number;
  totalReviews: number;
  totalBlogPosts: number;
  totalFaqs: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
    {
      title: "Total Tours",
      value: stats?.totalTours ?? 0,
      icon: Map,
      href: "/admin/tours",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "New Inquiries",
      value: stats?.newInquiries ?? 0,
      icon: AlertCircle,
      href: "/admin/inquiries",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Total Inquiries",
      value: stats?.totalInquiries ?? 0,
      icon: MessageSquare,
      href: "/admin/inquiries",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Reviews",
      value: stats?.totalReviews ?? 0,
      icon: Star,
      href: "/admin/reviews",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Blog Posts",
      value: stats?.totalBlogPosts ?? 0,
      icon: FileText,
      href: "/admin/blog",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "FAQs",
      value: stats?.totalFaqs ?? 0,
      icon: HelpCircle,
      href: "/admin/faqs",
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Phuket Tours admin panel
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat, index) => (
                <Link key={index} href={stat.href}>
                  <Card className="hover-elevate cursor-pointer" data-testid={`card-stat-${index}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link href="/admin/tours/new">
                <Button data-testid="button-quick-add-tour">Add New Tour</Button>
              </Link>
              <Link href="/admin/blog/new">
                <Button variant="outline" data-testid="button-quick-add-blog">
                  Add Blog Post
                </Button>
              </Link>
              <Link href="/admin/inquiries">
                <Button variant="outline" data-testid="button-quick-view-inquiries">
                  View Inquiries
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                admin@phuket-tours.com
              </p>
              <p>
                <span className="text-muted-foreground">Password:</span>{" "}
                Admin123!
              </p>
              <p className="text-muted-foreground text-xs mt-4">
                Change your password in the settings for security.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
