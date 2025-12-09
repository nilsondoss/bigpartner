import { mysqlTable, int, varchar, text, timestamp, boolean, date, decimal, index } from 'drizzle-orm/mysql-core';

/**
 * Users Table
 * Stores general users who browse properties and make inquiries
 */
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  
  // Personal Information
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  
  // Authentication
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  resetPasswordToken: varchar('reset_password_token', { length: 255 }),
  resetPasswordExpires: timestamp('reset_password_expires'),
  lastLoginAt: timestamp('last_login_at'),
  
  // Profile
  avatar: varchar('avatar', { length: 500 }),
  bio: text('bio'),
  // role: varchar('role', { length: 50 }).default('user').notNull(), // 'user' or 'admin' - DISABLED: Migration not applied to production DB
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index('user_email_idx').on(table.email),
  createdAtIdx: index('user_created_at_idx').on(table.createdAt),
}));

/**
 * Investors Table
 * Stores information about investors looking to invest in properties
 * Optimized with indexes for common queries
 */
export const investors = mysqlTable('investors', {
  id: int('id').primaryKey().autoincrement(),
  
  // Personal Information
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  dateOfBirth: date('date_of_birth'),
  
  // Authentication
  passwordHash: varchar('password_hash', { length: 255 }),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  resetPasswordToken: varchar('reset_password_token', { length: 255 }),
  resetPasswordExpires: timestamp('reset_password_expires'),
  lastLoginAt: timestamp('last_login_at'),
  
  // Address
  addressLine1: varchar('address_line1', { length: 255 }),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  
  // Investment Preferences
  investmentBudgetMin: decimal('investment_budget_min', { precision: 15, scale: 2 }),
  investmentBudgetMax: decimal('investment_budget_max', { precision: 15, scale: 2 }),
  propertyTypes: text('property_types'), // JSON array of property types
  preferredLocations: text('preferred_locations'), // JSON array of locations
  investmentPurpose: varchar('investment_purpose', { length: 100 }),
  
  // KYC Details
  panNumber: varchar('pan_number', { length: 10 }),
  aadharNumber: varchar('aadhar_number', { length: 12 }),
  occupation: varchar('occupation', { length: 100 }),
  annualIncome: varchar('annual_income', { length: 50 }),
  
  // Status and Verification
  verificationStatus: varchar('verification_status', { length: 20 }).default('pending').notNull(), // 'pending', 'verified', 'rejected'
  isVerified: boolean('is_verified').default(false),
  verificationDate: timestamp('verification_date'),
  rejectionReason: text('rejection_reason'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Indexes for common queries
  emailIdx: index('email_idx').on(table.email),
  phoneIdx: index('phone_idx').on(table.phone),
  verificationStatusIdx: index('verification_status_idx').on(table.verificationStatus),
  cityIdx: index('city_idx').on(table.city),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

/**
 * Inquiries Table
 * Stores contact inquiries and property-specific inquiries from users
 * Optimized with indexes for admin dashboard queries
 */
export const inquiries = mysqlTable('inquiries', {
  id: int('id').primaryKey().autoincrement(),
  
  // Contact Information
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  
  // Inquiry Details
  inquiryType: varchar('inquiry_type', { length: 50 }).notNull(), // 'general', 'property', 'investment', 'partnership', 'support'
  propertyId: varchar('property_id', { length: 100 }), // Optional: for property-specific inquiries
  propertyName: varchar('property_name', { length: 255 }), // Optional: property name
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  
  // User Type
  userType: varchar('user_type', { length: 50 }), // 'investor', 'partner', 'other'
  
  // Status and Priority
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'in_progress', 'resolved', 'closed'
  priority: varchar('priority', { length: 20 }).default('medium').notNull(), // 'low', 'medium', 'high'
  assignedTo: varchar('assigned_to', { length: 255 }), // Admin/staff member assigned
  
  // Response
  responseMessage: text('response_message'),
  respondedAt: timestamp('responded_at'),
  respondedBy: varchar('responded_by', { length: 255 }),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Indexes for common queries
  emailIdx: index('inquiry_email_idx').on(table.email),
  statusIdx: index('inquiry_status_idx').on(table.status),
  priorityIdx: index('inquiry_priority_idx').on(table.priority),
  inquiryTypeIdx: index('inquiry_type_idx').on(table.inquiryType),
  userTypeIdx: index('inquiry_user_type_idx').on(table.userType),
  propertyIdIdx: index('inquiry_property_id_idx').on(table.propertyId),
  createdAtIdx: index('inquiry_created_at_idx').on(table.createdAt),
  // Composite index for common filter combinations
  statusPriorityIdx: index('inquiry_status_priority_idx').on(table.status, table.priority),
}));

/**
 * Partners Table
 * Stores information about property developers, builders, and brokers
 * Optimized with indexes for search and filtering
 */
export const partners = mysqlTable('partners', {
  id: int('id').primaryKey().autoincrement(),
  
  // Company Information
  companyName: varchar('company_name', { length: 255 }).notNull(),
  companyType: varchar('company_type', { length: 100 }).notNull(), // 'developer', 'builder', 'broker'
  registrationNumber: varchar('registration_number', { length: 100 }),
  gstNumber: varchar('gst_number', { length: 15 }),
  reraNumber: varchar('rera_number', { length: 100 }),
  
  // Contact Information
  contactPersonName: varchar('contact_person_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  alternatePhone: varchar('alternate_phone', { length: 20 }),
  websiteUrl: varchar('website_url', { length: 255 }),
  
  // Authentication
  passwordHash: varchar('password_hash', { length: 255 }),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  resetPasswordToken: varchar('reset_password_token', { length: 255 }),
  resetPasswordExpires: timestamp('reset_password_expires'),
  lastLoginAt: timestamp('last_login_at'),
  
  // Address
  officeAddress: varchar('office_address', { length: 500 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  
  // Business Details
  yearsInBusiness: int('years_in_business'),
  numberOfProjects: int('number_of_projects').default(0),
  specialization: text('specialization'), // JSON array of specializations
  operatingCities: text('operating_cities'), // JSON array of cities
  
  // Documents
  companyPanCard: varchar('company_pan_card', { length: 255 }),
  gstCertificate: varchar('gst_certificate', { length: 255 }),
  reraCertificate: varchar('rera_certificate', { length: 255 }),
  
  // Status and Verification
  verificationStatus: varchar('verification_status', { length: 20 }).default('pending').notNull(), // 'pending', 'verified', 'rejected'
  isVerified: boolean('is_verified').default(false),
  verificationDate: timestamp('verification_date'),
  rejectionReason: text('rejection_reason'),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }).default('free').notNull(),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Indexes for common queries
  emailIdx: index('partner_email_idx').on(table.email),
  phoneIdx: index('partner_phone_idx').on(table.phone),
  companyNameIdx: index('partner_company_name_idx').on(table.companyName),
  companyTypeIdx: index('partner_company_type_idx').on(table.companyType),
  verificationStatusIdx: index('partner_verification_status_idx').on(table.verificationStatus),
  cityIdx: index('partner_city_idx').on(table.city),
  subscriptionPlanIdx: index('partner_subscription_plan_idx').on(table.subscriptionPlan),
  createdAtIdx: index('partner_created_at_idx').on(table.createdAt),
  // Composite index for common filter combinations
  typeStatusIdx: index('partner_type_status_idx').on(table.companyType, table.verificationStatus),
}));

/**
 * Properties Table
 * Stores property listings with comprehensive details
 * Optimized with indexes for search and filtering
 */
export const properties = mysqlTable('properties', {
  id: int('id').primaryKey().autoincrement(),
  
  // Basic Information
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  propertyType: varchar('property_type', { length: 50 }).notNull(), // 'apartment', 'villa', 'plot', 'commercial', 'farmhouse'
  status: varchar('status', { length: 50 }).default('available').notNull(), // 'available', 'sold', 'reserved', 'under_construction'
  
  // Location
  addressLine1: varchar('address_line1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  locality: varchar('locality', { length: 255 }),
  landmark: varchar('landmark', { length: 255 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  
  // Pricing
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  pricePerSqft: decimal('price_per_sqft', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('INR').notNull(),
  negotiable: boolean('negotiable').default(false),
  
  // Property Details
  bedrooms: int('bedrooms'),
  bathrooms: int('bathrooms'),
  balconies: int('balconies'),
  carpetArea: decimal('carpet_area', { precision: 10, scale: 2 }),
  builtUpArea: decimal('built_up_area', { precision: 10, scale: 2 }),
  plotArea: decimal('plot_area', { precision: 10, scale: 2 }),
  areaUnit: varchar('area_unit', { length: 20 }).default('sqft'), // 'sqft', 'sqm', 'acres'
  
  // Building Details
  totalFloors: int('total_floors'),
  floorNumber: int('floor_number'),
  facing: varchar('facing', { length: 50 }), // 'north', 'south', 'east', 'west', 'north-east', etc.
  furnishingStatus: varchar('furnishing_status', { length: 50 }), // 'furnished', 'semi-furnished', 'unfurnished'
  ageOfProperty: int('age_of_property'), // in years
  possessionDate: date('possession_date'),
  
  // Amenities (JSON array)
  amenities: text('amenities'), // ['parking', 'gym', 'pool', 'security', 'garden', 'clubhouse', etc.]
  
  // Media
  featuredImage: varchar('featured_image', { length: 500 }),
  images: text('images'), // JSON array of image URLs
  videoUrl: varchar('video_url', { length: 500 }),
  virtualTourUrl: varchar('virtual_tour_url', { length: 500 }),
  
  // Legal & Documentation
  reraApproved: boolean('rera_approved').default(false),
  reraNumber: varchar('rera_number', { length: 100 }),
  approvalAuthority: varchar('approval_authority', { length: 255 }),
  ownershipType: varchar('ownership_type', { length: 50 }), // 'freehold', 'leasehold', 'co-operative'
  
  // Partner/Owner Information
  partnerId: int('partner_id'), // Foreign key to partners table
  // createdBy: int('created_by').references(() => users.id), // Foreign key to users table - who created this property (temporarily disabled)
  ownerName: varchar('owner_name', { length: 255 }),
  ownerPhone: varchar('owner_phone', { length: 20 }),
  ownerEmail: varchar('owner_email', { length: 255 }),
  
  // SEO & Marketing
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  keywords: text('keywords'), // JSON array
  isFeatured: boolean('is_featured').default(false),
  isVerified: boolean('is_verified').default(false),
  
  // Approval & Moderation (temporarily disabled - migration pending)
  // approvalStatus: varchar('approval_status', { length: 50 }).default('pending').notNull(), // 'pending', 'approved', 'rejected'
  // rejectionReason: text('rejection_reason'),
  // approvedBy: int('approved_by').references(() => users.id),
  // approvedAt: timestamp('approved_at'),
  
  // Soft Delete (temporarily disabled - migration pending)
  // deleted: boolean('deleted').default(false).notNull(),
  // deletedAt: timestamp('deleted_at'),
  
  // Analytics
  viewCount: int('view_count').default(0),
  inquiryCount: int('inquiry_count').default(0),
  
  // Timestamps
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Indexes for common queries
  slugIdx: index('property_slug_idx').on(table.slug),
  cityIdx: index('property_city_idx').on(table.city),
  stateIdx: index('property_state_idx').on(table.state),
  propertyTypeIdx: index('property_type_idx').on(table.propertyType),
  statusIdx: index('property_status_idx').on(table.status),
  priceIdx: index('property_price_idx').on(table.price),
  bedroomsIdx: index('property_bedrooms_idx').on(table.bedrooms),
  partnerIdIdx: index('property_partner_id_idx').on(table.partnerId),
  isFeaturedIdx: index('property_is_featured_idx').on(table.isFeatured),
  isVerifiedIdx: index('property_is_verified_idx').on(table.isVerified),
  publishedAtIdx: index('property_published_at_idx').on(table.publishedAt),
  createdAtIdx: index('property_created_at_idx').on(table.createdAt),
  // Composite indexes for common filter combinations
  cityTypeIdx: index('property_city_type_idx').on(table.city, table.propertyType),
  statusTypeIdx: index('property_status_type_idx').on(table.status, table.propertyType),
  cityPriceIdx: index('property_city_price_idx').on(table.city, table.price),
}));

/**
 * Favorites Table
 * Stores user favorites/wishlist for properties
 */
export const favorites = mysqlTable('favorites', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  propertyId: int('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Unique constraint to prevent duplicate favorites
  uniqueFavorite: index('unique_favorite_idx').on(table.userId, table.propertyId),
  userIdIdx: index('favorite_user_id_idx').on(table.userId),
  propertyIdIdx: index('favorite_property_id_idx').on(table.propertyId),
}));

/**
 * Sessions Table
 * Stores user session data for authentication
 */
export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: int('user_id').notNull(),
  userType: varchar('user_type', { length: 50 }).notNull(), // 'user', 'investor', 'partner'
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('session_user_id_idx').on(table.userId),
  expiresAtIdx: index('session_expires_at_idx').on(table.expiresAt),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Investor = typeof investors.$inferSelect;
export type NewInvestor = typeof investors.$inferInsert;

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;

export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
