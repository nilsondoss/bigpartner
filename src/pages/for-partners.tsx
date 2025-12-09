import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Handshake,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Building2,
  Target,
  Briefcase,
  HeadphonesIcon,
  Zap,
  // Globe,
} from 'lucide-react';

export default function ForPartnersPage() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Attractive Commissions',
      description: 'Earn competitive commissions on every successful property transaction',
    },
    {
      icon: Target,
      title: 'Quality Leads',
      description: 'Access to verified investors and buyers actively looking for properties',
    },
    {
      icon: Briefcase,
      title: 'Marketing Support',
      description: 'Professional marketing materials and digital tools to promote properties',
    },
    {
      icon: HeadphonesIcon,
      title: 'Dedicated Support',
      description: '24/7 partner support team to help you close deals faster',
    },
    {
      icon: Award,
      title: 'Training & Resources',
      description: 'Regular training sessions and access to industry insights and resources',
    },
    {
      icon: Zap,
      title: 'Fast Payouts',
      description: 'Quick and transparent commission payouts with detailed reporting',
    },
  ];

  const partnerTypes = [
    {
      title: 'Real Estate Agents',
      description: 'Individual agents looking to expand their property portfolio',
      icon: Users,
      features: [
        'Access to exclusive listings',
        'Lead generation support',
        'Commission on every deal',
        'Marketing collateral',
      ],
    },
    {
      title: 'Brokerage Firms',
      description: 'Established firms seeking partnership opportunities',
      icon: Building2,
      features: [
        'Bulk listing opportunities',
        'Co-branding options',
        'Volume-based incentives',
        'Dedicated account manager',
      ],
    },
    {
      title: 'Property Consultants',
      description: 'Independent consultants and advisors',
      icon: Briefcase,
      features: [
        'Flexible partnership terms',
        'Client referral program',
        'Performance bonuses',
        'Professional certification',
      ],
    },
  ];

  const partnershipProcess = [
    {
      step: '01',
      title: 'Register as Partner',
      description: 'Complete the partner registration form with your business details',
    },
    {
      step: '02',
      title: 'Verification',
      description: 'Our team verifies your credentials and approves your partnership',
    },
    {
      step: '03',
      title: 'Onboarding',
      description: 'Get access to partner portal, training materials, and marketing tools',
    },
    {
      step: '04',
      title: 'Start Earning',
      description: 'List properties, connect with investors, and earn commissions',
    },
  ];

  const stats = [
    { label: 'Active Partners', value: '500+' },
    { label: 'Properties Listed', value: '2,000+' },
    { label: 'Avg. Commission', value: '2.5%' },
    { label: 'Partner Satisfaction', value: '95%' },
  ];

  const commissionStructure = [
    {
      range: '₹50L - ₹1Cr',
      commission: '2.0%',
      description: 'Standard commission for mid-range properties',
    },
    {
      range: '₹1Cr - ₹5Cr',
      commission: '2.5%',
      description: 'Enhanced commission for premium properties',
    },
    {
      range: '₹5Cr+',
      commission: '3.0%',
      description: 'Premium commission for luxury properties',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/10 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              For Channel Partners
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Partner With Us & Grow
              <span className="block text-primary mt-2">Your Real Estate Business</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our network of successful channel partners and unlock new revenue streams with
              attractive commissions, quality leads, and comprehensive support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register-partner')}>
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed as a real estate channel partner
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Can Partner?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We welcome partnerships with various real estate professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {partnerTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Commission Structure</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent and competitive commission rates based on property value
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {commissionStructure.map((tier, index) => (
              <Card key={index} className="border-2 text-center">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{tier.commission}</CardTitle>
                  <CardDescription className="text-lg font-semibold">{tier.range}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              * Additional performance bonuses and incentives available for high-performing partners
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Get Started</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our partner network in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {partnershipProcess.map((process, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-2">
                  <CardHeader>
                    <div className="text-5xl font-bold text-primary/20 mb-2">{process.step}</div>
                    <CardTitle className="text-lg">{process.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{process.description}</p>
                  </CardContent>
                </Card>
                {index < partnershipProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <Handshake className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join our network of successful channel partners and start earning attractive
              commissions today. Register now and get access to exclusive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register-partner')}
                className="bg-background text-foreground hover:bg-background/90"
              >
                Register as Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Partnership Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
