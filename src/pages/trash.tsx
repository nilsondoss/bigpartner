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
import { Trash2, RotateCcw, AlertTriangle, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Property {
  id: number;
  title: string;
  slug: string;
  propertyType: string;
  city?: string;
  state?: string;
  price?: number;
  deletedAt?: string;
}

export default function TrashPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'restore' | 'delete' | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTrashedProperties();
  }, [user]);

  const fetchTrashedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties?includeDeleted=true');
      if (response.ok) {
        const data = await response.json();
        // Filter to show only user's deleted properties
        const trashedProperties = data.filter(
          (p: Property) => p.createdBy === user?.id && p.deleted === true
        );
        setProperties(trashedProperties);
      } else {
        toast.error('Failed to load trash');
      }
    } catch (error) {
      console.error('Error fetching trash:', error);
      toast.error('Failed to load trash');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!actionId) return;

    try {
      setProcessing(true);
      const response = await fetch(`/api/properties/${actionId}/restore`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Property restored successfully');
        fetchTrashedProperties(); // Refresh list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to restore property');
      }
    } catch (error) {
      console.error('Error restoring property:', error);
      toast.error('Failed to restore property');
    } finally {
      setProcessing(false);
      setActionId(null);
      setActionType(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!actionId) return;

    try {
      setProcessing(true);
      const response = await fetch(`/api/properties/${actionId}?permanent=true`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Property permanently deleted');
        fetchTrashedProperties(); // Refresh list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    } finally {
      setProcessing(false);
      setActionId(null);
      setActionType(null);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (deletedAt?: string) => {
    if (!deletedAt) return 30;
    const deleted = new Date(deletedAt);
    const now = new Date();
    const diffTime = 30 * 24 * 60 * 60 * 1000 - (now.getTime() - deleted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trash</h1>
          <p className="text-muted-foreground">
            Properties in trash will be permanently deleted after 30 days
          </p>
        </div>

        {/* Warning Banner */}
        {properties.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Auto-Delete Warning</h3>
                  <p className="text-sm text-yellow-800">
                    Properties in trash are automatically deleted after 30 days. Restore them before
                    the deadline to prevent permanent deletion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trash Table */}
        <Card>
          <CardHeader>
            <CardTitle>Deleted Properties</CardTitle>
            <CardDescription>
              Restore properties or permanently delete them from your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading trash...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Deleted properties will appear here
                </p>
                <Link to="/my-properties">
                  <Button variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Back to My Properties
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
                      <TableHead>Deleted</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => {
                      const daysRemaining = getDaysRemaining(property.deletedAt);
                      return (
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
                                : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(property.price)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(property.deletedAt)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={daysRemaining <= 7 ? 'destructive' : 'secondary'}
                              className={daysRemaining <= 7 ? '' : 'bg-yellow-100 text-yellow-800'}
                            >
                              {daysRemaining} days
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActionId(property.id);
                                  setActionType('restore');
                                }}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Restore
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setActionId(property.id);
                                  setActionType('delete');
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4">
          <Link to="/my-properties">
            <Button variant="outline">
              <Building2 className="h-4 w-4 mr-2" />
              Back to My Properties
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={actionType === 'restore'}
        onOpenChange={() => {
          setActionId(null);
          setActionType(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Property?</AlertDialogTitle>
            <AlertDialogDescription>
              This property will be restored to your active listings and will be visible again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore} disabled={processing}>
              {processing ? 'Restoring...' : 'Restore Property'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog
        open={actionType === 'delete'}
        onOpenChange={() => {
          setActionId(null);
          setActionType(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The property will be permanently deleted from the
              database and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
