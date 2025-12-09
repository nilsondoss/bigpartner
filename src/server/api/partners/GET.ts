import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { partners } from '../../db/schema.js';
import { eq, like, or, desc, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { search, status, companyType } = req.query;

    // Build conditions array
    const conditions = [];
    
    if (search && typeof search === 'string') {
      conditions.push(
        or(
          like(partners.companyName, `%${search}%`),
          like(partners.email, `%${search}%`),
          like(partners.contactPersonName, `%${search}%`)
        )
      );
    }

    if (status && typeof status === 'string') {
      conditions.push(eq(partners.verificationStatus, status));
    }

    if (companyType && typeof companyType === 'string') {
      conditions.push(eq(partners.companyType, companyType));
    }

    // Build and execute query
    let query = db.select().from(partners);
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0]! : and(...conditions)) as typeof query;
    }
    
    const results = await query.orderBy(desc(partners.createdAt));

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch partners',
      message: String(error)
    });
  }
}
