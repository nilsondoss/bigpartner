import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, DollarSign, Maximize, Search, SlidersHorizontal } from 'lucide-react';
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

export default function FarmLandPropertiesPage() {
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
      const response = await fetch('/api/properties?limit=100');
      const data = await response.json();
      const farmlandTypes = ['farmland', 'Farmland', 'Agricultural', 'agricultural'];
      const filtered = (data.properties || []).filter((p: Property) => 
        farmlandTypes.includes(p.type)
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
      (priceRange === 'under-500k' && property.price < 500000) ||
      (priceRange === '500k-1m' && property.price >= 500000 && property.price < 1000000) ||
      (priceRange === '1m-5m' && property.price >= 1000000 && property.price < 5000000) ||
      (priceRange === 'over-5m' && property.price >= 5000000);

    const matchesSize = sizeRange === 'all' ||
      (sizeRange === 'under-10' && property.size < 10) ||
      (sizeRange === '10-50' && property.size >= 10 && property.size < 50) ||
      (sizeRange === '50-100' && property.size >= 50 && property.size < 100) ||
      (sizeRange === 'over-100' && property.size >= 100);

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
              <Sprout className="h-8 w-8 text-primary" />
              <Badge variant="secondary" className="text-sm">Farm Land Properties</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Agricultural Land & Farms
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore fertile farmland, ranches, orchards, and agricultural properties perfect for farming operations and rural investments.
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
                <SelectItem value="under-500k">Under $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                <SelectItem value="over-5m">Over $5M</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sizeRange} onValueChange={setSizeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Land Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="under-10">Under 10 acres</SelectItem>
                <SelectItem value="10-50">10 - 50 acres</SelectItem>
                <SelectItem value="50-100">50 - 100 acres</SelectItem>
                <SelectItem value="over-100">Over 100 acres</SelectItem>
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
              <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
                          <span className="text-sm">{formatSize(property.size)} acres</span>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Invest in Agricultural Land?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our agricultural real estate specialists can help you find the perfect farmland for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">Contact Our Team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/for-partners">List Your Farm</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
