import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  Clock,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  BarChart3,
  UserPlus,
  FileText,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface GlobalStats {
  totalProperties: number;
  approvedProperties: number;
  pendingProperties: number;
  rejectedProperties: number;
  totalUsers: number;
  totalPartners: number;
  totalInvestors: number;
  totalViews: number;
  totalInquiries: number;
  recentProperties: any[];
  recentUsers: any[];
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<GlobalStats>({
    totalProperties: 0,
    approvedProperties: 0,
    pendingProperties: 0,
    rejectedProperties: 0,
    totalUsers: 0,
    totalPartners: 0,
    totalInvestors: 0,
    totalViews: 0,
    totalInquiries: 0,
    recentProperties: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);

  // Check admin access
  useEffect(() => {
    if (user && user.email !== 'admin@bigpartner.com') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        setLoading(true);

        // Fetch all properties
        const propertiesRes = await fetch('/api/properties');
        const propertiesData = await propertiesRes.json();
        const properties = propertiesData.properties || propertiesData || [];

        // Fetch all partners
        const partnersRes = await fetch('/api/partners');
        const partnersData = await partnersRes.json();
        const partners = partnersData.partners || partnersData || [];

        // Fetch all investors
        const investorsRes = await fetch('/api/investors');
        const investorsData = await investorsRes.json();
        const investors = investorsData.investors || investorsData || [];

        // Fetch all inquiries
        const inquiriesRes = await fetch('/api/inquiries');
        const inquiriesData = await inquiriesRes.json();
        const inquiries = inquiriesData.inquiries || inquiriesData || [];

        // Calculate stats
        const totalViews = properties.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
        const approvedProperties = properties.filter((p: any) => p.approvalStatus === 'approved' || p.isVerified);
        const pendingProperties = properties.filter((p: any) => p.approvalStatus === 'pending' || (!p.isVerified && !p.approvalStatus));
        const rejectedProperties = properties.filter((p: any) => p.approvalStatus === 'rejected');

        // Get recent properties (last 5)
        const recentProperties = properties
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalProperties: properties.length,
          approvedProperties: approvedProperties.length,
          pendingProperties: pendingProperties.length,
          rejectedProperties: rejectedProperties.length,
          totalUsers: partners.length + investors.length,
          totalPartners: partners.length,
          totalInvestors: investors.length,
          totalViews,
          totalInquiries: inquiries.length,
          recentProperties,
          recentUsers: [...partners, ...investors]
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5),
        });
      } catch (error) {
        console.error('Failed to fetch global stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email === 'admin@bigpartner.com') {
      fetchGlobalStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor site-wide activity and manage all properties, users, and inquiries.
        </p>
      </div>

      {/* Property Management Buttons */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Property Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/all-properties">
              <Button className="w-full" variant="default">
                <Building2 className="mr-2 h-4 w-4" />
                My Properties
              </Button>
            </Link>
            <Link to="/admin/property-approval">
              <Button className="w-full" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Approval Properties
                {stats.pendingProperties > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                    {stats.pendingProperties}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/admin/add-property">
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Global Stats Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Site-Wide Statistics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">{stats.approvedProperties} approved</span>
                {' • '}
                <span className="text-yellow-600">{stats.pendingProperties} pending</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalPartners} partners • {stats.totalInvestors} investors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingProperties}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link to="/admin/property-approval" className="text-primary hover:underline">
                  Review now →
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All property views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInquiries}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link to="/admin/inquiries" className="text-primary hover:underline">
                  View all →
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Property Status Breakdown */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Properties</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedProperties}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalProperties > 0
                ? `${Math.round((stats.approvedProperties / stats.totalProperties) * 100)}% of total`
                : '0% of total'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingProperties}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalProperties > 0
                ? `${Math.round((stats.pendingProperties / stats.totalProperties) * 100)}% of total`
                : '0% of total'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Properties</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedProperties}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalProperties > 0
                ? `${Math.round((stats.rejectedProperties / stats.totalProperties) * 100)}% of total`
                : '0% of total'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentProperties.length > 0 ? (
              <div className="space-y-4">
                {stats.recentProperties.map((property: any) => (
                  <div key={property.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <Link
                        to={`/property-detail/${property.slug}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {property.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{property.propertyType}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          property.approvalStatus === 'approved' || property.isVerified
                            ? 'bg-green-100 text-green-700'
                            : property.approvalStatus === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {property.approvalStatus || (property.isVerified ? 'approved' : 'pending')}
                      </span>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/admin/properties">View All Properties</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No properties yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.map((u: any) => (
                  <div key={u.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{u.name || u.fullName}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {u.userType || (u.companyName ? 'Partner' : 'Investor')}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/partners">View Partners</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/investors">View Investors</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No users yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
