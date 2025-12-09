import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { Building2, FileText, CheckCircle, MapPin, Image as ImageIcon, DollarSign } from 'lucide-react';
import RootLayout from '@/layouts/RootLayout';

interface PropertyFormData {
  title: string;
  location: string;
  city: string;
  state: string;
  price: string;
  area: string;
  pricePerSqft: string;
  type: string;
  facing: string;
  description: string;
  highlights: string;
  plotArea: string;
  boundaryWall: string;
  roadWidth: string;
  zoning: string;
  fsi: string;
  ownership: string;
  possession: string;
  amenities: string;
  nearbyFacilities: string;
  documents: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  images: string[];
}

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    location: '',
    city: '',
    state: '',
    price: '',
    area: '',
    pricePerSqft: '',
    type: '',
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
    images: [],
  });

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Failed to load property');
        }
        const property = await response.json();
        
        // Parse JSON fields
        const amenities = property.amenities ? JSON.parse(property.amenities) : [];
        const images = property.images ? JSON.parse(property.images) : [];
        
        setFormData({
          title: property.title || '',
          location: property.location || '',
          city: property.city || '',
          state: property.state || '',
          price: property.price?.toString() || '',
          area: property.area?.toString() || '',
          pricePerSqft: property.pricePerSqft?.toString() || '',
          type: property.type || '',
          facing: property.facing || '',
          description: property.description || '',
          highlights: property.highlights || '',
          plotArea: property.plotArea || '',
          boundaryWall: property.boundaryWall || '',
          roadWidth: property.roadWidth || '',
          zoning: property.zoning || '',
          fsi: property.fsi || '',
          ownership: property.ownership || '',
          possession: property.possession || '',
          amenities: amenities.join('\n'),
          nearbyFacilities: property.nearbyFacilities || '',
          documents: property.documents ? JSON.parse(property.documents) : [],
          contactName: property.contactName || '',
          contactEmail: property.contactEmail || '',
          contactPhone: property.contactPhone || '',
          images: images,
        });
        
        // Set existing images as previews
        setImagePreviews(images);
        
        setLoadingProperty(false);
      } catch (error) {
        console.error('Error loading property:', error);
        toast.error('Failed to load property');
        setLoadingProperty(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  // Auto-calculate price per sqft
  useEffect(() => {
    if (formData.price && formData.area) {
      const price = parseFloat(formData.price);
      const area = parseFloat(formData.area);
      if (!isNaN(price) && !isNaN(area) && area > 0) {
        const pricePerSqft = (price / area).toFixed(2);
        setFormData((prev) => ({ ...prev, pricePerSqft }));
      }
    }
  }, [formData.price, formData.area]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentToggle = (document: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.includes(document)
        ? prev.documents.filter((d) => d !== document)
        : [...prev.documents, document],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (index < formData.images.length) {
      // Removing existing image
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      // Removing new image
      const newImageIndex = index - formData.images.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== newImageIndex));
    }
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

      // Prepare data for submission
      const submitData = {
        title: formData.title,
        location: `${formData.city}${formData.state ? ', ' + formData.state : ''}`,
        city: formData.city,
        state: formData.state,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        pricePerSqft: parseFloat(formData.pricePerSqft),
        type: formData.type,
        facing: formData.facing,
        description: formData.description,
        highlights: formData.highlights,
        plotArea: formData.plotArea,
        boundaryWall: formData.boundaryWall,
        roadWidth: formData.roadWidth,
        zoning: formData.zoning,
        fsi: formData.fsi,
        ownership: formData.ownership,
        possession: formData.possession,
        amenities: JSON.stringify(
          formData.amenities
            .split('\n')
            .map((a) => a.trim())
            .filter((a) => a)
        ),
        nearbyFacilities: formData.nearbyFacilities,
        documents: JSON.stringify(formData.documents),
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        images: JSON.stringify([...formData.images, ...imagePreviews.slice(formData.images.length)]),
      };

      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      toast.success('Property updated successfully!');
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProperty) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading property...</p>
          </div>
        </div>
      </Dashboard>
    );
  }

  const documentsList = [
    'Title Deed',
    'Property Tax Receipt',
    'Survey Plan',
    'Approved Building Plan',
    'Encumbrance Certificate',
    'Patta / Chitta',
    'NOC from Local Authority',
    'Sale Agreement',
  ];

  return (
    <RootLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Property</h1>
          <p className="text-muted-foreground">Update property information and details</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="title">
                    Property Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury 3BHK Apartment in Prime Location"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Chennai"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g., Tamil Nadu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="farmland">Farmland</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="rental">Rental</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">
                    Area (sq.ft) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerSqft">Price per sq.ft (₹)</Label>
                  <Input
                    id="pricePerSqft"
                    name="pricePerSqft"
                    type="number"
                    value={formData.pricePerSqft}
                    readOnly
                    className="bg-muted"
                    placeholder="Auto-calculated"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facing">Facing</Label>
                  <Select value={formData.facing} onValueChange={(value) => handleSelectChange('facing', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                      <SelectItem value="North-West">North-West</SelectItem>
                      <SelectItem value="South-East">South-East</SelectItem>
                      <SelectItem value="South-West">South-West</SelectItem>
                    </SelectContent>
                  </Select>
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
            </CardHeader>
            <CardContent>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the property..."
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Accordion Sections */}
          <Accordion type="multiple" className="space-y-4">
            {/* Key Highlights */}
            <AccordionItem value="highlights">
              <Card>
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5" />
                    Key Highlights
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4">
                    <Textarea
                      name="highlights"
                      value={formData.highlights}
                      onChange={handleInputChange}
                      placeholder="Enter key highlights (one per line)&#10;e.g.,&#10;Prime location&#10;Spacious rooms&#10;Modern amenities"
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground mt-2">Enter one highlight per line</p>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Specifications */}
            <AccordionItem value="specifications">
              <Card>
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5" />
                    Specifications
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plotArea">Plot Area</Label>
                        <Input
                          id="plotArea"
                          name="plotArea"
                          value={formData.plotArea}
                          onChange={handleInputChange}
                          placeholder="e.g., 2000 sq.ft"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="boundaryWall">Boundary Wall</Label>
                        <Input
                          id="boundaryWall"
                          name="boundaryWall"
                          value={formData.boundaryWall}
                          onChange={handleInputChange}
                          placeholder="e.g., Yes / No"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roadWidth">Road Width</Label>
                        <Input
                          id="roadWidth"
                          name="roadWidth"
                          value={formData.roadWidth}
                          onChange={handleInputChange}
                          placeholder="e.g., 40 feet"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zoning">Zoning</Label>
                        <Input
                          id="zoning"
                          name="zoning"
                          value={formData.zoning}
                          onChange={handleInputChange}
                          placeholder="e.g., Residential"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fsi">FSI</Label>
                        <Input
                          id="fsi"
                          name="fsi"
                          value={formData.fsi}
                          onChange={handleInputChange}
                          placeholder="e.g., 1.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownership">Ownership</Label>
                        <Input
                          id="ownership"
                          name="ownership"
                          value={formData.ownership}
                          onChange={handleInputChange}
                          placeholder="e.g., Freehold"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="possession">Possession</Label>
                        <Input
                          id="possession"
                          name="possession"
                          value={formData.possession}
                          onChange={handleInputChange}
                          placeholder="e.g., Immediate / Ready to move"
                        />
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Amenities */}
            <AccordionItem value="amenities">
              <Card>
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5" />
                    Amenities
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4">
                    <Textarea
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleInputChange}
                      placeholder="Enter amenities (one per line)&#10;e.g.,&#10;Swimming Pool&#10;Gym&#10;Parking&#10;Security"
                      rows={8}
                    />
                    <p className="text-sm text-muted-foreground mt-2">Enter one amenity per line</p>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Location & Nearby */}
            <AccordionItem value="nearby">
              <Card>
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="h-5 w-5" />
                    Location & Nearby Facilities
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4">
                    <Textarea
                      name="nearbyFacilities"
                      value={formData.nearbyFacilities}
                      onChange={handleInputChange}
                      placeholder="Enter nearby facilities (one per line)&#10;e.g.,&#10;School - 500m&#10;Hospital - 1km&#10;Shopping Mall - 2km"
                      rows={8}
                    />
                    <p className="text-sm text-muted-foreground mt-2">Enter one facility per line with distance</p>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Documents */}
            <AccordionItem value="documents">
              <Card>
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5" />
                    Available Documents
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documentsList.map((doc) => (
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
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Images */}
            <AccordionItem value="images">
              <Card>
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ImageIcon className="h-5 w-5" />
                    Property Images
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <Label htmlFor="images">Upload Images</Label>
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload multiple images (JPG, PNG, GIF, WebP)
                      </p>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="e.g., john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="e.g., +91 98765 43210"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Property'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/properties')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </RootLayout>
  );
}
