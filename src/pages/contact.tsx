import { useState } from 'react';
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    userType: 'other',
    subject: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Temporarily disable reCAPTCHA due to React 19 compatibility issue
  // const { executeRecaptcha } = useGoogleReCaptcha();
  const executeRecaptcha = null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Execute reCAPTCHA verification
      let recaptchaToken = '';
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('contact_form');
      }
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit inquiry');
      }

      setIsSuccess(true);
      toast.success('Inquiry submitted successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        userType: 'other',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
              <p className="text-muted-foreground mb-8">
                Your inquiry has been submitted successfully. Our team will get back to you within 24-48 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setIsSuccess(false)}>Submit Another Inquiry</Button>
                <Button variant="outline" onClick={() => (window.location.href = '/')}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Structured data for contact page
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Big Partner',
    description: 'Premier real estate investment and partnership platform in India',
    url: 'https://bigpartner.in',
    telephone: '+919600047740',
    email: 'info@bigpartner.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '#61, 5th Cross Street, Logaiah Colony, Saligramam',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      postalCode: '600093',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.0569,
      longitude: 80.2091,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '₹₹₹',
  };

  return (
    <>
      <SEO
        title="Contact Us - Get in Touch with Big Partner"
        description="Contact Big Partner for real estate investment inquiries. Email: info@bigpartner.in, Phone: +91 9600047740. Located in Chennai, serving all of India. We respond within 24-48 hours."
        keywords="contact big partner, real estate inquiry, property investment contact, Chennai real estate contact, big partner email, big partner phone"
        canonical="https://bigpartner.in/contact"
        structuredData={contactSchema}
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">info@bigpartner.in</p>
                    <p className="text-sm text-muted-foreground">support@bigpartner.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-sm text-muted-foreground">+91 9600047740</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Address</h3>
                    <p className="text-sm text-muted-foreground">
                      #61, 5th Cross Street, Logaiah Colony
                      <br />
                      Saligramam, Chennai - 600 093
                      <br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-sm text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Quick Response</h3>
                <p className="text-sm opacity-90">
                  We typically respond to inquiries within 24-48 hours during business days.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userType">I am a</Label>
                      <Select value={formData.userType} onValueChange={(value) => handleChange('userType', value)}>
                        <SelectTrigger id="userType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="partner">Partner/Developer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">
                      Inquiry Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleChange('inquiryType', value)}>
                      <SelectTrigger id="inquiryType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="property">Property Information</SelectItem>
                        <SelectItem value="investment">Investment Opportunity</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
