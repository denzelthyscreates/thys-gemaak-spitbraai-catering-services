import { useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { BookingsManagement } from '@/components/admin/BookingsManagement';
import { UserRolesManagement } from '@/components/admin/UserRolesManagement';
import { Loader2, ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShieldX className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard. 
            Contact an administrator if you believe this is an error.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Link>
            </Button>
          </div>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<BookingsManagement />} />
            <Route path="users" element={<UserRolesManagement />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
