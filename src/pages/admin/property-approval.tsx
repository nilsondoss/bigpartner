import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Property {
  id: number;
  title: string;
  slug: string;
  propertyType: string;
  status: string;
  price: number;
  addressLine1: string;
  city: string;
  state: string;
  createdAt: string;
  // approvalStatus: string; // TODO: Uncomment after migration
  // createdBy: number; // TODO: Uncomment after migration
}

export default function AdminPropertyApprovalPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Check admin access
  useEffect(() => {
    if (!user || user.email !== 'admin@bigpartner.com') {
      navigate('/dashboard');
      toast.error('Admin access required');
    }
  }, [user, navigate]);

  // Fetch pending properties
  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      const data = await response.json();

      if (data.success) {
        // TODO: After migration, filter by approvalStatus === 'pending'
        // For now, show all properties
        setProperties(data.properties || []);
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

  const handleApprove = async (property: Property) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/properties/${property.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Property "${property.title}" approved!`);
        fetchPendingProperties(); // Refresh list
      } else {
        toast.error(data.error || 'Failed to approve property');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      toast.error('Failed to approve property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (property: Property) => {
    setSelectedProperty(property);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedProperty) return;

    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/properties/${selectedProperty.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Property "${selectedProperty.title}" rejected`);
        setShowRejectDialog(false);
        setSelectedProperty(null);
        setRejectionReason('');
        fetchPendingProperties(); // Refresh list
      } else {
        toast.error(data.error || 'Failed to reject property');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast.error('Failed to reject property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleView = (slug: string) => {
    navigate(`/property-detail/${slug}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading pending properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Approval</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve pending property submissions
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/properties')}>
          View All Properties
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Properties waiting for admin review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{properties.length}</span>
            <span className="text-muted-foreground">properties pending</span>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Properties</CardTitle>
          <CardDescription>
            Review property details and approve or reject submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground mb-4">
                There are no pending properties to review
              </p>
              <Button onClick={() => navigate('/admin/properties')}>
                View All Properties
              </Button>
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
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="font-medium">{property.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {property.propertyType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {property.city}, {property.state}
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(property.price)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            property.status === 'available'
                              ? 'default'
                              : property.status === 'sold'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(property.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(property.slug)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(property)}
                            disabled={actionLoading}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectClick(property)}
                            disabled={actionLoading}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
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

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedProperty?.title}". This will be sent to the property owner.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Incomplete information, invalid images, pricing issues..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={actionLoading || !rejectionReason.trim()}
            >
              {actionLoading ? 'Rejecting...' : 'Reject Property'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
