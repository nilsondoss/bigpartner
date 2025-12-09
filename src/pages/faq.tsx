import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const faqCategories = {
  general: [
    {
      question: 'What is Big Partner?',
      answer: 'Big Partner is a commercial real estate investment platform that connects investors with high-quality property opportunities. We make it easy for individuals to invest in commercial real estate that was traditionally only accessible to institutional investors.',
    },
    {
      question: 'Who can invest with Big Partner?',
      answer: 'Our platform is open to accredited investors who meet SEC requirements. This typically includes individuals with a net worth exceeding $1 million (excluding primary residence) or annual income over $200,000 ($300,000 for joint income).',
    },
    {
      question: 'How does Big Partner make money?',
      answer: 'We earn revenue through transparent fees including acquisition fees, asset management fees, and a share of profits above certain return thresholds. All fees are clearly disclosed in the offering documents for each property.',
    },
  ],
  investing: [
    {
      question: 'What is the minimum investment?',
      answer: 'The minimum investment varies by property but typically starts at $10,000. Some properties may have higher minimums depending on the deal structure and total offering size.',
    },
    {
      question: 'How long is my capital committed?',
      answer: 'Investment holding periods vary by property but typically range from 3-7 years. The expected hold period is disclosed in each property offering. We may offer early exit opportunities through our secondary market.',
    },
    {
      question: 'What returns can I expect?',
      answer: 'Target returns vary by property and investment strategy. Historical commercial real estate returns have ranged from 8-15% annually, but past performance does not guarantee future results. Each property listing includes projected return scenarios.',
    },
    {
      question: 'How are returns distributed?',
      answer: 'Most properties distribute cash flow quarterly. Distributions are made via direct deposit to your linked bank account. You can also choose to reinvest distributions into other properties on the platform.',
    },
  ],
  account: [
    {
      question: 'How do I create an account?',
      answer: 'Click the "Register" button and complete the registration form. You\'ll need to provide personal information, verify your identity, and confirm your accredited investor status.',
    },
    {
      question: 'Is my information secure?',
      answer: 'Yes. We use bank-level encryption and security measures to protect your personal and financial information. We never share your data with third parties without your consent.',
    },
    {
      question: 'How do I update my account information?',
      answer: 'Log in to your dashboard and navigate to Account Settings. You can update your contact information, banking details, and communication preferences at any time.',
    },
    {
      question: 'Can I have multiple accounts?',
      answer: 'Each individual can have one personal account. However, you can invest through different entities (personal, IRA, LLC, trust) by setting up separate entity accounts.',
    },
  ],
  properties: [
    {
      question: 'How are properties selected?',
      answer: 'Our investment team conducts rigorous due diligence on every property, evaluating location, market fundamentals, property condition, tenant quality, and financial projections. Only properties meeting our strict criteria are offered on the platform.',
    },
    {
      question: 'Can I visit properties before investing?',
      answer: 'While we provide comprehensive virtual tours and documentation, in-person property visits are generally not available for individual investors. However, we conduct thorough inspections and provide detailed reports.',
    },
    {
      question: 'What happens if a property underperforms?',
      answer: 'Real estate investments carry risks. If a property underperforms, we work with property management to implement improvement strategies. We provide regular updates and maintain transparent communication with all investors.',
    },
    {
      question: 'How often do you add new properties?',
      answer: 'We typically add 2-4 new investment opportunities per month. The frequency varies based on market conditions and the availability of properties that meet our investment criteria.',
    },
  ],
  legal: [
    {
      question: 'What legal structure is used for investments?',
      answer: 'Investments are typically structured as limited liability companies (LLCs) or limited partnerships (LPs). Investors receive membership interests or limited partnership units representing their ownership stake.',
    },
    {
      question: 'What tax documents will I receive?',
      answer: 'You will receive a Schedule K-1 annually for each property investment. K-1s are typically distributed by March 15th. We recommend consulting with a tax professional regarding your specific situation.',
    },
    {
      question: 'Are investments FDIC insured?',
      answer: 'No. Real estate investments are not FDIC insured and carry risk of loss. Unlike bank deposits, your principal is not guaranteed and property values can fluctuate.',
    },
    {
      question: 'Can I invest through my IRA or 401(k)?',
      answer: 'Yes, you can invest through a self-directed IRA or solo 401(k). You\'ll need to work with a custodian that allows alternative investments. We can provide guidance on the process.',
    },
  ],
};

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about investing with Big Partner
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="investing">Investing</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="legal">Legal & Tax</TabsTrigger>
              </TabsList>

              {Object.entries(faqCategories).map(([category, questions]) => (
                <TabsContent key={category} value={category}>
                  <Accordion type="single" collapsible className="space-y-4">
                    {questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category}-${index}`}
                        className="bg-background rounded-lg px-6 border"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-semibold">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Our team is here to help. Reach out and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6">
                Contact Support
              </a>
              <a href="/help-center" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6">
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
