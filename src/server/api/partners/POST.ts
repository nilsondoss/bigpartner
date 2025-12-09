import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { partners } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendPartnerRegistrationNotification } from '../../lib/email.js';

/**
 * POST /api/partners
 * Register a new partner (property developer, builder, or broker)
 */
export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      companyName,
      companyType,
      registrationNumber,
      gstNumber,
      reraNumber,
      contactPersonName,
      email,
      phone,
      alternatePhone,
      officeAddress,
      city,
      state,
      pincode,
      yearsInBusiness,
      numberOfProjects,
      specialization,
      operatingCities,
      websiteUrl,
    } = req.body;

    // Validate required fields
    if (!companyName || !companyType || !contactPersonName || !email || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['companyName', 'companyType', 'contactPersonName', 'email', 'phone'],
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email already exists
    const existingPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.email, email))
      .limit(1);

    if (existingPartner.length > 0) {
      return res.status(409).json({
        error: 'Email already registered',
        message: 'A partner with this email already exists',
      });
    }

    // Insert new partner
    const result = await db.insert(partners).values({
      companyName,
      companyType,
      registrationNumber: registrationNumber || null,
      gstNumber: gstNumber || null,
      reraNumber: reraNumber || null,
      contactPersonName,
      email,
      phone,
      alternatePhone: alternatePhone || null,
      officeAddress: officeAddress || null,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      yearsInBusiness: yearsInBusiness || null,
      numberOfProjects: numberOfProjects || null,
      specialization: specialization || null,
      operatingCities: operatingCities || null,
      websiteUrl: websiteUrl || null,
      isVerified: false,
      subscriptionPlan: 'free',
    });

    // MySQL doesn't support .returning(), so we fetch the newly created partner
    const insertId = Number(result[0].insertId);
    const newPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.id, insertId))
      .limit(1);

    // Send email notification to admin
    try {
      await sendPartnerRegistrationNotification({
        partnerId: insertId,
        companyName,
        contactPerson: contactPersonName,
        email,
        phone,
        companyType,
        gstNumber,
        reraNumber,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the registration if email fails
    }

    return res.status(201).json({
      success: true,
      message: 'Partner registered successfully',
      partner: newPartner[0],
    });
  } catch (error) {
    console.error('Partner registration error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to register partner',
    });
  }
}
