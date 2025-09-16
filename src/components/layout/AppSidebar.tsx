import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Search,
  ClipboardList,
  AlertCircle,
  DollarSign,
  FileText,
  BookMarked,
  UserCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    group: "Overview",
  },
  {
    title: "Search Catalog",
    url: "/search",
    icon: Search,
    group: "Catalog",
  },
  {
    title: "Books",
    url: "/books",
    icon: BookOpen,
    group: "Catalog",
  },
  {
    title: "Categories",
    url: "/categories",
    icon: BookMarked,
    group: "Catalog",
  },
  {
    title: "Members",
    url: "/members",
    icon: Users,
    group: "Management",
  },
  {
    title: "Borrowing",
    url: "/borrowing",
    icon: ClipboardList,
    group: "Management",
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: Calendar,
    group: "Management",
  },
  {
    title: "Overdue Items",
    url: "/overdue",
    icon: AlertCircle,
    group: "Management",
  },
  {
    title: "Fines",
    url: "/fines",
    icon: DollarSign,
    group: "Financial",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    group: "Analytics",
  },
  {
    title: "Staff",
    url: "/staff",
    icon: UserCheck,
    group: "Administration",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    group: "Administration",
  },
];

const groupedItems = menuItems.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof menuItems>);

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-soft" 
      : "hover:bg-sidebar-accent/50 transition-smooth";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-sidebar-border">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">LibraryMS</h1>
                <p className="text-xs text-sidebar-foreground/70">Management System</p>
              </div>
            )}
          </div>
        </div>

        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
                {groupName}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavCls}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="w-4 h-4 text-sidebar-foreground" />
                        {!collapsed && <span className="text-sidebar-foreground">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}