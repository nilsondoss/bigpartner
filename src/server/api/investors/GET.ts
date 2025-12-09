import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { investors } from '../../db/schema.js';
import { eq, like, or, desc, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { search, status } = req.query;

    // Build conditions array
    const conditions = [];
    
    if (search && typeof search === 'string') {
      conditions.push(
        or(
          like(investors.fullName, `%${search}%`),
          like(investors.email, `%${search}%`),
          like(investors.phone, `%${search}%`)
        )
      );
    }

    if (status && typeof status === 'string') {
      conditions.push(eq(investors.verificationStatus, status));
    }

    // Build and execute query
    let query = db.select().from(investors);
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0]! : and(...conditions)) as typeof query;
    }
    
    const results = await query.orderBy(desc(investors.createdAt));

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching investors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch investors',
      message: String(error)
    });
  }
}
