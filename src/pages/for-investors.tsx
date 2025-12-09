// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Building2,
  // Wallet,
  FileText,
  Clock,
} from 'lucide-react';

export default function ForInvestorsPage() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'High Returns',
      description: 'Competitive returns on investment with transparent profit-sharing models',
    },
    {
      icon: Shield,
      title: 'Secure Investments',
      description: 'All properties are legally verified and backed by proper documentation',
    },
    {
      icon: BarChart3,
      title: 'Portfolio Diversification',
      description: 'Invest across multiple properties to spread risk and maximize returns',
    },
    {
      icon: Users,
      title: 'Expert Management',
      description: 'Professional property management and maintenance handled by our team',
    },
    {
      icon: FileText,
      title: 'Transparent Reporting',
      description: 'Regular updates and detailed reports on your investment performance',
    },
    {
      icon: Clock,
      title: 'Flexible Terms',
      description: 'Choose investment durations that align with your financial goals',
    },
  ];

  const investmentProcess = [
    {
      step: '01',
      title: 'Register as Investor',
      description: 'Create your investor account and complete the verification process',
    },
    {
      step: '02',
      title: 'Browse Opportunities',
      description: 'Explore available properties and review detailed investment proposals',
    },
    {
      step: '03',
      title: 'Due Diligence',
      description: 'Review property documents, financial projections, and legal verification',
    },
    {
      step: '04',
      title: 'Invest & Track',
      description: 'Make your investment and monitor performance through your dashboard',
    },
  ];

  const investmentTypes = [
    {
      title: 'Residential Properties',
      description: 'Invest in apartments, villas, and residential complexes',
      minInvestment: '₹50 Lakhs',
      expectedReturns: '12-15% p.a.',
      features: ['Steady rental income', 'Capital appreciation', 'Low maintenance'],
    },
    {
      title: 'Commercial Properties',
      description: 'Office spaces, retail outlets, and commercial complexes',
      minInvestment: '₹1 Crore',
      expectedReturns: '15-18% p.a.',
      features: ['Higher returns', 'Long-term leases', 'Corporate tenants'],
    },
    {
      title: 'Mixed-Use Developments',
      description: 'Combined residential and commercial projects',
      minInvestment: '₹75 Lakhs',
      expectedReturns: '13-16% p.a.',
      features: ['Diversified income', 'Balanced risk', 'Multiple revenue streams'],
    },
  ];

  const stats = [
    { label: 'Total Investments', value: '₹500+ Cr' },
    { label: 'Active Investors', value: '1,200+' },
    { label: 'Properties Funded', value: '150+' },
    { label: 'Avg. Returns', value: '14.5%' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              For Investors
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Invest in Premium Real Estate
              <span className="block text-primary mt-2">With Confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of smart investors and build wealth through carefully curated real
              estate opportunities with transparent returns and professional management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register-investor')}>
                Start Investing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/properties')}>
                View Opportunities
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Invest With Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide a secure, transparent, and profitable platform for real estate investments
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

      {/* Investment Types */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Opportunities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from diverse property types that match your investment goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {investmentTypes.map((type, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-t border-b">
                    <span className="text-sm text-muted-foreground">Min. Investment</span>
                    <span className="font-semibold">{type.minInvestment}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-muted-foreground">Expected Returns</span>
                    <span className="font-semibold text-primary">{type.expectedReturns}</span>
                  </div>
                  <div className="space-y-2 pt-2">
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your investment journey in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {investmentProcess.map((process, index) => (
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
                {index < investmentProcess.length - 1 && (
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
            <Building2 className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join hundreds of investors who are building wealth through smart real estate
              investments. Register today and explore exclusive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register-investor')}
                className="bg-background text-foreground hover:bg-background/90"
              >
                Register as Investor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Talk to Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
