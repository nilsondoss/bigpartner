import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/Spinner';
import { Heart, MapPin, Home, DollarSign, Eye, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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

interface Property {
  id: number;
  title: string;
  slug: string;
  propertyType: string;
  status: string;
  addressLine1: string;
  city: string;
  state: string;
  price: number;
  images: string;
  viewCount?: number;
  isVerified?: boolean;
}

interface Favorite {
  id: number;
  propertyId: number;
  property: Property;
  createdAt: string;
}

export default function MyFavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      toast.success('Removed from favorites');
      setFavorites(favorites.filter((f) => f.id !== favoriteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      residential: 'bg-blue-100 text-blue-800',
      commercial: 'bg-purple-100 text-purple-800',
      industrial: 'bg-gray-100 text-gray-800',
      rental: 'bg-green-100 text-green-800',
      farmland: 'bg-amber-100 text-amber-800',
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      'under-contract': 'bg-orange-100 text-orange-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getFirstImage = (images: string) => {
    try {
      const imageArray = JSON.parse(images);
      return imageArray[0] || '/placeholder-property.jpg';
    } catch {
      return '/placeholder-property.jpg';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-2">
              Properties you've saved for later viewing
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{favorites.length}</p>
                <p className="text-sm text-muted-foreground">Saved Properties</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring properties and save your favorites for easy access later.
            </p>
            <Button onClick={() => navigate('/properties')}>
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const property = favorite.property;
            return (
              <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getFirstImage(property.images)}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.isVerified && (
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      Verified
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setDeleteId(favorite.id)}
                  >
                    <Heart className="h-4 w-4 fill-white" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  {/* Property Title */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="line-clamp-1">
                      {property.city}, {property.state}
                    </span>
                  </div>

                  {/* Property Type & Status */}
                  <div className="flex gap-2 mb-3">
                    <Badge className={getPropertyTypeColor(property.propertyType)}>
                      <Home className="h-3 w-3 mr-1" />
                      {property.propertyType}
                    </Badge>
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-primary font-bold text-xl">
                      <DollarSign className="h-5 w-5" />
                      {formatPrice(property.price)}
                    </div>
                    {property.viewCount !== undefined && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="h-4 w-4 mr-1" />
                        {property.viewCount} views
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => navigate(`/property-detail/${property.slug}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(favorite.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Saved Date */}
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Saved on {new Date(favorite.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              This property will be removed from your favorites list. You can always add it back
              later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleRemoveFavorite(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
