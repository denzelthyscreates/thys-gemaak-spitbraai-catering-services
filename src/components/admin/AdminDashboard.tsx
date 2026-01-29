import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalUsers: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch bookings
        const { data: bookings } = await supabase
          .from('bookings')
          .select('status, total_price');

        // Fetch user roles count
        const { data: roles } = await supabase
          .from('user_roles')
          .select('id');

        if (bookings) {
          setStats({
            totalBookings: bookings.length,
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            totalRevenue: bookings
              .filter(b => b.status === 'confirmed' || b.status === 'completed')
              .reduce((sum, b) => sum + (b.total_price || 0), 0),
            totalUsers: roles?.length || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      description: 'All time bookings',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Pending',
      value: stats.pendingBookings,
      description: 'Awaiting confirmation',
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Revenue',
      value: `R${stats.totalRevenue.toLocaleString()}`,
      description: 'From confirmed bookings',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Users with Roles',
      value: stats.totalUsers,
      description: 'Assigned system roles',
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your catering business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
