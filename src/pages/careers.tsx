import { useState } from 'react';
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Briefcase, MapPin, Clock, ArrowRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Property Analyst',
    department: 'Investment',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Analyze commercial real estate opportunities and provide investment recommendations.',
  },
  {
    id: 2,
    title: 'Partnership Manager',
    department: 'Business Development',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and maintain relationships with property owners and institutional partners.',
  },
  {
    id: 3,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    description: 'Drive marketing campaigns and investor engagement strategies.',
  },
  {
    id: 4,
    title: 'Financial Analyst',
    department: 'Finance',
    location: 'Chicago, IL',
    type: 'Full-time',
    description: 'Support financial modeling, reporting, and investment analysis.',
  },
];

const benefits = [
  'Competitive salary and equity packages',
  'Comprehensive health, dental, and vision insurance',
  'Flexible work arrangements',
  '401(k) matching',
  'Professional development opportunities',
  'Collaborative team culture',
];

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');

  const handleApply = (jobTitle: string) => {
    setSelectedPosition(jobTitle);
    setDialogOpen(true);
  };

  // Temporarily disable reCAPTCHA due to React 19 compatibility issue
  // const { executeRecaptcha } = useGoogleReCaptcha();
  const executeRecaptcha = null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Execute reCAPTCHA verification
    let recaptchaToken = '';
    if (executeRecaptcha) {
      recaptchaToken = await executeRecaptcha('career_application');
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: selectedPosition || 'General Application',
      message: formData.get('message') as string,
      resumeUrl: formData.get('resumeUrl') as string || 'No resume attached',
    };

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Application submitted successfully! We\'ll be in touch soon.');
        setDialogOpen(false);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Application error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help us revolutionize commercial real estate investment. We're looking for talented individuals
              who are passionate about innovation and growth.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Big Partner?</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Innovation First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Work with cutting-edge technology and shape the future of real estate investment.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Growth Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Continuous learning, mentorship, and career advancement in a fast-growing company.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Impact & Purpose</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Make a real difference by democratizing access to commercial real estate investments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
            <div className="space-y-6">
              {jobOpenings.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    <Button className="w-full md:w-auto" onClick={() => handleApply(job.title)}>
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Benefits & Perks</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-lg mb-8 opacity-90">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" variant="secondary" onClick={() => handleApply('General Application')}>
            Send Your Resume
          </Button>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Position</DialogTitle>
            <DialogDescription>
              {selectedPosition === 'General Application'
                ? 'Submit your resume for future opportunities'
                : `Apply for ${selectedPosition}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="+91 9600047740" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL (Optional)</Label>
              <Input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Share a link to your resume (Google Drive, Dropbox, LinkedIn, etc.)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Cover Letter / Message (Optional)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us why you'd be a great fit..."
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                {!isSubmitting && <Upload className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
