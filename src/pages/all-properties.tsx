import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';
import {
  Building2,
  MapPin,
  DollarSign,
  Eye,
  Heart,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import VerifiedBadge from '@/components/VerifiedBadge';

interface Property {
  id: number;
  title: string;
  slug: string;
  description: string;
  type: string;
  price: number;
  location: string;
  city: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string;
  status: string;
  approvalStatus: string;
  views: number;
  createdBy: number;
  createdAt: string;
  ownerName?: string;
  ownerEmail?: string;
}

export default function AllPropertiesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const isAdmin = user?.email === 'admin@bigpartner.com';

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    filterProperties();
  }, [properties, searchQuery, typeFilter, statusFilter, cityFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        toast.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.map((fav: any) => fav.propertyId));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((property) =>
        property.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((property) => property.status === statusFilter);
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter((property) => property.city === cityFilter);
    }

    setFilteredProperties(filtered);
  };

  const toggleFavorite = async (propertyId: number) => {
    if (!user) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      const isFavorited = favorites.includes(propertyId);

      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${propertyId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFavorites(favorites.filter((id) => id !== propertyId));
          toast.success('Removed from favorites');
        } else {
          toast.error('Failed to remove from favorites');
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId }),
        });

        if (response.ok) {
          setFavorites([...favorites, propertyId]);
          toast.success('Added to favorites');
        } else {
          toast.error('Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error updating favorites');
    }
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    try {
      const response = await fetch(`/api/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Property deleted successfully');
        setProperties(properties.filter((p) => p.id !== propertyToDelete.id));
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      available: 'default',
      sold: 'secondary',
      rented: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getApprovalBadge = (approvalStatus: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive',
    };

    return (
      <Badge variant={variants[approvalStatus] || 'outline'}>
        {approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (images: string) => {
    try {
      const imageArray = JSON.parse(images);
      return imageArray[0] || '/placeholder-property.jpg';
    } catch {
      return images || '/placeholder-property.jpg';
    }
  };

  const uniqueCities = Array.from(new Set(properties.map((p) => p.city))).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">All Properties</h1>
              <p className="text-primary-foreground/80">
                Browse all properties in our database
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => navigate('/admin/add-property')}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="rental">Rental</SelectItem>
                  <SelectItem value="farmland">Farmland</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>

              {/* City Filter */}
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredProperties.length} of {properties.length} properties
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties && filteredProperties.length > 0 ? filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(property.images)}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(property.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(property.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(property.status)}
                  </div>

                  {/* View Counter */}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {property.views || 0}
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Title and Verified Badge */}
                  <div className="flex items-start justify-between mb-2">
                    <Link
                      to={`/properties/${property.slug}`}
                      className="text-lg font-semibold hover:text-primary transition-colors flex-1"
                    >
                      {property.title}
                    </Link>
                    {property.approvalStatus === 'approved' && (
                      <VerifiedBadge size="sm" />
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {property.location}, {property.city}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1 text-xl font-bold text-primary mb-3">
                    <DollarSign className="h-5 w-5" />
                    {formatPrice(property.price)}
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{property.area} sqft</span>
                    {property.bedrooms && <span>{property.bedrooms} beds</span>}
                    {property.bathrooms && <span>{property.bathrooms} baths</span>}
                  </div>

                  {/* Type and Approval Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{property.type}</Badge>
                    {isAdmin && getApprovalBadge(property.approvalStatus)}
                  </div>

                  {/* Owner Info (Admin Only) */}
                  {isAdmin && property.ownerName && (
                    <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted rounded">
                      <div>Owner: {property.ownerName}</div>
                      <div>{property.ownerEmail}</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => navigate(`/property/${property.slug}`)}
                    >
                      View Details
                    </Button>

                    {isAdmin && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/admin/edit-property/${property.slug}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setPropertyToDelete(property);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No properties found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{propertyToDelete?.title}"? This action will move
              the property to trash. You can restore it within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
