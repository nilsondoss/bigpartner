import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface FormData {
  // Company Information
  companyName: string;
  companyType: string;
  registrationNumber: string;
  gstNumber: string;
  reraNumber: string;
  
  // Contact Information
  contactPersonName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  
  // Address
  officeAddress: string;
  city: string;
  state: string;
  pincode: string;
  
  // Business Details
  yearsInBusiness: string;
  numberOfProjects: string;
  specialization: string[];
  operatingCities: string[];
  websiteUrl: string;
}

const companyTypes = [
  'Real Estate Developer',
  'Builder',
  'Property Broker',
  'Construction Company',
  'Real Estate Consultant',
  'Property Management',
];

const specializationOptions = [
  'Residential Projects',
  'Commercial Projects',
  'Industrial Projects',
  'Plotted Developments',
  'Luxury Villas',
  'Affordable Housing',
  'Mixed-Use Developments',
  'Gated Communities',
];

const cityOptions = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

export default function RegisterPartner() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyType: '',
    registrationNumber: '',
    gstNumber: '',
    reraNumber: '',
    contactPersonName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    officeAddress: '',
    city: '',
    state: '',
    pincode: '',
    yearsInBusiness: '',
    numberOfProjects: '',
    specialization: [],
    operatingCities: [],
    websiteUrl: '',
  });

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleArrayField = (field: 'specialization' | 'operatingCities', value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.companyType) newErrors.companyType = 'Company type is required';
      if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required';
    }

    if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    }

    if (step === 3) {
      if (!formData.officeAddress.trim()) newErrors.officeAddress = 'Office address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be 6 digits';
      }
    }

    if (step === 4) {
      if (formData.specialization.length === 0) {
        newErrors.specialization = 'Select at least one specialization';
      }
      if (formData.operatingCities.length === 0) {
        newErrors.operatingCities = 'Select at least one operating city';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          specialization: JSON.stringify(formData.specialization),
          operatingCities: JSON.stringify(formData.operatingCities),
          yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
          numberOfProjects: formData.numberOfProjects ? parseInt(formData.numberOfProjects) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSubmitSuccess(true);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/20">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Registration Successful!</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Thank you for registering with Big Partner. Our team will review your application and contact you within 2-3 business days.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You will receive a confirmation email at <strong>{formData.email}</strong>
                </p>
                <Button onClick={() => navigate('/')} size="lg">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Partner Registration</h1>
          <p className="text-muted-foreground text-lg">
            Join Big Partner and showcase your properties to thousands of investors
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Company Information'}
              {currentStep === 2 && 'Contact Details'}
              {currentStep === 3 && 'Office Address'}
              {currentStep === 4 && 'Business Details'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about your company'}
              {currentStep === 2 && 'How can we reach you?'}
              {currentStep === 3 && 'Where is your office located?'}
              {currentStep === 4 && 'Share your business expertise'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      placeholder="Enter your company name"
                    />
                    {errors.companyName && (
                      <p className="text-sm text-destructive">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyType">Company Type *</Label>
                    <select
                      id="companyType"
                      value={formData.companyType}
                      onChange={(e) => updateFormData('companyType', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Select company type</option>
                      {companyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.companyType && (
                      <p className="text-sm text-destructive">{errors.companyType}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                    <Input
                      id="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={(e) => updateFormData('contactPersonName', e.target.value)}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPersonName && (
                      <p className="text-sm text-destructive">{errors.contactPersonName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                        placeholder="Company registration number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => updateFormData('gstNumber', e.target.value)}
                        placeholder="GST number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reraNumber">RERA Number</Label>
                    <Input
                      id="reraNumber"
                      value={formData.reraNumber}
                      onChange={(e) => updateFormData('reraNumber', e.target.value)}
                      placeholder="RERA registration number"
                    />
                  </div>
                </>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="company@example.com"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
                    <Input
                      id="alternatePhone"
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => updateFormData('alternatePhone', e.target.value)}
                      placeholder="Alternate contact number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>
                </>
              )}

              {/* Step 3: Office Address */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="officeAddress">Office Address *</Label>
                    <Textarea
                      id="officeAddress"
                      value={formData.officeAddress}
                      onChange={(e) => updateFormData('officeAddress', e.target.value)}
                      placeholder="Enter complete office address"
                      rows={3}
                    />
                    {errors.officeAddress && (
                      <p className="text-sm text-destructive">{errors.officeAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateFormData('state', e.target.value)}
                        placeholder="State"
                      />
                      {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => updateFormData('pincode', e.target.value)}
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
                  </div>
                </>
              )}

              {/* Step 4: Business Details */}
              {currentStep === 4 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business</Label>
                      <Input
                        id="yearsInBusiness"
                        type="number"
                        value={formData.yearsInBusiness}
                        onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
                        placeholder="Number of years"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfProjects">Number of Projects Completed</Label>
                      <Input
                        id="numberOfProjects"
                        type="number"
                        value={formData.numberOfProjects}
                        onChange={(e) => updateFormData('numberOfProjects', e.target.value)}
                        placeholder="Total projects"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Specialization *</Label>
                    <p className="text-sm text-muted-foreground">Select all that apply</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {specializationOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`spec-${option}`}
                            checked={formData.specialization.includes(option)}
                            onCheckedChange={() => toggleArrayField('specialization', option)}
                          />
                          <label
                            htmlFor={`spec-${option}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.specialization && (
                      <p className="text-sm text-destructive">{errors.specialization}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Operating Cities *</Label>
                    <p className="text-sm text-muted-foreground">Select cities where you operate</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {cityOptions.map((city) => (
                        <div key={city} className="flex items-center space-x-2">
                          <Checkbox
                            id={`city-${city}`}
                            checked={formData.operatingCities.includes(city)}
                            onCheckedChange={() => toggleArrayField('operatingCities', city)}
                          />
                          <label
                            htmlFor={`city-${city}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {city}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.operatingCities && (
                      <p className="text-sm text-destructive">{errors.operatingCities}</p>
                    )}
                  </div>
                </>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help? Contact us at <a href="mailto:info@bigpartner.in" className="text-primary hover:underline">info@bigpartner.in</a>
        </p>
      </div>
    </div>
  );
}
