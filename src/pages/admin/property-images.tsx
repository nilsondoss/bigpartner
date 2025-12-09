import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Property {
  id: number;
  title: string;
  type: string;
  featuredImage: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
}

export default function PropertyImagesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties?limit=100');
        const data = await response.json();
        
        if (data.properties) {
          setProperties(data.properties);
        } else {
          setError('No properties found in response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedProperties = properties.reduce((acc, property) => {
    const type = property.type || 'Unknown';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Property Images</h1>
        <p className="text-muted-foreground">
          Displaying {properties.length} properties across {Object.keys(groupedProperties).length} categories
        </p>
      </div>

      {Object.entries(groupedProperties).map(([type, props]) => (
        <div key={type} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold">{type}</h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {props.length} {props.length === 1 ? 'property' : 'properties'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-muted">
                  {property.featuredImage ? (
                    <img
                      src={property.featuredImage}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2">
                    {property.type}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">{property.location}</p>

                  {(property.bedrooms || property.bathrooms) && (
                    <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t">
                      {property.bedrooms && (
                        <span>{property.bedrooms} bed</span>
                      )}
                      {property.bathrooms && (
                        <span>{property.bathrooms} bath</span>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground font-mono break-all">
                      ID: {property.id}
                    </p>
                    {property.featuredImage && (
                      <p className="text-xs text-muted-foreground font-mono break-all mt-1">
                        Image: {property.featuredImage.substring(0, 60)}...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {properties.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No properties found in the database.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
