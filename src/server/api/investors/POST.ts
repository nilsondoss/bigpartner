import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { investors } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendInvestorRegistrationNotification } from '../../lib/email.js';

export default async function handler(req: Request, res: Response) {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      investmentBudgetMin,
      investmentBudgetMax,
      propertyTypes,
      preferredLocations,
      investmentPurpose,
      panNumber,
      aadharNumber,
      occupation,
      annualIncome,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Full name, email, and phone are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email',
        message: 'Please provide a valid email address' 
      });
    }

    // Check if email already exists
    const existingInvestor = await db
      .select()
      .from(investors)
      .where(eq(investors.email, email))
      .limit(1);

    if (existingInvestor.length > 0) {
      return res.status(409).json({ 
        error: 'Email already registered',
        message: 'An investor with this email already exists' 
      });
    }

    // Insert new investor (MySQL doesn't support .returning())
    const result = await db.insert(investors).values({
      fullName,
      email,
      phone,
      dateOfBirth: dateOfBirth || null,
      addressLine1: addressLine1 || null,
      addressLine2: addressLine2 || null,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      investmentBudgetMin: investmentBudgetMin || null,
      investmentBudgetMax: investmentBudgetMax || null,
      propertyTypes: propertyTypes || null,
      preferredLocations: preferredLocations || null,
      investmentPurpose: investmentPurpose || null,
      panNumber: panNumber || null,
      aadharNumber: aadharNumber || null,
      occupation: occupation || null,
      annualIncome: annualIncome || null,
      verificationStatus: 'pending',
    });

    // Fetch the newly created investor using insertId
    const insertId = Number(result[0].insertId);
    const newInvestor = await db
      .select()
      .from(investors)
      .where(eq(investors.id, insertId))
      .limit(1);

    // Send email notification to admin
    try {
      await sendInvestorRegistrationNotification({
        investorId: insertId,
        fullName,
        email,
        phone,
        investmentBudgetMin,
        investmentBudgetMax,
        propertyTypes,
        preferredLocations,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Investor registered successfully',
      investor: newInvestor[0],
    });
  } catch (error) {
    console.error('Error registering investor:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: String(error) 
    });
  }
}
