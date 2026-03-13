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
  Palmtree,
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
      <SidebarContent className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6" style={{ marginTop: '15px' }}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Palmtree className="text-white h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-white">C Plus</span>
                  <span className="text-xs text-slate-400">Andaman Travel</span>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={`
                      text-slate-300 hover:text-white hover:bg-slate-700/50
                      transition-all duration-200
                      ${isActive(item.url) ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md" : ""}
                    `}
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

        <SidebarGroup className="mt-auto border-t border-slate-700 pt-4">
          <SidebarGroupContent>
            <div className="px-4 py-2 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {admin?.email}
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
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
          <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-admin-sidebar-toggle">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="font-semibold text-lg">C Plus Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>System Online</span>
            </div>
          </header>
          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
