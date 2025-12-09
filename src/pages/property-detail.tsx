import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Building2,
  Ruler,
  IndianRupee,
  MapPinned,
  FileText,
  User,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  // Fetch property and increment view counter
  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) return;
      
      try {
        const response = await fetch(`/api/properties/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
          setViewCount(data.viewCount || 0);
          
          // Increment view counter
          fetch(`/api/properties/${slug}/view`, { method: 'POST' }).catch(() => {});
        } else {
          toast.error('Property not found');
          navigate('/properties');
        }
      } catch (error) {
        toast.error('Failed to load property');
        navigate('/properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [slug, navigate]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !property) return;
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          const favoriteIds = data.map((fav: any) => fav.propertyId);
          setIsFavorite(favoriteIds.includes(property.id));
        }
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      }
    };
    fetchFavorites();
  }, [user, property]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  // Transform property data to match expected format
  const propertyData = {
    id: property.id,
    title: property.title,
    location: `${property.city}, ${property.state}`,
    area: property.area,
    price: property.price,
    type: property.type,
    status: property.status,
    images: (() => {
      // Use featured_image field from database (snake_case)
      const featuredImage = (property as any).featured_image;
      if (!featuredImage) return ['https://media.gettyimages.com/id/2155866641/photo/aerial-view-of-steel-plant-industry-in-scunthorpe-uk.jpg?b=1&s=2048x2048&w=0&k=20&c=02re6ZhNT-7hZQY1T6Os-uNuROk9YJScJhFqz-MHxHg='];
      return [featuredImage];
    })(),
    description: property.description,
    highlights: (() => {
      if (!property.highlights) return [];
      try {
        const parsed = JSON.parse(property.highlights);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })(),
    amenities: (() => {
      if (!property.amenities) return [];
      try {
        const parsed = JSON.parse(property.amenities);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })(),
    specifications: {
      plotArea: `${property.area} sq.ft`,
      facing: property.facing || 'N/A',
      boundaryWall: property.boundaryWall || 'N/A',
      roadWidth: property.roadWidth || 'N/A',
      zoning: property.zoning || property.type,
      floorSpaceIndex: property.fsi || 'N/A',
      ownership: property.ownership || 'N/A',
      possession: property.possession || 'N/A',
    },
    nearbyFacilities: (() => {
      if (!property.nearbyFacilities) return [];
      try {
        const parsed = JSON.parse(property.nearbyFacilities);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })(),
    channelPartner: {
      name: property.partnerName || 'Big Partner',
      rating: 4.8,
      totalDeals: 156,
      experience: '12 years',
      phone: property.partnerContact || '+91 9600047740',
      email: property.partnerEmail || 'info@bigpartner.in',
      image: 'https://media.gettyimages.com/id/1443177554/photo/successful-agreement-at-construction-site.jpg?b=1&s=2048x2048&w=0&k=20&c=Kdab8mhxZiGko8hdpW7fYya0eDAPNa9wJE__YoJ-mIU=',
    },
    documents: (() => {
      if (!property.documents) return ['Title Deed', 'Property Tax Receipt', 'Survey Plan', 'Approved Building Plan'];
      try {
        const parsed = JSON.parse(property.documents);
        return Array.isArray(parsed) ? parsed : ['Title Deed', 'Property Tax Receipt', 'Survey Plan', 'Approved Building Plan'];
      } catch {
        return ['Title Deed', 'Property Tax Receipt', 'Survey Plan', 'Approved Building Plan'];
      }
    })(),
    postedDate: property.createdAt || new Date().toISOString(),
    views: 0,
    inquiries: 0,
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length);
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+919600047740';
  };

  const handleEmailContact = () => {
    window.location.href = 'mailto:info@bigpartner.in?subject=Property Inquiry - ' + propertyData.title;
  };

  const handleShare = async () => {
    const shareData = {
      title: propertyData.title,
      text: `Check out this property: ${propertyData.title} - ₹${propertyData.price.toLocaleString('en-IN')}`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Property shared successfully!');
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success('Link copied to clipboard!');
        } catch (clipboardError) {
          toast.error('Failed to share property');
        }
      }
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${property.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setIsFavorite(false);
          toast.success('Removed from favorites');
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId: property.id }),
        });
        if (response.ok) {
          setIsFavorite(true);
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
          subject: `Inquiry about ${propertyData.title}`,
          message: inquiryForm.message || `I am interested in the property: ${propertyData.title} (${propertyData.location})`,
          propertyReference: propertyData.id.toString(),
        }),
      });

      if (response.ok) {
        toast.success('Inquiry sent successfully! We will contact you soon.');
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

  // Structured data for property
  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: propertyData.title,
    description: propertyData.description,
    url: `https://bigpartner.in/property/${property.slug}`,
    image: propertyData.images[0],
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.latitude || 0,
      longitude: property.longitude || 0,
    },
    offers: {
      '@type': 'Offer',
      price: propertyData.price,
      priceCurrency: 'INR',
      availability: property.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: propertyData.area,
      unitText: 'SQ FT',
    },
  };

  return (
    <>
      <SEO
        title={`${propertyData.title} - ${propertyData.location}`}
        description={`${propertyData.description.substring(0, 150)}... Property details: ${propertyData.area} sq ft, ${propertyData.type}, ${propertyData.status}. Contact Big Partner for more information.`}
        keywords={`${propertyData.type} property, ${property.city} real estate, ${property.state} property, ${propertyData.area} sq ft property, property for sale ${property.city}`}
        ogImage={propertyData.images[0]}
        ogType="product"
        canonical={`https://bigpartner.in/property/${property.slug}`}
        structuredData={propertySchema}
      />
      <div className="min-h-screen bg-muted/30">
      {/* Back Navigation */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/properties')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-[400px] md:h-[500px] bg-muted">
                <img
                  src={propertyData.images[currentImageIndex]}
                  alt={propertyData.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {propertyData.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {propertyData.images.length}
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Status Badge */}
                <Badge className="absolute top-4 left-4 bg-green-500">
                  {propertyData.status}
                </Badge>
              </div>

              {/* Thumbnail Gallery */}
              {propertyData.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {propertyData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-primary'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Property Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{propertyData.type}</Badge>
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="w-3 h-3" />
                        Posted: {new Date(propertyData.postedDate).toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Eye className="w-3 h-3" />
                        {viewCount} views
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-3xl">{propertyData.title}</CardTitle>
                      {property?.isVerified && <VerifiedBadge size="lg" />}
                    </div>
                    <CardDescription className="flex items-center gap-1 text-base">
                      <MapPin className="w-4 h-4" />
                      {propertyData.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="text-4xl font-bold text-primary">₹{propertyData.price} Cr</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-semibold">{propertyData.area} sq.ft</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price/sq.ft</p>
                      <p className="font-semibold">₹{((propertyData.price * 10000000) / propertyData.area).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-semibold">{propertyData.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPinned className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Facing</p>
                      <p className="font-semibold">{propertyData.specifications.facing}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{propertyData.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {propertyData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(propertyData.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Amenities</CardTitle>
                    <CardDescription>
                      This property comes with the following amenities and facilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {propertyData.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardHeader>
                    <CardTitle>Location & Nearby Facilities</CardTitle>
                    <CardDescription>Key landmarks and facilities near this property</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {propertyData.nearbyFacilities.map((facility, index) => (
                        <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span className="font-medium">{facility.name}</span>
                          </div>
                          <Badge variant="outline">{facility.distance}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Documents</CardTitle>
                    <CardDescription>All legal documents and clearances for this property</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {propertyData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Channel Partner Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Channel Partner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={propertyData.channelPartner.image}
                      alt={propertyData.channelPartner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{propertyData.channelPartner.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{propertyData.channelPartner.rating}</span>
                      <span>•</span>
                      <span>{propertyData.channelPartner.totalDeals} deals</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{propertyData.channelPartner.experience} experience</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full gap-2" size="lg" onClick={handlePhoneCall}>
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full gap-2" size="lg" onClick={handleEmailContact}>
                    <Mail className="w-4 h-4" />
                    Send Email
                  </Button>
                </div>

                <Separator />

                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <Label htmlFor="inquiry-name">Send Inquiry</Label>
                  <Input
                    id="inquiry-name"
                    placeholder="Your Name *"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email *"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Your Phone *"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Your Message (optional)"
                    rows={3}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Views</span>
                  <span className="font-semibold">{propertyData.views.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Inquiries</span>
                  <span className="font-semibold">{propertyData.inquiries}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Posted On</span>
                  <span className="font-semibold">
                    {new Date(propertyData.postedDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
