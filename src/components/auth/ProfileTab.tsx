
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ProfileTabProps {
  user: User;
  loading: boolean;
  signOut: () => Promise<void>;
}

const ProfileTab = ({ user, loading, signOut }: ProfileTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.user_metadata?.name || '');
  const [phone, setPhone] = useState(user.user_metadata?.phone || '');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase.auth.updateUser({
        data: {
          name,
          phone
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your information has been successfully updated.",
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update profile error:', err);
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setName(user.user_metadata?.name || '');
    setPhone(user.user_metadata?.phone || '');
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Manage your account information
          </CardDescription>
        </div>
        {!isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            disabled={loading || updating}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user.email}
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Your phone number"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-lg">{user.user_metadata?.name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-lg">{user.user_metadata?.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Account ID</p>
              <p className="text-sm text-muted-foreground truncate">{user.id}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button 
              onClick={handleCancel} 
              variant="outline"
              disabled={updating}
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updating}
            >
              {updating ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
            </Button>
          </>
        ) : (
          <Button 
            onClick={signOut} 
            variant="outline" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileTab;
