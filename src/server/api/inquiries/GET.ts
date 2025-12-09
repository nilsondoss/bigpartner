import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { inquiries } from '../../db/schema.js';
import { desc, like, or, eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { search, status, inquiryType } = req.query;

    let query = db.select().from(inquiries);

    // Apply filters
    const conditions = [];

    if (search && typeof search === 'string') {
      conditions.push(
        or(
          like(inquiries.fullName, `%${search}%`),
          like(inquiries.email, `%${search}%`),
          like(inquiries.phone, `%${search}%`),
          like(inquiries.subject, `%${search}%`)
        )
      );
    }

    if (status && typeof status === 'string') {
      conditions.push(eq(inquiries.status, status));
    }

    if (inquiryType && typeof inquiryType === 'string') {
      conditions.push(eq(inquiries.inquiryType, inquiryType));
    }

    // Apply conditions if any
    if (conditions.length > 0) {
      // @ts-ignore - Drizzle typing issue with multiple conditions
      query = query.where(...conditions);
    }

    // Order by newest first
    const results = await query.orderBy(desc(inquiries.createdAt));

    res.json(results);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries', message: String(error) });
  }
}
