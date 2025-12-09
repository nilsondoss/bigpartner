import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO, organizationSchema } from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Shield,
  Handshake,
  ArrowRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();
  
  const aboutSchema = {
    ...organizationSchema,
    '@type': ['RealEstateAgent', 'Organization'],
    foundingDate: '2020',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 50,
    },
  };

  const values = [
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We maintain the highest standards of honesty and transparency in all our dealings',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Our clients success and satisfaction are at the heart of everything we do',
    },
    {
      icon: TrendingUp,
      title: 'Excellence',
      description: 'We strive for excellence in every property and service we deliver',
    },
    {
      icon: Handshake,
      title: 'Partnership',
      description: 'We build long-term relationships based on trust and mutual growth',
    },
  ];

  const milestones = [
    {
      year: '2015',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize real estate investments',
    },
    {
      year: '2017',
      title: '100+ Properties',
      description: 'Reached milestone of 100 successful property transactions',
    },
    {
      year: '2019',
      title: 'Pan-India Expansion',
      description: 'Expanded operations to major cities across India',
    },
    {
      year: '2021',
      title: '₹500Cr+ Portfolio',
      description: 'Managed investment portfolio crossed ₹500 crores',
    },
    {
      year: '2023',
      title: 'Digital Platform Launch',
      description: 'Launched comprehensive digital platform for seamless transactions',
    },
    {
      year: '2025',
      title: 'Industry Leader',
      description: 'Recognized as one of the top real estate investment platforms',
    },
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      description: '20+ years in real estate and investment banking',
    },
    {
      name: 'Priya Sharma',
      role: 'Chief Investment Officer',
      description: 'Expert in property valuation and portfolio management',
    },
    {
      name: 'Amit Patel',
      role: 'Head of Operations',
      description: 'Specializes in property management and client relations',
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Legal',
      description: 'Ensures compliance and legal due diligence',
    },
  ];

  const stats = [
    { icon: Building2, value: '2,000+', label: 'Properties Listed' },
    { icon: Users, value: '1,500+', label: 'Happy Clients' },
    { icon: TrendingUp, value: '₹750Cr+', label: 'Assets Under Management' },
    { icon: Award, value: '15+', label: 'Industry Awards' },
  ];

  return (
    <>
      <SEO
        title="About Us - Leading Real Estate Investment Platform in India"
        description="Learn about Big Partner's mission to revolutionize real estate investment in India. Connecting 500+ partners with 1000+ investors since 2020. Based in Chennai, serving all of India."
        keywords="about big partner, real estate company India, property investment platform, Chennai real estate, real estate partnership, property investment company"
        structuredData={aboutSchema}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Building Trust Through
              <span className="block text-primary mt-2">Transparent Real Estate Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We are a leading real estate investment platform connecting investors with premium
              properties and channel partners with lucrative opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2015, Big Partner was born from a simple yet powerful vision: to make
                  real estate investment accessible, transparent, and profitable for everyone.
                </p>
                <p>
                  What started as a small team of passionate real estate professionals has grown
                  into one of India's most trusted property investment platforms. We've helped
                  thousands of investors build wealth through carefully curated real estate
                  opportunities.
                </p>
                <p>
                  Today, we manage a diverse portfolio of premium properties across major Indian
                  cities, connecting investors with opportunities and channel partners with growth.
                  Our commitment to transparency, integrity, and excellence has made us a preferred
                  choice for real estate investments.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://media.gettyimages.com/id/2186187265/photo/aerial-shot-of-modern-office-towers-in-rosslyn-va-at-sunset.jpg?b=1&s=2048x2048&w=0&k=20&c=BhQFUPu8h1Dx6U7u3fdfuMhimaq8d9_WJrU2nlTehlc="
                alt="Modern office building"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To democratize real estate investment by providing a transparent, secure, and
                  efficient platform that connects investors with premium properties and empowers
                  channel partners to grow their business.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To become India's most trusted real estate investment platform, known for
                  integrity, innovation, and exceptional returns, while creating lasting value for
                  all our stakeholders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-2 text-center">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our growth story
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">{milestone.year}</span>
                    </div>
                  </div>
                  <Card className="flex-1 border-2">
                    <CardHeader>
                      <CardTitle className="text-xl">{milestone.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the experts driving our success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-2 text-center">
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 mx-auto">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm font-semibold text-primary">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Big Partner?</h2>
              <p className="text-lg text-muted-foreground">
                What sets us apart in the real estate industry
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Verified and legally compliant properties',
                'Transparent pricing and documentation',
                'Professional property management',
                'Dedicated customer support',
                'Competitive returns on investment',
                'Extensive network of channel partners',
                'Regular performance reporting',
                'Secure and hassle-free transactions',
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of satisfied investors and partners who trust Big Partner for their
              real estate needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register-investor')}
                className="bg-background text-foreground hover:bg-background/90"
              >
                Start Investing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/register-partner')}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
