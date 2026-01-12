import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Map,
  FolderTree,
  MessageSquare,
  HelpCircle,
  Star,
  FileText,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Tours", url: "/admin/tours", icon: Map },
  { title: "Categories", url: "/admin/categories", icon: FolderTree },
  { title: "Inquiries", url: "/admin/inquiries", icon: MessageSquare },
  { title: "FAQs", url: "/admin/faqs", icon: HelpCircle },
  { title: "Reviews", url: "/admin/reviews", icon: Star },
  { title: "Blog Posts", url: "/admin/blog", icon: FileText },
];

function AdminSidebar() {
  const [location] = useLocation();
  const { admin, logout } = useAuth();

  const isActive = (url: string) => {
    if (url === "/admin") return location === "/admin";
    return location.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-semibold">Admin Panel</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <div className="px-4 py-2 text-sm text-muted-foreground">
              {admin?.email}
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="text-destructive"
                  data-testid="button-admin-logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center gap-4 h-14 px-4 border-b border-border bg-background">
            <SidebarTrigger data-testid="button-admin-sidebar-toggle">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <h1 className="font-semibold">Phuket Tours Admin</h1>
          </header>
          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
