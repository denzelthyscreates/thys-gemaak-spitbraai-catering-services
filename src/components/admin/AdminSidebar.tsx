import { Users, Calendar, Home, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: Home },
  { title: 'Bookings', url: '/admin/bookings', icon: Calendar },
  { title: 'User Roles', url: '/admin/users', icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <div className="p-4 border-b flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        {!collapsed && <span className="font-semibold">Admin Panel</span>}
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/admin'}
                      className={({ isActive }) => 
                        `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-muted'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="mt-auto p-2 border-t">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}
