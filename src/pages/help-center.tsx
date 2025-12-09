import { Search, Book, MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';
import ChatSupport from '@/components/ChatSupport';

const helpCategories = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of investing with Big Partner',
    articles: 12,
  },
  {
    icon: MessageCircle,
    title: 'Account Management',
    description: 'Manage your profile, settings, and preferences',
    articles: 8,
  },
  {
    icon: HelpCircle,
    title: 'Investment Process',
    description: 'Understanding how to invest in properties',
    articles: 15,
  },
  {
    icon: Mail,
    title: 'Payments & Transactions',
    description: 'Information about payments and distributions',
    articles: 10,
  },
];

const faqs = [
  {
    question: 'How do I get started with Big Partner?',
    answer: 'Getting started is easy! Simply create an account, complete your investor profile, browse available properties, and make your first investment. Our platform guides you through each step of the process.',
  },
  {
    question: 'What is the minimum investment amount?',
    answer: 'The minimum investment varies by property but typically starts at $10,000. Each property listing clearly displays the minimum investment requirement.',
  },
  {
    question: 'How do I receive returns on my investment?',
    answer: 'Returns are distributed quarterly directly to your account. You can choose to receive distributions via direct deposit or reinvest them into other properties on the platform.',
  },
  {
    question: 'What types of properties can I invest in?',
    answer: 'We offer a diverse range of commercial properties including office buildings, retail spaces, industrial facilities, and mixed-use developments across various markets.',
  },
  {
    question: 'How is my investment secured?',
    answer: 'All investments are backed by real property assets. We conduct thorough due diligence on each property and provide detailed documentation. Your investment is structured as equity ownership in the property.',
  },
  {
    question: 'Can I sell my investment before the property is sold?',
    answer: 'Yes, we offer a secondary market where you can list your shares for sale to other qualified investors. Liquidity options vary by property and market conditions.',
  },
  {
    question: 'What fees does Big Partner charge?',
    answer: 'We charge a transparent fee structure including a one-time acquisition fee and an annual asset management fee. All fees are clearly disclosed in the property offering documents.',
  },
  {
    question: 'How do I track my investment performance?',
    answer: 'Your dashboard provides real-time updates on your portfolio performance, including property valuations, distribution history, and detailed financial reports.',
  },
];

export default function HelpCenterPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStartChat = () => {
    setIsChatOpen(true);
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:info@bigpartner.in?subject=Support Request';
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+919600047740';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How Can We Help?</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Search our knowledge base or browse categories below
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles..."
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{category.articles} articles</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6 border">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Still Need Help?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>Get help via email</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Response within 24 hours
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleEmailSupport}>
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Chat with our team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Available Mon-Fri, 9am-6pm EST
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleStartChat}>
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>Speak with an expert</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    +91 9600047740
                  </p>
                  <Button variant="outline" className="w-full" onClick={handlePhoneCall}>
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Support Widget */}
      <ChatSupport isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
