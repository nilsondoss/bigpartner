import nodemailer from 'nodemailer';

// Create transporter using local SMTP
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 25,
  secure: false,
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using nodemailer
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: 'noreply@airoapp.ai',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Generate email template for investor verification
 */
export function getInvestorVerificationEmail(
  name: string,
  status: 'verified' | 'rejected'
): { subject: string; html: string } {
  const isApproved = status === 'verified';
  
  const subject = isApproved
    ? 'Your Big Partner Investor Registration is Approved!'
    : 'Update on Your Big Partner Investor Registration';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin: 20px 0;
          }
          .approved {
            background: #dcfce7;
            color: #166534;
          }
          .rejected {
            background: #fee2e2;
            color: #991b1b;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #1E40AF;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Big Partner</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Property Investment Platform</p>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          
          ${
            isApproved
              ? `
            <p>Great news! Your investor registration has been approved.</p>
            <div class="status-badge approved">✓ Verified</div>
            <p>You can now:</p>
            <ul>
              <li>Browse exclusive property listings</li>
              <li>Connect with verified property partners</li>
              <li>Access detailed property information</li>
              <li>Schedule property visits</li>
              <li>Receive personalized investment recommendations</li>
            </ul>
            <p>Start exploring investment opportunities today!</p>
            <a href="https://lmnesop1a2.preview.c24.airoapp.ai/properties" class="button">Browse Properties</a>
          `
              : `
            <p>Thank you for your interest in Big Partner.</p>
            <div class="status-badge rejected">Registration Not Approved</div>
            <p>Unfortunately, we were unable to approve your investor registration at this time. This may be due to:</p>
            <ul>
              <li>Incomplete or incorrect information</li>
              <li>Issues with KYC document verification</li>
              <li>Other verification requirements</li>
            </ul>
            <p>If you believe this is an error or would like to resubmit your application with updated information, please contact our support team.</p>
            <a href="https://lmnesop1a2.preview.c24.airoapp.ai/register-investor" class="button">Resubmit Application</a>
          `
          }
          
          <p style="margin-top: 30px;">If you have any questions, please don't hesitate to reach out to our support team.</p>
          
          <p>Best regards,<br><strong>The Big Partner Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 Big Partner. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
): Promise<boolean> {
  const subject = 'Reset Your Big Partner Password';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #1E40AF;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>We received a request to reset your password for your Big Partner account.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button" style="color: white;">Reset Password</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
          </div>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <p>For security reasons, please do not share this link with anyone.</p>
          
          <div class="footer">
            <p><strong>Big Partner</strong></p>
            <p>Chennai, Tamil Nadu, India</p>
            <p>📞 +91 9600047740 | 📧 info@bigpartner.in</p>
            <p style="margin-top: 15px; font-size: 12px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send career application email to admin
 */
export async function sendCareerApplicationEmail(data: {
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  resumeUrl: string;
}): Promise<void> {
  const { name, email, phone, position, message, resumeUrl } = data;

  const subject = `New Career Application: ${position}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
          .label { font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Career Application</h1>
          </div>
          <div class="content">
            <p>A new career application has been submitted through the Big Partner website.</p>
            
            <div class="info-row">
              <span class="label">Position:</span> ${position}
            </div>
            
            <div class="info-row">
              <span class="label">Name:</span> ${name}
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            
            <div class="info-row">
              <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
            </div>
            
            <div class="info-row">
              <span class="label">Resume:</span> ${resumeUrl !== 'No resume attached' ? `<a href="${resumeUrl}" target="_blank">View Resume</a>` : 'No resume attached'}
            </div>
            
            <div class="info-row">
              <span class="label">Message:</span><br>
              <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="margin-top: 30px;">Please review the application and contact the candidate if interested.</p>
          </div>
          <div class="footer">
            <p>© 2025 Big Partner. All rights reserved.</p>
            <p>This is an automated notification from your careers page.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: 'info@bigpartner.in',
    subject,
    html,
  });

  // Send confirmation email to applicant
  const confirmationSubject = 'Application Received - Big Partner Careers';
  const confirmationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Application Received</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            
            <p>Thank you for your interest in the <strong>${position}</strong> position at Big Partner!</p>
            
            <p>We have successfully received your application and our hiring team will review it carefully. If your qualifications match our requirements, we will contact you within 5-7 business days to discuss next steps.</p>
            
            <p><strong>Application Summary:</strong></p>
            <ul>
              <li>Position: ${position}</li>
              <li>Email: ${email}</li>
              <li>Phone: ${phone}</li>
            </ul>
            
            <p>In the meantime, feel free to explore more about Big Partner and our mission to revolutionize commercial real estate investment.</p>
            
            <p>If you have any questions, please contact us at <a href="mailto:info@bigpartner.in">info@bigpartner.in</a> or call <a href="tel:+919600047740">+91 9600047740</a>.</p>
            
            <p>Best regards,<br><strong>The Big Partner Hiring Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Big Partner. All rights reserved.</p>
            <p>#61, 5th Cross Street, Logaiah Colony, Saligramam, Chennai - 600 093</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: confirmationSubject,
    html: confirmationHtml,
  });
}

/**
 * Send inquiry confirmation email to user
 */
export async function sendInquiryConfirmationEmail({
  to,
  name,
  inquiryType,
  subject,
}: {
  to: string;
  name: string;
  inquiryType: string;
  subject: string;
}) {
  const inquiryTypeLabels: Record<string, string> = {
    general: 'General Inquiry',
    property: 'Property Information',
    investment: 'Investment Opportunity',
    partnership: 'Partnership',
    support: 'Technical Support',
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #1E40AF 0%, #441eaf 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Big Partner</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Property Investment Platform</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #0a0a0a; font-size: 24px;">Thank You for Contacting Us!</h2>
                    <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">Dear ${name},</p>
                    <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                      We have received your inquiry and our team will review it shortly.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #f8f9fa; border-radius: 6px; padding: 20px;">
                      <tr>
                        <td style="padding: 8px 0;"><strong style="color: #0a0a0a;">Type:</strong> <span style="color: #666666;">${inquiryTypeLabels[inquiryType] || inquiryType}</span></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;"><strong style="color: #0a0a0a;">Subject:</strong> <span style="color: #666666;">${subject}</span></td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0 15px 0; color: #666666; font-size: 16px;"><strong>What happens next?</strong></p>
                    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #666666; font-size: 16px; line-height: 1.8;">
                      <li>Our team will review your inquiry within 24-48 hours</li>
                      <li>We'll reach out to you via email or phone</li>
                      <li>If urgent, call us at +91 9600047740</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">© ${new Date().getFullYear()} Big Partner. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({ to, subject: 'We Received Your Inquiry - Big Partner', html });
}

/**
 * Send inquiry notification to admin
 */
export async function sendInquiryNotificationToAdmin({
  inquiryId,
  fullName,
  email,
  phone,
  inquiryType,
  userType,
  subject,
  message,
  propertyName,
}: {
  inquiryId: number;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  userType: string;
  subject: string;
  message: string;
  propertyName?: string | null;
}) {
  const inquiryTypeLabels: Record<string, string> = {
    general: 'General Inquiry',
    property: 'Property Information',
    investment: 'Investment Opportunity',
    partnership: 'Partnership',
    support: 'Technical Support',
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #1E40AF 0%, #441eaf 100%); padding: 30px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🔔 New Inquiry #${inquiryId}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <table width="100%" style="margin: 0 0 20px 0; background-color: #f8f9fa; border-radius: 6px; padding: 20px;">
                      <tr><td><strong>Name:</strong> ${fullName}</td></tr>
                      <tr><td><strong>Email:</strong> <a href="mailto:${email}">${email}</a></td></tr>
                      <tr><td><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></td></tr>
                      <tr><td><strong>Type:</strong> ${inquiryTypeLabels[inquiryType] || inquiryType}</td></tr>
                      <tr><td><strong>User:</strong> ${userType}</td></tr>
                      ${propertyName ? `<tr><td><strong>Property:</strong> ${propertyName}</td></tr>` : ''}
                    </table>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p style="white-space: pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({ to: 'info@bigpartner.in', subject: `New Inquiry - ${subject}`, html });
}

/**
 * Send investor registration notification to admin
 */
export async function sendInvestorRegistrationNotification({
  investorId,
  fullName,
  email,
  phone,
  investmentBudgetMin,
  investmentBudgetMax,
  propertyTypes,
  preferredLocations,
}: {
  investorId: number;
  fullName: string;
  email: string;
  phone: string;
  investmentBudgetMin?: number | null;
  investmentBudgetMax?: number | null;
  propertyTypes?: string | null;
  preferredLocations?: string | null;
}) {
  const subject = `New Investor Registration - ${fullName}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
          .label { font-weight: bold; color: #1E40AF; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💼 New Investor Registration</h1>
            <p>ID: #${investorId}</p>
          </div>
          <div class="content">
            <p>A new investor has registered on the Big Partner platform.</p>
            
            <div class="info-row">
              <span class="label">Name:</span> ${fullName}
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            
            <div class="info-row">
              <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
            </div>
            
            ${investmentBudgetMin || investmentBudgetMax ? `
            <div class="info-row">
              <span class="label">Investment Budget:</span> ₹${investmentBudgetMin?.toLocaleString() || '0'} - ₹${investmentBudgetMax?.toLocaleString() || 'No limit'}
            </div>
            ` : ''}
            
            ${propertyTypes ? `
            <div class="info-row">
              <span class="label">Property Types:</span> ${propertyTypes}
            </div>
            ` : ''}
            
            ${preferredLocations ? `
            <div class="info-row">
              <span class="label">Preferred Locations:</span> ${preferredLocations}
            </div>
            ` : ''}
            
            <p style="margin-top: 30px;">Please review the investor profile in the admin dashboard and verify their account.</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://lmnesop1a2.preview.c24.airoapp.ai/admin/investors" style="display: inline-block; padding: 12px 24px; background: #1E40AF; color: white; text-decoration: none; border-radius: 6px;">View in Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Big Partner. All rights reserved.</p>
            <p>This is an automated notification from your investor registration system.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: 'info@bigpartner.in', subject, html });
}

/**
 * Send partner registration notification to admin
 */
export async function sendPartnerRegistrationNotification({
  partnerId,
  companyName,
  contactPerson,
  email,
  phone,
  companyType,
  gstNumber,
  reraNumber,
}: {
  partnerId: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  companyType?: string | null;
  gstNumber?: string | null;
  reraNumber?: string | null;
}) {
  const subject = `New Partner Registration - ${companyName}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
          .label { font-weight: bold; color: #1E40AF; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏢 New Partner Registration</h1>
            <p>ID: #${partnerId}</p>
          </div>
          <div class="content">
            <p>A new partner has registered on the Big Partner platform.</p>
            
            <div class="info-row">
              <span class="label">Company Name:</span> ${companyName}
            </div>
            
            <div class="info-row">
              <span class="label">Contact Person:</span> ${contactPerson}
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            
            <div class="info-row">
              <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
            </div>
            
            ${companyType ? `
            <div class="info-row">
              <span class="label">Company Type:</span> ${companyType}
            </div>
            ` : ''}
            
            ${gstNumber ? `
            <div class="info-row">
              <span class="label">GST Number:</span> ${gstNumber}
            </div>
            ` : ''}
            
            ${reraNumber ? `
            <div class="info-row">
              <span class="label">RERA Number:</span> ${reraNumber}
            </div>
            ` : ''}
            
            <p style="margin-top: 30px;">Please review the partner profile in the admin dashboard and verify their account.</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://lmnesop1a2.preview.c24.airoapp.ai/admin/partners" style="display: inline-block; padding: 12px 24px; background: #1E40AF; color: white; text-decoration: none; border-radius: 6px;">View in Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Big Partner. All rights reserved.</p>
            <p>This is an automated notification from your partner registration system.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: 'info@bigpartner.in', subject, html });
}

/**
 * Generate email template for partner verification
 */
export function getPartnerVerificationEmail(
  companyName: string,
  contactPerson: string,
  status: 'verified' | 'rejected'
): { subject: string; html: string } {
  const isApproved = status === 'verified';
  
  const subject = isApproved
    ? 'Your Big Partner Registration is Approved!'
    : 'Update on Your Big Partner Registration';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin: 20px 0;
          }
          .approved {
            background: #dcfce7;
            color: #166534;
          }
          .rejected {
            background: #fee2e2;
            color: #991b1b;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #1E40AF;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Big Partner</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Property Partnership Platform</p>
        </div>
        <div class="content">
          <h2>Hello ${contactPerson},</h2>
          
          ${
            isApproved
              ? `
            <p>Congratulations! <strong>${companyName}</strong> has been verified as a partner on Big Partner.</p>
            <div class="status-badge approved">✓ Verified Partner</div>
            <p>As a verified partner, you can now:</p>
            <ul>
              <li>List your properties on our platform</li>
              <li>Connect with verified investors</li>
              <li>Manage your property portfolio</li>
              <li>Access analytics and insights</li>
              <li>Receive qualified leads</li>
            </ul>
            <p>Start listing your properties and connecting with investors today!</p>
            <a href="https://lmnesop1a2.preview.c24.airoapp.ai" class="button">Access Partner Dashboard</a>
          `
              : `
            <p>Thank you for your interest in partnering with Big Partner.</p>
            <div class="status-badge rejected">Registration Not Approved</div>
            <p>Unfortunately, we were unable to approve the registration for <strong>${companyName}</strong> at this time. This may be due to:</p>
            <ul>
              <li>Incomplete or incorrect company information</li>
              <li>Issues with document verification (GST, RERA, etc.)</li>
              <li>Missing required certifications</li>
              <li>Other verification requirements</li>
            </ul>
            <p>If you believe this is an error or would like to resubmit your application with updated information, please contact our partnership team.</p>
            <a href="https://lmnesop1a2.preview.c24.airoapp.ai/register-partner" class="button">Resubmit Application</a>
          `
          }
          
          <p style="margin-top: 30px;">If you have any questions about your registration status, please contact our partnership team.</p>
          
          <p>Best regards,<br><strong>The Big Partner Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 Big Partner. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}
