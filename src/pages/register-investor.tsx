import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft, User, MapPin, Wallet, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Address', icon: MapPin },
  { id: 3, title: 'Investment Preferences', icon: Wallet },
  { id: 4, title: 'KYC Details', icon: FileText },
];

const PROPERTY_TYPES = [
  'Residential Plots',
  'Commercial Plots',
  'Industrial Plots',
  'Agricultural Land',
  'Gated Communities',
  'Villas',
  'Apartments',
];

const LOCATIONS = [
  'Hyderabad',
  'Bangalore',
  'Chennai',
  'Mumbai',
  'Pune',
  'Delhi NCR',
  'Kolkata',
  'Ahmedabad',
];

export default function RegisterInvestor() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    
    // Investment Preferences
    investmentBudgetMin: '',
    investmentBudgetMax: '',
    propertyTypes: [] as string[],
    preferredLocations: [] as string[],
    investmentPurpose: '',
    
    // KYC
    panNumber: '',
    aadharNumber: '',
    occupation: '',
    annualIncome: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleArrayField = (field: 'propertyTypes' | 'preferredLocations', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be 10 digits';
    }

    if (step === 2) {
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (step === 3) {
      if (!formData.investmentBudgetMin) newErrors.investmentBudgetMin = 'Minimum budget is required';
      if (!formData.investmentBudgetMax) newErrors.investmentBudgetMax = 'Maximum budget is required';
      if (formData.investmentBudgetMin && formData.investmentBudgetMax && 
          Number(formData.investmentBudgetMin) > Number(formData.investmentBudgetMax)) {
        newErrors.investmentBudgetMax = 'Maximum must be greater than minimum';
      }
      if (formData.propertyTypes.length === 0) newErrors.propertyTypes = 'Select at least one property type';
      if (formData.preferredLocations.length === 0) newErrors.preferredLocations = 'Select at least one location';
      if (!formData.investmentPurpose) newErrors.investmentPurpose = 'Investment purpose is required';
    }

    if (step === 4) {
      if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
        newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
      }
      if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
      else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
        newErrors.aadharNumber = 'Aadhar must be 12 digits';
      }
      if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
      if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/investors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyTypes: JSON.stringify(formData.propertyTypes),
          preferredLocations: JSON.stringify(formData.preferredLocations),
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setIsSuccess(true);
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you for registering with Big Partner. Our team will review your application and contact you within 2-3 business days.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/')}>
                  Back to Home
                </Button>
                <Button variant="outline" onClick={() => navigate('/properties')}>
                  Browse Properties
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Investor Registration</h1>
          <p className="text-muted-foreground">Join Big Partner and start your investment journey</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-6" />
          <div className="grid grid-cols-4 gap-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`text-sm font-medium text-center ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Please provide your personal information'}
              {currentStep === 2 && 'Enter your current address details'}
              {currentStep === 3 && 'Tell us about your investment preferences'}
              {currentStep === 4 && 'Complete KYC verification details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => updateField('addressLine1', e.target.value)}
                    placeholder="Street address, building name"
                  />
                  {errors.addressLine1 && <p className="text-sm text-destructive mt-1">{errors.addressLine1}</p>}
                </div>

                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => updateField('addressLine2', e.target.value)}
                    placeholder="Apartment, suite, unit (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="State"
                    />
                    {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => updateField('pincode', e.target.value)}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-sm text-destructive mt-1">{errors.pincode}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Investment Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Investment Budget Range (₹) *</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Input
                        id="investmentBudgetMin"
                        type="number"
                        value={formData.investmentBudgetMin}
                        onChange={(e) => updateField('investmentBudgetMin', e.target.value)}
                        placeholder="Minimum budget"
                      />
                      {errors.investmentBudgetMin && <p className="text-sm text-destructive mt-1">{errors.investmentBudgetMin}</p>}
                    </div>
                    <div>
                      <Input
                        id="investmentBudgetMax"
                        type="number"
                        value={formData.investmentBudgetMax}
                        onChange={(e) => updateField('investmentBudgetMax', e.target.value)}
                        placeholder="Maximum budget"
                      />
                      {errors.investmentBudgetMax && <p className="text-sm text-destructive mt-1">{errors.investmentBudgetMax}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Property Types of Interest *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {PROPERTY_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={formData.propertyTypes.includes(type)}
                          onCheckedChange={() => toggleArrayField('propertyTypes', type)}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.propertyTypes && <p className="text-sm text-destructive mt-1">{errors.propertyTypes}</p>}
                </div>

                <div>
                  <Label>Preferred Locations *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {LOCATIONS.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`loc-${location}`}
                          checked={formData.preferredLocations.includes(location)}
                          onCheckedChange={() => toggleArrayField('preferredLocations', location)}
                        />
                        <label
                          htmlFor={`loc-${location}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.preferredLocations && <p className="text-sm text-destructive mt-1">{errors.preferredLocations}</p>}
                </div>

                <div>
                  <Label htmlFor="investmentPurpose">Investment Purpose *</Label>
                  <Select value={formData.investmentPurpose} onValueChange={(value) => updateField('investmentPurpose', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select investment purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="capital_appreciation">Capital Appreciation</SelectItem>
                      <SelectItem value="rental_income">Rental Income</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.investmentPurpose && <p className="text-sm text-destructive mt-1">{errors.investmentPurpose}</p>}
                </div>
              </div>
            )}

            {/* Step 4: KYC Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => updateField('panNumber', e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                  {errors.panNumber && <p className="text-sm text-destructive mt-1">{errors.panNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                  <Input
                    id="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={(e) => updateField('aadharNumber', e.target.value)}
                    placeholder="12-digit Aadhar number"
                    maxLength={12}
                  />
                  {errors.aadharNumber && <p className="text-sm text-destructive mt-1">{errors.aadharNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => updateField('occupation', e.target.value)}
                    placeholder="Your occupation"
                  />
                  {errors.occupation && <p className="text-sm text-destructive mt-1">{errors.occupation}</p>}
                </div>

                <div>
                  <Label htmlFor="annualIncome">Annual Income *</Label>
                  <Select value={formData.annualIncome} onValueChange={(value) => updateField('annualIncome', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select annual income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below_5">Below ₹5 Lakhs</SelectItem>
                      <SelectItem value="5_10">₹5 - 10 Lakhs</SelectItem>
                      <SelectItem value="10_25">₹10 - 25 Lakhs</SelectItem>
                      <SelectItem value="25_50">₹25 - 50 Lakhs</SelectItem>
                      <SelectItem value="50_100">₹50 Lakhs - 1 Crore</SelectItem>
                      <SelectItem value="above_100">Above ₹1 Crore</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.annualIncome && <p className="text-sm text-destructive mt-1">{errors.annualIncome}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
