import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, SlidersHorizontal, X, Factory, Home, Building2, Sprout, Key, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PropertiesPage() {
  const navigate = useNavigate();
  
  const propertiesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Real Estate Properties',
    description: 'Browse our complete collection of residential, commercial, industrial, and farmland properties across India',
  };

  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [inquiryDialog, setInquiryDialog] = useState<{ open: boolean; property: any | null }>({
    open: false,
    property: null,
  });
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [areaRange, setAreaRange] = useState([0, 100000]);  // Increased max to 100,000 sq.ft
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { user } = useAuth();

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.map((fav: any) => fav.propertyId));
        }
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      }
    };
    fetchFavorites();
  }, [user]);

  // Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        // Transform database properties to match component format
        const propertiesArray = Array.isArray(data) ? data : (data.properties || []);
        const transformed = propertiesArray.map((prop: any) => {
          // Parse JSON fields safely
          let amenities = [];
          try {
            amenities = typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : (Array.isArray(prop.amenities) ? prop.amenities : []);
          } catch {
            amenities = [];
          }
          
          // Use featuredImage field from API (camelCase from Drizzle ORM)
          const imageUrl = prop.featuredImage || prop.featured_image || prop.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
          
          return {
            id: prop.id,
            slug: prop.slug,
            title: prop.title,
            location: `${prop.city}, ${prop.state}`,
            area: prop.area,
            price: prop.price / 10000000, // Convert to crores
            type: prop.propertyType?.toLowerCase() || 'residential',
            image: imageUrl,
            featured: prop.isFeatured || false,
            amenities: amenities,
          };
        });
        setAllProperties(transformed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties');
        // Fallback to empty array on error
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const propertyTypes = [
    { id: 'industrial', label: 'Industrial', icon: Factory },
    { id: 'residential', label: 'Residential', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building2 },
    { id: 'farmland', label: 'Farm Land', icon: Sprout },
    { id: 'rental', label: 'Rental', icon: Key },
  ];

  const locations = [
    'Mumbai, Maharashtra',
    'Pune, Maharashtra',
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Gurgaon, Haryana',
    'Chennai, Tamil Nadu',
    'Nashik, Maharashtra',
    'Ahmedabad, Gujarat',
  ];

  const amenities = [
    'Gated Community',
    'Power Backup',
    'Water Supply',
    'Security',
    'Road Access',
    'Legal Clearance',
    'RERA Approved',
    'Bank Loan Available',
  ];

  // Properties loaded from database via useEffect

  const toggleFilter = (value: string, filterArray: string[], setFilter: (arr: string[]) => void) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(item => item !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSelectedAmenities([]);
    setPriceRange([0, 10]);
    setAreaRange([0, 100000]);
    setSearchQuery('');
  };

  const handleQuickInquiry = (property: any) => {
    setInquiryDialog({ open: true, property });
    setInquiryForm({
      name: '',
      email: '',
      phone: '',
      message: `I am interested in ${property.title} located in ${property.location}.`,
    });
  };

  const toggleFavorite = async (propertyId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }

    const isFavorite = favorites.includes(propertyId);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${propertyId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setFavorites(favorites.filter(id => id !== propertyId));
          toast.success('Removed from favorites');
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
        }
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!inquiryDialog.property) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          userType: 'other',
          inquiryType: 'property',
          subject: `Inquiry about ${inquiryDialog.property.title}`,
          message: inquiryForm.message,
          propertyReference: inquiryDialog.property.id.toString(),
        }),
      });

      if (response.ok) {
        toast.success('Inquiry sent successfully! We will contact you soon.');
        setInquiryDialog({ open: false, property: null });
        setInquiryForm({ name: '', email: '', phone: '', message: '' });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send inquiry');
      }
    } catch (error) {
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProperties = allProperties.filter(property => {
    // Search filter
    if (searchQuery && !property.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(property.type)) {
      return false;
    }

    // Location filter
    if (selectedLocations.length > 0 && !selectedLocations.includes(property.location)) {
      return false;
    }

    // Price filter
    if (property.price < priceRange[0] || property.price > priceRange[1]) {
      return false;
    }

    // Area filter
    if (property.area < areaRange[0] || property.area > areaRange[1]) {
      return false;
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      const hasAllAmenities = selectedAmenities.every(amenity => 
        property.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'area-low':
        return a.area - b.area;
      case 'area-high':
        return b.area - a.area;
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  const activeFiltersCount = selectedTypes.length + selectedLocations.length + selectedAmenities.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Browse All Properties - Residential, Commercial, Industrial & Farmland"
        description="Explore 36+ premium properties across India. Find residential homes, commercial spaces, industrial facilities, and farmland investments. Connect with verified property partners."
        keywords="properties for sale India, residential properties, commercial properties, industrial properties, farmland for sale, real estate listings, property investment opportunities"
        structuredData={propertiesSchema}
      />
      <div className="min-h-screen bg-muted/30">
      {/* Header Section */}
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Browse Properties</h1>
          <p className="text-muted-foreground mb-6">
            Discover {allProperties.length}+ verified properties across India
          </p>

          {/* Search and Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by property name or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="area-low">Area: Small to Large</SelectItem>
                <SelectItem value="area-high">Area: Large to Small</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Filters</CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-primary"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Type Filter */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Property Type</Label>
                  <div className="space-y-3">
                    {propertyTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.id}
                          checked={selectedTypes.includes(type.id)}
                          onCheckedChange={() => toggleFilter(type.id, selectedTypes, setSelectedTypes)}
                        />
                        <Label
                          htmlFor={type.id}
                          className="flex items-center gap-2 cursor-pointer font-normal"
                        >
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Location</Label>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {locations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={location}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={() => toggleFilter(location, selectedLocations, setSelectedLocations)}
                        />
                        <Label htmlFor={location} className="cursor-pointer font-normal">
                          {location}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Price Range: ₹{priceRange[0]} Cr - ₹{priceRange[1]} Cr
                  </Label>
                  <Slider
                    min={0}
                    max={10}
                    step={0.5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>

                {/* Area Range Filter */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Area: {areaRange[0].toLocaleString()} - {areaRange[1].toLocaleString()} sq.ft
                  </Label>
                  <Slider
                    min={0}
                    max={100000}
                    step={1000}
                    value={areaRange}
                    onValueChange={setAreaRange}
                    className="mt-2"
                  />
                </div>

                {/* Amenities Filter */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Amenities</Label>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => toggleFilter(amenity, selectedAmenities, setSelectedAmenities)}
                        />
                        <Label htmlFor={amenity} className="cursor-pointer font-normal">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Properties Grid */}
          <div className="flex-1">
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="gap-1">
                    {propertyTypes.find(t => t.id === type)?.label}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                    />
                  </Badge>
                ))}
                {selectedLocations.map((location) => (
                  <Badge key={location} variant="secondary" className="gap-1">
                    {location}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleFilter(location, selectedLocations, setSelectedLocations)}
                    />
                  </Badge>
                ))}
                {selectedAmenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="gap-1">
                    {amenity}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleFilter(amenity, selectedAmenities, setSelectedAmenities)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {sortedProperties.length} of {allProperties.length} properties
              </p>
            </div>

            {/* Properties Grid */}
            {sortedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProperties.map((property) => {
                  const PropertyIcon = propertyTypes.find(t => t.id === property.type)?.icon || Building2;
                  return (
                    <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer" onClick={() => navigate(`/property/${property.slug}`)}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {property.featured && (
                          <Badge className="absolute top-3 right-3 bg-primary">Featured</Badge>
                        )}
                        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground flex items-center gap-1">
                          <PropertyIcon className="w-3 h-3" />
                          {propertyTypes.find(t => t.id === property.type)?.label}
                        </Badge>
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(property.id, e)}
                          className="absolute bottom-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
                          aria-label={favorites.includes(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              favorites.includes(property.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-muted-foreground hover:text-red-500'
                            }`}
                          />
                        </button>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">{property.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {property.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Area</p>
                            <p className="font-semibold">
                              {property.area >= 43560 
                                ? `${(property.area / 43560).toFixed(1)} Acres` 
                                : `${property.area} sq.ft`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-bold text-primary text-xl">₹{property.price} Cr</p>
                          </div>
                        </div>
                        
                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {property.amenities.slice(0, 3).map((amenity: string) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {property.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{property.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickInquiry(property);
                            }}
                          >
                            Quick Inquiry
                          </Button>
                          <Button className="flex-1" onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/property/${property.slug}`);
                          }}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">No properties found matching your filters</p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Quick Inquiry Dialog */}
      <Dialog open={inquiryDialog.open} onOpenChange={(open) => setInquiryDialog({ open, property: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Inquiry</DialogTitle>
            <DialogDescription>
              {inquiryDialog.property && (
                <span>
                  Send an inquiry about <strong>{inquiryDialog.property.title}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quick-name">Name *</Label>
              <Input
                id="quick-name"
                placeholder="Your Name"
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-email">Email *</Label>
              <Input
                id="quick-email"
                type="email"
                placeholder="your@email.com"
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-phone">Phone *</Label>
              <Input
                id="quick-phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-message">Message</Label>
              <Textarea
                id="quick-message"
                placeholder="Your message..."
                rows={3}
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setInquiryDialog({ open: false, property: null })}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
