import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { SEO, organizationSchema } from '@/components/SEO';
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
import { Search, MapPin, TrendingUp, Users, Building2, Home, Factory, Sprout, Key, CheckCircle, Star, ArrowRight, Phone, Mail } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  
  const homeSchema = {
    ...organizationSchema,
    '@type': ['RealEstateAgent', 'Organization'],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };
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

  const handleQuickInquiry = (property: any) => {
    setInquiryDialog({ open: true, property });
    setInquiryForm({
      name: '',
      email: '',
      phone: '',
      message: `I am interested in ${property.title} located in ${property.location}.`,
    });
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
  const propertyTypes = [
    { icon: Factory, label: 'Industrial', count: '150+ Plots', color: 'bg-blue-500', href: '/properties-industrial' },
    { icon: Home, label: 'Residential', count: '200+ Layouts', color: 'bg-green-500', href: '/properties-residential' },
    { icon: Building2, label: 'Commercial', count: '80+ Properties', color: 'bg-purple-500', href: '/properties-commercial' },
    { icon: Sprout, label: 'Farm Land', count: '120+ Acres', color: 'bg-amber-500', href: '/properties-farmland' },
    { icon: Key, label: 'Rental', count: '90+ Units', color: 'bg-rose-500', href: '/properties-rental' },
  ];

  const featuredProperties = [
    {
      id: 1,
      title: 'Premium Industrial Plot - MIDC Area',
      location: 'Pune, Maharashtra',
      area: '5000 sq.ft',
      price: '₹2.5 Cr',
      type: 'Industrial',
      image: 'https://media.gettyimages.com/id/2155866641/photo/aerial-view-of-steel-plant-industry-in-scunthorpe-uk.jpg?b=1&s=2048x2048&w=0&k=20&c=02re6ZhNT-7hZQY1T6Os-uNuROk9YJScJhFqz-MHxHg=',
      featured: true,
    },
    {
      id: 2,
      title: 'Luxury Gated Community Plots',
      location: 'Bangalore, Karnataka',
      area: '2400 sq.ft',
      price: '₹1.8 Cr',
      type: 'Residential',
      image: 'https://media.gettyimages.com/id/691254458/photo/looking-down-on-beautiful-suburban-homes-springtime-aerial-view.jpg?b=1&s=2048x2048&w=0&k=20&c=OmEmuMYuZcYoy1N3Gt8dGjRq0EXTeGuobz4ydmu2Fic=',
      featured: true,
    },
    {
      id: 3,
      title: 'Commercial Complex Land',
      location: 'Gurgaon, Haryana',
      area: '8000 sq.ft',
      price: '₹4.2 Cr',
      type: 'Commercial',
      image: 'https://media.gettyimages.com/id/2207856945/photo/high-angle-drone-shot-of-suburban-silicon-valley-office-park.jpg?b=1&s=2048x2048&w=0&k=20&c=YpTkakT09teIQFcR99ophgcfRr2XePFUmuMUnQKx9x0=',
      featured: true,
    },
    {
      id: 4,
      title: 'Agricultural Farm Land',
      location: 'Nashik, Maharashtra',
      area: '10 Acres',
      price: '₹3.5 Cr',
      type: 'Farm Land',
      image: 'https://media.gettyimages.com/id/2215927090/photo/traditional-rice-cultivation.jpg?b=1&s=2048x2048&w=0&k=20&c=5tc_PfCEU7QPwfgZRPGcMpBG_3tp5EzPK1e6LDTHwJE=',
      featured: false,
    },
    {
      id: 5,
      title: 'Modern Residential Layout',
      location: 'Hyderabad, Telangana',
      area: '3000 sq.ft',
      price: '₹2.1 Cr',
      type: 'Residential',
      image: 'https://media.gettyimages.com/id/1367954158/photo/residential-district-with-luxury-villas-walking-path-and-palm-trees.jpg?b=1&s=2048x2048&w=0&k=20&c=O4y02evr3at73ZQpfz__cg45XERLKGkyaKq9FE2tEPk=',
      featured: false,
    },
    {
      id: 6,
      title: 'Prime Commercial Plot',
      location: 'Mumbai, Maharashtra',
      area: '6000 sq.ft',
      price: '₹5.8 Cr',
      type: 'Commercial',
      image: 'https://media.gettyimages.com/id/2183852324/photo/new-single-family-homes-in-gta-east-gwillimbury-ontario-canada.jpg?b=1&s=2048x2048&w=0&k=20&c=hAezJKSbCvsXkoNschaD-uJWQNwo3Q16O4wfqHrbX-w=',
      featured: false,
    },
  ];

  const statistics = [
    { icon: Building2, value: '500+', label: 'Properties Listed' },
    { icon: Users, value: '2000+', label: 'Happy Investors' },
    { icon: TrendingUp, value: '₹250 Cr+', label: 'Deals Closed' },
    { icon: CheckCircle, value: '95%', label: 'Success Rate' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Real Estate Investor',
      content: 'Big Partner helped me find the perfect industrial plot in Pune. The channel partner support was exceptional, and the entire process was transparent.',
      rating: 5,
      image: 'https://media.gettyimages.com/id/2206789009/photo/happy-couple-talking-to-their-advisor-in-the-office.jpg?b=1&s=2048x2048&w=0&k=20&c=w0tY7Plm7WbGtIlj8MnlCBC3cYKzIZepfQ1mLaWJdts=',
    },
    {
      name: 'Priya Sharma',
      role: 'Channel Partner',
      content: 'As a channel partner, Big Partner platform has streamlined my property listings and lead management. The commission structure is fair and payments are always on time.',
      rating: 5,
      image: 'https://media.gettyimages.com/id/2210565110/photo/real-estate-entrepreneurs-meeting-to-sell-a-house-discussing-real-estate-deals-with-house.jpg?b=1&s=2048x2048&w=0&k=20&c=wScqYzqr8mN1GAgIifBe8UTMOjFrOIhq8w1a3WpJxjY=',
    },
    {
      name: 'Amit Patel',
      role: 'Property Developer',
      content: 'The reach and quality of investors on Big Partner is unmatched. We sold 80% of our residential layout within 3 months through their platform.',
      rating: 5,
      image: 'https://media.gettyimages.com/id/1443177554/photo/successful-agreement-at-construction-site.jpg?b=1&s=2048x2048&w=0&k=20&c=Kdab8mhxZiGko8hdpW7fYya0eDAPNa9wJE__YoJ-mIU=',
    },
  ];

  return (
    <>
      <SEO
        title="Premier Real Estate Investment & Partnership Platform in India"
        description="Big Partner connects property owners with investors across India. Explore residential, commercial, industrial, and farmland properties. Join 500+ partners and 1000+ investors in transforming real estate investments."
        keywords="real estate India, property investment, real estate partnership, residential properties, commercial properties, industrial properties, farmland investment, Chennai real estate, property partners, real estate investors"
        structuredData={homeSchema}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://media.gettyimages.com/id/2215384246/photo/aerial-view-of-gurgaon-urban-skyline-at-sunset.jpg?b=1&s=2048x2048&w=0&k=20&c=clbHZFqO90UNkYQCoJE_tIEMBHoNDZxgUKDq8SkZtDI="
            alt="Real Estate Development"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect Property Investment
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with verified channel partners and discover premium industrial, residential, commercial, and farm land opportunities across India
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by location, property type, or keyword..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border-t md:border-t-0 md:border-l pt-2 md:pt-0">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="City or Area"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button size="lg" className="md:w-auto" asChild>
              <Link to="/properties">Search Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Property Type Quick Links */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Property Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {propertyTypes.map((type, index) => (
              <Link key={index} to={type.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`${type.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked premium properties for smart investors</p>
            </div>
            <Button variant="outline" className="hidden md:flex items-center gap-2" asChild>
              <Link to="/properties">View All <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer" onClick={() => navigate(`/properties/${property.slug}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {property.featured && (
                    <Badge className="absolute top-3 right-3 bg-primary">Featured</Badge>
                  )}
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
                    {property.type}
                  </Badge>
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
                      <p className="font-semibold">{property.area}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-bold text-primary text-xl">{property.price}</p>
                    </div>
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
                      navigate(`/properties/${property.slug}`);
                    }}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" className="flex items-center gap-2 mx-auto" asChild>
              <Link to="/properties">View All Properties <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Investors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://media.gettyimages.com/id/2206789009/photo/happy-couple-talking-to-their-advisor-in-the-office.jpg?b=1&s=2048x2048&w=0&k=20&c=w0tY7Plm7WbGtIlj8MnlCBC3cYKzIZepfQ1mLaWJdts="
                  alt="Investors"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">For Investors</h2>
                <p className="text-muted-foreground mb-6">
                  Discover verified properties with complete documentation, transparent pricing, and dedicated support. Make informed investment decisions with our comprehensive property insights.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Verified property listings with legal clearance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Direct connect with channel partners</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>End-to-end transaction support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Market insights and investment guidance</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Button size="lg" asChild><Link to="/register-investor">Register as Investor</Link></Button>
                  <Button size="lg" variant="outline" asChild><Link to="/for-investors">Learn More</Link></Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA for Channel Partners */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-4">For Channel Partners</h2>
                <p className="text-muted-foreground mb-6">
                  Join India's fastest-growing property marketplace. List your properties, manage leads efficiently, and earn attractive commissions with complete transparency.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Easy property listing and management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Access to verified investor network</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Real-time lead tracking and CRM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Competitive commission structure</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Button size="lg" asChild><Link to="/register-partner">Become a Partner</Link></Button>
                  <Button size="lg" variant="outline" asChild><Link to="/for-partners">Partner Benefits</Link></Button>
                </div>
              </div>
              <div className="relative h-64 md:h-auto order-1 md:order-2">
                <img
                  src="https://media.gettyimages.com/id/1443177554/photo/successful-agreement-at-construction-site.jpg?b=1&s=2048x2048&w=0&k=20&c=Kdab8mhxZiGko8hdpW7fYya0eDAPNa9wJE__YoJ-mIU="
                  alt="Channel Partners"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Property Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of investors and partners who trust Big Partner for their real estate needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center text-primary-foreground/90">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+91 9600047740</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>info@bigpartner.in</span>
            </div>
          </div>
        </div>
      </section>
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
    </>
  );
}
