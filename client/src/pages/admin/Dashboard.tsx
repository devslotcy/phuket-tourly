import { useQuery } from "@tanstack/react-query";
import { Map, MessageSquare, AlertCircle, FileText, Star, HelpCircle, TrendingUp, Calendar, Users } from "lucide-react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DashboardStats {
  totalTours: number;
  totalInquiries: number;
  newInquiries: number;
  totalReviews: number;
  totalBlogPosts: number;
  totalFaqs: number;
}

interface MonthlyInquiry {
  month: string;
  inquiries: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: monthlyInquiries, isLoading: isLoadingMonthly, error } = useQuery<MonthlyInquiry[]>({
    queryKey: ["/api/admin/stats/monthly-inquiries"],
  });

  // Debug: Log the data
  console.log("Monthly Inquiries Data:", monthlyInquiries);
  console.log("Is Loading:", isLoadingMonthly);
  console.log("Error:", error);

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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with C Plus Andaman Travel
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
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
                  <Card
                    className="hover-elevate cursor-pointer transition-all duration-300 hover:shadow-xl border-l-4 border-l-transparent hover:border-l-blue-500"
                    data-testid={`card-stat-${index}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-md`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
                        {stat.value}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click to view details
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>

        {/* Monthly Customer Reservations Chart */}
        <Card className="shadow-xl border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                <Users className="h-6 w-6 text-white" />
              </div>
              Customer Reservations - Last 12 Months
            </CardTitle>
            <CardDescription className="text-base">
              Real-time data showing monthly customer inquiry trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMonthly ? (
              <div className="flex items-center justify-center h-[400px]">
                <Skeleton className="w-full h-full" />
              </div>
            ) : !monthlyInquiries || monthlyInquiries.length === 0 ? (
              <div className="flex items-center justify-center h-[400px] text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-semibold">No data available</p>
                  <p className="text-sm mt-2">Add some inquiries to see the chart</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={monthlyInquiries}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorInquiries" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={13}
                    fontWeight={500}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={13}
                    fontWeight={500}
                    tickLine={false}
                    label={{
                      value: 'Number of Inquiries',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#6b7280', fontWeight: 600 }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    }}
                    labelStyle={{
                      color: '#fff',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}
                    itemStyle={{
                      color: '#06b6d4',
                      fontWeight: '600'
                    }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar
                    dataKey="inquiries"
                    fill="url(#colorInquiries)"
                    radius={[8, 8, 8, 8]}
                    maxBarSize={60}
                  >
                    {(monthlyInquiries || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.inquiries === Math.max(...(monthlyInquiries || []).map(d => d.inquiries))
                          ? '#8b5cf6'
                          : 'url(#colorInquiries)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="mt-4 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Total Inquiries: <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {monthlyInquiries?.reduce((sum, m) => sum + m.inquiries, 0) || 0}
                  </span>
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Updated in real-time
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your content efficiently</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/admin/tours/new">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500" data-testid="button-quick-add-tour">
                <Map className="mr-2 h-4 w-4" />
                Add New Tour
              </Button>
            </Link>
            <Link href="/admin/blog/new">
              <Button variant="outline" data-testid="button-quick-add-blog">
                <FileText className="mr-2 h-4 w-4" />
                Add Blog Post
              </Button>
            </Link>
            <Link href="/admin/inquiries">
              <Button variant="outline" data-testid="button-quick-view-inquiries">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Inquiries
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
