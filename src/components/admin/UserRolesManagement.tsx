import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-600 border-red-500/20',
  moderator: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  user: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export function UserRolesManagement() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'moderator' | 'user'>('user');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchUserEmails = async (userIds: string[]) => {
    if (userIds.length === 0) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('get-user-emails', {
        body: { user_ids: userIds },
      });
      
      if (!error && data?.user_emails) {
        setUserEmails(data.user_emails);
      }
    } catch (error) {
      console.error('Error fetching user emails:', error);
    }
  };

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
      
      // Fetch emails for all users
      if (data && data.length > 0) {
        const userIds = data.map(r => r.user_id);
        await fetchUserEmails(userIds);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast.error('Failed to load user roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const addRole = async () => {
    if (!newUserId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: newUserId.trim(), role: newRole })
        .select()
        .single();

      if (error) throw error;

      setUserRoles(prev => [data, ...prev]);
      setDialogOpen(false);
      setNewUserId('');
      setNewRole('user');
      toast.success('Role assigned successfully');
    } catch (error: any) {
      console.error('Error adding role:', error);
      if (error.message?.includes('duplicate')) {
        toast.error('This user already has this role');
      } else {
        toast.error('Failed to assign role');
      }
    } finally {
      setAdding(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    setDeleting(roleId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      setUserRoles(prev => prev.filter(r => r.id !== roleId));
      toast.success('Role removed');
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to remove role');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Manage user access levels and permissions</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchUserRoles} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Role</DialogTitle>
                <DialogDescription>
                  Assign a role to a user by their user ID
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="user-id">User ID (UUID)</Label>
                  <Input
                    id="user-id"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Find user IDs in Supabase Dashboard → Authentication → Users
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newRole} onValueChange={(v: any) => setNewRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addRole} disabled={adding}>
                  {adding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Assign Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : userRoles.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No user roles found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRoles.map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {userEmails[userRole.user_id] || 'Loading...'}
                      </span>
                      <code className="text-xs text-muted-foreground">
                        {userRole.user_id}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[userRole.role]}>
                      {userRole.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(userRole.created_at), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteRole(userRole.id)}
                      disabled={deleting === userRole.id}
                    >
                      {deleting === userRole.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
