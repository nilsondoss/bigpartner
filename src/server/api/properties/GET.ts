import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { properties } from '../../db/schema.js';
import { eq, and, gte, lte, desc, asc, sql, inArray } from 'drizzle-orm';

/**
 * GET /api/properties
 * Fetch all properties with optional filtering and sorting
 * 
 * Query Parameters:
 * - city: Filter by city
 * - state: Filter by state
 * - propertyType: Filter by property type (apartment, villa, plot, commercial, farmhouse)
 * - status: Filter by status (available, sold, reserved, under_construction)
 * - minPrice: Minimum price
 * - maxPrice: Maximum price
 * - bedrooms: Number of bedrooms
 * - isFeatured: Filter featured properties (true/false)
 * - isVerified: Filter verified properties (true/false)
 * - sortBy: Sort field (price, createdAt, viewCount)
 * - sortOrder: Sort order (asc, desc)
 * - limit: Number of results (default: 50)
 * - offset: Pagination offset (default: 0)
 */
export default async function handler(req: Request, res: Response) {
  try {
    const {
      city,
      state,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      isFeatured,
      isVerified,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = '50',
      offset = '0',
    } = req.query;

    // Build WHERE conditions
    const conditions = [];

    // TODO: Re-enable after migration
    // // Always exclude deleted properties (unless explicitly requested)
    // const includeDeleted = req.query.includeDeleted === 'true';
    // if (!includeDeleted) {
    //   conditions.push(eq(properties.deleted, false));
    // }

    // // Filter by approval status (default: only show approved)
    // const approvalStatus = req.query.approvalStatus as string;
    // if (approvalStatus) {
    //   conditions.push(eq(properties.approvalStatus, approvalStatus));
    // } else {
    //   // By default, only show approved properties for public API
    //   conditions.push(eq(properties.approvalStatus, 'approved'));
    // }

    if (city) {
      conditions.push(eq(properties.city, city as string));
    }

    if (state) {
      conditions.push(eq(properties.state, state as string));
    }

    if (propertyType) {
      // Handle multiple property types (can be array or single value)
      // Convert to lowercase for case-insensitive matching
      const types = Array.isArray(propertyType) 
        ? propertyType.map(t => (t as string).toLowerCase())
        : [(propertyType as string).toLowerCase()];
      if (types.length === 1) {
        conditions.push(eq(properties.propertyType, types[0]));
      } else {
        conditions.push(inArray(properties.propertyType, types));
      }
    }

    if (status) {
      conditions.push(eq(properties.status, status as string));
    }

    if (minPrice) {
      conditions.push(gte(properties.price, minPrice as string));
    }

    if (maxPrice) {
      conditions.push(lte(properties.price, maxPrice as string));
    }

    if (bedrooms) {
      conditions.push(eq(properties.bedrooms, parseInt(bedrooms as string)));
    }

    if (isFeatured !== undefined) {
      conditions.push(eq(properties.isFeatured, isFeatured === 'true'));
    }

    if (isVerified !== undefined) {
      conditions.push(eq(properties.isVerified, isVerified === 'true'));
    }

    // Build query
    let query = db.select().from(properties);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const validSortFields = ['id', 'title', 'price', 'createdAt', 'updatedAt'] as const;
    const sortFieldName = validSortFields.includes(sortBy as any) ? sortBy : 'createdAt';
    const sortField = properties[sortFieldName as keyof typeof properties];
    query = query.orderBy(sortOrder === 'asc' ? asc(sortField as any) : desc(sortField as any)) as any;

    // Apply pagination
    query = query.limit(parseInt(limit as string)).offset(parseInt(offset as string)) as any;

    // Execute query
    const results = await query;

    // Transform database rows to match frontend expectations
    const transformedResults = results.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      type: row.propertyType,  // Map propertyType → type
      status: row.status,
      location: `${row.city}, ${row.state}`,  // Combine city + state
      price: parseFloat(row.price as string),
      size: row.carpetArea || row.builtUpArea || row.plotArea || 0,
      area: parseFloat((row.carpetArea || row.builtUpArea || row.plotArea || 0) as string),  // Add area field for frontend compatibility
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      featuredImage: row.featuredImage,  // Already camelCase from Drizzle
      image: row.featuredImage,  // Alias for compatibility
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      addressLine1: row.addressLine1,
      addressLine2: row.addressLine2,
      locality: row.locality,
      landmark: row.landmark,
      latitude: row.latitude,
      longitude: row.longitude,
      pricePerSqft: row.pricePerSqft,
      currency: row.currency,
      negotiable: row.negotiable,
      balconies: row.balconies,
      areaUnit: row.areaUnit,
      totalFloors: row.totalFloors,
      floorNumber: row.floorNumber,
      facing: row.facing,
      furnishingStatus: row.furnishingStatus,
      ageOfProperty: row.ageOfProperty,
      possessionDate: row.possessionDate,
      amenities: row.amenities,
      images: row.images,
      videoUrl: row.videoUrl,
      virtualTourUrl: row.virtualTourUrl,
      reraApproved: row.reraApproved,
      reraNumber: row.reraNumber,
      approvalAuthority: row.approvalAuthority,
      ownershipType: row.ownershipType,
      partnerId: row.partnerId,
      ownerName: row.ownerName,
      ownerPhone: row.ownerPhone,
      ownerEmail: row.ownerEmail,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      keywords: row.keywords,
      isFeatured: row.isFeatured,
      isVerified: row.isVerified,
      viewCount: row.viewCount,
      inquiryCount: row.inquiryCount,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    // Get total count for pagination
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(properties);
    const totalCount = conditions.length > 0 
      ? await countQuery.where(and(...conditions))
      : await countQuery;

    res.json({
      properties: transformedResults,
      pagination: {
        total: totalCount[0]?.count || 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: (parseInt(offset as string) + transformedResults.length) < (totalCount[0]?.count || 0),
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      error: 'Failed to fetch properties',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
