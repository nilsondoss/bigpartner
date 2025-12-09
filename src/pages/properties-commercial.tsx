import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, MapPin, DollarSign, Maximize, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Property {
  id: number;
  title: string;
  slug: string;
  location: string;
  price: number;
  size: number;
  type: string;
  status: string;
  image: string;
  featuredImage?: string;
  description: string;
}

export default function CommercialPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sizeRange, setSizeRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // Fetch commercial properties
      const response = await fetch('/api/properties?limit=100');
      const data = await response.json();
      // Filter for commercial types
      const commercialTypes = ['commercial', 'Commercial'];
      const filtered = (data.properties || []).filter((p: Property) => 
        commercialTypes.includes(p.type)
      );
      setProperties(filtered);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'under-1m' && property.price < 1000000) ||
      (priceRange === '1m-5m' && property.price >= 1000000 && property.price < 5000000) ||
      (priceRange === '5m-10m' && property.price >= 5000000 && property.price < 10000000) ||
      (priceRange === 'over-10m' && property.price >= 10000000);

    const matchesSize = sizeRange === 'all' ||
      (sizeRange === 'under-5k' && property.size < 5000) ||
      (sizeRange === '5k-10k' && property.size >= 5000 && property.size < 10000) ||
      (sizeRange === '10k-20k' && property.size >= 10000 && property.size < 20000) ||
      (sizeRange === 'over-20k' && property.size >= 20000);

    return matchesSearch && matchesPrice && matchesSize;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'size-low':
        return a.size - b.size;
      case 'size-high':
        return b.size - a.size;
      default:
        return b.id - a.id;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatSize = (size: number) => {
    return new Intl.NumberFormat('en-US').format(size);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-8 w-8 text-primary" />
              <Badge variant="secondary" className="text-sm">Commercial Properties</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Prime Commercial Real Estate
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover retail spaces, office buildings, shopping centers, and mixed-use developments in high-traffic locations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location or property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1m">Under $1M</SelectItem>
                <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                <SelectItem value="over-10m">Over $10M</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sizeRange} onValueChange={setSizeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Size Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="under-5k">Under 5k sq ft</SelectItem>
                <SelectItem value="5k-10k">5k - 10k sq ft</SelectItem>
                <SelectItem value="10k-20k">10k - 20k sq ft</SelectItem>
                <SelectItem value="over-20k">Over 20k sq ft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="size-low">Size: Small to Large</SelectItem>
                <SelectItem value="size-high">Size: Large to Small</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {sortedProperties.length} {sortedProperties.length === 1 ? 'property' : 'properties'}
            </p>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setPriceRange('all');
                setSizeRange('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((property) => (
                <Link key={property.id} to={`/properties/${property.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={property.featuredImage || '/placeholder-property.jpg'}
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        {property.status}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm line-clamp-1">{property.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {property.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{formatPrice(property.price)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Maximize className="h-4 w-4" />
                          <span className="text-sm">{formatSize(property.size)} sq ft</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Looking for the Perfect Commercial Space?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our commercial real estate experts can help you find the ideal location for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">Contact Our Team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/for-partners">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
