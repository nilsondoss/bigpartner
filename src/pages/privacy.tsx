export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: November 28, 2025</p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Big Partner ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
                <p className="text-muted-foreground mb-4">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Register for an account</li>
                  <li>Make an investment</li>
                  <li>Contact customer support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  This information may include: name, email address, phone number, mailing address, date of birth, Social Security number, financial information, employment information, and investment preferences.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
                <p className="text-muted-foreground mb-4">
                  When you access our platform, we automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Create and manage your account</li>
                  <li>Process your investments and transactions</li>
                  <li>Verify your identity and accredited investor status</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send you important updates about your investments</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Improve our platform and services</li>
                  <li>Detect and prevent fraud and security threats</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (payment processing, identity verification, email delivery)</li>
                  <li><strong>Property Partners:</strong> Property owners and managers for properties you invest in</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure socket layer (SSL) technology</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Your Privacy Rights</h2>
                <p className="text-muted-foreground mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
                  <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  To exercise these rights, please contact us at info@bigpartner.in.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our platform</li>
                  <li>Improve platform performance and user experience</li>
                  <li>Deliver relevant advertising</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  You can control cookies through your browser settings. However, disabling cookies may affect platform functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Third-Party Links</h2>
                <p className="text-muted-foreground">
                  Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Investment-related information may be retained for up to 7 years after account closure for regulatory compliance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 text-muted-foreground">
                  <p>Big Partner</p>
                  <p>Email: info@bigpartner.in</p>
                  <p>Phone: +91 9600047740</p>
                  <p>Address: #61, 5th Cross Street, Logaiah Colony, Saligramam, Chennai - 600 093, Tamil Nadu, India</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
