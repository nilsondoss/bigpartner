import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Building2, Edit, Trash2, Eye, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Property {
  id: number;
  title: string;
  slug: string;
  propertyType: string;
  status: string;
  approvalStatus?: string;
  viewCount?: number;
  price?: number;
  addressLine1?: string;
  city?: string;
  state?: string;
  createdAt: string;
}

export default function MyPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        // Filter to show only user's properties
        const userProperties = data.filter((p: Property) => p.createdBy === user?.id);
        setProperties(userProperties);
      } else {
        toast.error('Failed to load properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/properties/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Property moved to trash');
        fetchProperties(); // Refresh list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      available: 'default',
      sold: 'secondary',
      'under-contract': 'outline',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getApprovalBadge = (approvalStatus?: string) => {
    if (!approvalStatus) return null;

    const config = {
      approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Approved' },
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending' },
      rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Rejected' },
    };

    const { icon: Icon, color, bg, label } = config[approvalStatus as keyof typeof config] || config.pending;

    return (
      <Badge variant="outline" className={`${bg} ${color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Properties</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Link to="/admin/add-property">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {properties.filter((p) => p.approvalStatus === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {properties.filter((p) => p.approvalStatus === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.reduce((sum, p) => sum + (p.viewCount || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>View and manage all your property listings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first property listing
                </p>
                <Link to="/admin/add-property">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approval</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="font-medium">{property.title}</div>
                          <div className="text-sm text-muted-foreground">{property.slug}</div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {property.propertyType?.replace('-', ' ')}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {property.city && property.state
                              ? `${property.city}, ${property.state}`
                              : property.addressLine1 || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{formatPrice(property.price)}</TableCell>
                        <TableCell>{getStatusBadge(property.status)}</TableCell>
                        <TableCell>{getApprovalBadge(property.approvalStatus)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{property.viewCount || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(property.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/property-detail/${property.slug}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/admin/edit-property/${property.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(property.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link to="/trash">
            <Button variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              View Trash
            </Button>
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              This property will be moved to trash. You can restore it within 30 days, after which
              it will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Moving...' : 'Move to Trash'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
