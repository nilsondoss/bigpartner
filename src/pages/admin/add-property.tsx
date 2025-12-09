import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, MapPin, DollarSign, FileText, Image, CheckCircle } from 'lucide-react';

interface PropertyFormData {
  // Basic Information
  title: string;
  city: string;
  state: string;
  price: string;
  area: string;
  pricePerSqft: string;
  propertyType: string;
  facing: string;

  // Description
  description: string;

  // Key Highlights
  highlights: string;

  // Specifications
  plotArea: string;
  boundaryWall: string;
  roadWidth: string;
  zoning: string;
  fsi: string;
  ownership: string;
  possession: string;

  // Amenities
  amenities: string;

  // Location & Nearby
  nearbyFacilities: string;

  // Documents
  documents: string[];

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    city: '',
    state: 'Tamil Nadu',
    price: '',
    area: '',
    pricePerSqft: '',
    propertyType: '',
    facing: '',
    description: '',
    highlights: '',
    plotArea: '',
    boundaryWall: '',
    roadWidth: '',
    zoning: '',
    fsi: '',
    ownership: '',
    possession: '',
    amenities: '',
    nearbyFacilities: '',
    documents: [],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  // Auto-calculate price per sq.ft
  const handlePriceOrAreaChange = (field: 'price' | 'area', value: string) => {
    const newFormData = { ...formData, [field]: value };

    if (newFormData.price && newFormData.area) {
      const price = parseFloat(newFormData.price);
      const area = parseFloat(newFormData.area);
      if (!isNaN(price) && !isNaN(area) && area > 0) {
        newFormData.pricePerSqft = (price / area).toFixed(2);
      }
    }

    setFormData(newFormData);
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentToggle = (doc: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.includes(doc)
        ? prev.documents.filter((d) => d !== doc)
        : [...prev.documents, doc],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.city || !formData.price || !formData.area) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Prepare property data
      const propertyData = {
        title: formData.title,
        location: `${formData.city}, ${formData.state}`,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        pricePerSqft: parseFloat(formData.pricePerSqft),
        type: formData.propertyType,
        facing: formData.facing,
        description: formData.description,
        highlights: formData.highlights.split('\n').filter((h) => h.trim()),
        specifications: {
          plotArea: formData.plotArea,
          facing: formData.facing,
          boundaryWall: formData.boundaryWall,
          roadWidth: formData.roadWidth,
          zoning: formData.zoning,
          fsi: formData.fsi,
          ownership: formData.ownership,
          possession: formData.possession,
        },
        amenities: formData.amenities.split('\n').filter((a) => a.trim()),
        nearbyFacilities: formData.nearbyFacilities.split('\n').filter((n) => n.trim()),
        documents: formData.documents,
        contact: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
        images: imagePreviews, // In production, upload to storage first
      };

      // Submit to API
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Failed to add property');
      }

      const result = await response.json();
      toast.success('Property added successfully!');
      navigate(`/properties/${result.slug || result.id}`);
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = [
    'Penthouse',
    'Apartment',
    'Villa',
    'Plot',
    'Farmland',
    'Commercial',
    'Industrial',
    'Rental',
    'Residential',
  ];

  const documentTypes = [
    'Title Deed',
    'Property Tax Receipt',
    'Survey Plan',
    'Approved Building Plan',
    'Encumbrance Certificate',
    'Patta / Chitta',
    'Other Documents',
  ];

  return (
    <RootLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Property</h1>
          <p className="text-muted-foreground">
            Fill in the details below to list a new property
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Essential property details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Property Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Luxury 3BHK Apartment in Anna Nagar"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g., Chennai"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="e.g., Tamil Nadu"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">
                    Price (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={formData.price}
                    onChange={(e) => handlePriceOrAreaChange('price', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="area">
                    Area (sq.ft) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="e.g., 1500"
                    value={formData.area}
                    onChange={(e) => handlePriceOrAreaChange('area', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerSqft">Price per sq.ft (₹)</Label>
                  <Input
                    id="pricePerSqft"
                    type="number"
                    placeholder="Auto-calculated"
                    value={formData.pricePerSqft}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">
                    Property Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleInputChange('propertyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="facing">Facing</Label>
                  <Input
                    id="facing"
                    placeholder="e.g., North, East, South-West"
                    value={formData.facing}
                    onChange={(e) => handleInputChange('facing', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
              <CardDescription>Detailed property description</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Provide a detailed description of the property, including unique features, condition, and any other relevant information..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Accordion Sections */}
          <Accordion type="multiple" className="space-y-4">
            {/* Key Highlights */}
            <AccordionItem value="highlights" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Key Highlights</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Label htmlFor="highlights">Highlights (one per line)</Label>
                <Textarea
                  id="highlights"
                  placeholder="• Prime location with excellent connectivity&#10;• Modern amenities and facilities&#10;• Spacious rooms with natural lighting&#10;• Secure gated community"
                  value={formData.highlights}
                  onChange={(e) => handleInputChange('highlights', e.target.value)}
                  rows={6}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Specifications */}
            <AccordionItem value="specifications" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span className="font-semibold">Specifications</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plotArea">Plot Area</Label>
                    <Input
                      id="plotArea"
                      placeholder="e.g., 2000 sq.ft"
                      value={formData.plotArea}
                      onChange={(e) => handleInputChange('plotArea', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="boundaryWall">Boundary Wall</Label>
                    <Input
                      id="boundaryWall"
                      placeholder="e.g., Yes / No / Partial"
                      value={formData.boundaryWall}
                      onChange={(e) => handleInputChange('boundaryWall', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roadWidth">Road Width</Label>
                    <Input
                      id="roadWidth"
                      placeholder="e.g., 30 feet"
                      value={formData.roadWidth}
                      onChange={(e) => handleInputChange('roadWidth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zoning">Zoning</Label>
                    <Input
                      id="zoning"
                      placeholder="e.g., Residential / Commercial"
                      value={formData.zoning}
                      onChange={(e) => handleInputChange('zoning', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fsi">Floor Space Index (FSI)</Label>
                    <Input
                      id="fsi"
                      placeholder="e.g., 1.5"
                      value={formData.fsi}
                      onChange={(e) => handleInputChange('fsi', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownership">Ownership</Label>
                    <Select
                      value={formData.ownership}
                      onValueChange={(value) => handleInputChange('ownership', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ownership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freehold">Freehold</SelectItem>
                        <SelectItem value="leasehold">Leasehold</SelectItem>
                        <SelectItem value="cooperative">Cooperative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="possession">Possession</Label>
                    <Input
                      id="possession"
                      placeholder="e.g., Immediate / Ready to Move / Under Construction"
                      value={formData.possession}
                      onChange={(e) => handleInputChange('possession', e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Amenities */}
            <AccordionItem value="amenities" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Amenities</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Label htmlFor="amenities">Amenities (one per line)</Label>
                <Textarea
                  id="amenities"
                  placeholder="• Swimming Pool&#10;• Gym&#10;• Clubhouse&#10;• Children's Play Area&#10;• 24/7 Security&#10;• Power Backup"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  rows={8}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Location & Nearby */}
            <AccordionItem value="location" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">Location & Nearby Facilities</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Label htmlFor="nearbyFacilities">Nearby Facilities (one per line)</Label>
                <Textarea
                  id="nearbyFacilities"
                  placeholder="• School – 500m&#10;• Shopping Mall – 1km&#10;• Hospital – 700m&#10;• Metro Station – 2km&#10;• IT Park – 3km"
                  value={formData.nearbyFacilities}
                  onChange={(e) => handleInputChange('nearbyFacilities', e.target.value)}
                  rows={8}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Documents */}
            <AccordionItem value="documents" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="font-semibold">Available Documents</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-3">
                  {documentTypes.map((doc) => (
                    <div key={doc} className="flex items-center space-x-2">
                      <Checkbox
                        id={doc}
                        checked={formData.documents.includes(doc)}
                        onCheckedChange={() => handleDocumentToggle(doc)}
                      />
                      <Label htmlFor={doc} className="cursor-pointer">
                        {doc}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Media Upload */}
            <AccordionItem value="media" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  <span className="font-semibold">Property Images</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="images">Upload Images</Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload multiple images (JPG, PNG, WebP)
                    </p>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Property contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    placeholder="e.g., John Doe"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="e.g., john@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="e.g., +91 98765 43210"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/properties')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding Property...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </div>
    </RootLayout>
  );
}
