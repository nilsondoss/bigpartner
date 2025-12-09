import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2, FileText, Settings, LogOut, Plus, Shield, Heart, Eye, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface PropertyStats {
  total: number;
  approved: number;
  pending: number;
  totalViews: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<PropertyStats>({
    total: 0,
    approved: 0,
    pending: 0,
    totalViews: 0,
  });
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user's properties
        const propertiesRes = await fetch('/api/properties');
        if (propertiesRes.ok) {
          const properties = await propertiesRes.json();
          const userProperties = properties.filter((p: any) => p.createdBy === user?.id);
          
          setStats({
            total: userProperties.length,
            approved: userProperties.filter((p: any) => p.approvalStatus === 'approved').length,
            pending: userProperties.filter((p: any) => p.approvalStatus === 'pending').length,
            totalViews: userProperties.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0),
          });
        }
        
        // Fetch favorites count
        const favoritesRes = await fetch('/api/favorites');
        if (favoritesRes.ok) {
          const favorites = await favoritesRes.json();
          setFavoritesCount(favorites.length);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your account and view your activity</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
              <p className="text-xs text-muted-foreground">Total properties listed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{loading ? '...' : stats.approved}</div>
              <p className="text-xs text-muted-foreground">Live on site</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{loading ? '...' : stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">Across all properties</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Favorites</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : favoritesCount}</div>
              <p className="text-xs text-muted-foreground">Properties you liked</p>
              <Link to="/my-favorites" className="text-xs text-primary hover:underline mt-2 inline-block">
                View all →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Property Management Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Property Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link to="/my-properties" className="flex-1">
                <Button className="w-full" variant="default">
                  <Building2 className="mr-2 h-4 w-4" />
                  My Properties
                </Button>
              </Link>
              <Link to="/admin/add-property" className="flex-1">
                <Button className="w-full" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name || 'Guest User'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email || 'guest@example.com'}</p>
                    {user?.role && (
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        Role: {user.role}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Link to="/profile">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions with properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Viewed Luxury Villa in Goa</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Sent inquiry for Commercial Space</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Saved Apartment in Mumbai</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Admin check: Check if user email is admin@bigpartner.com */}
                {user?.email === 'admin@bigpartner.com' && (
                  <Link to="/set-admin.html" target="_blank">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Admin Users
                    </Button>
                  </Link>
                )}
                <Link to="/properties">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Browse Properties
                  </Button>
                </Link>
                <Link to="/for-investors">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Investor Information
                  </Button>
                </Link>
                <Link to="/for-partners">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Partner Information
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
