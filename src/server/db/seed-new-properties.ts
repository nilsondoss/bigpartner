/**
 * Seed New Property Listings
 * Adds 4 new property requirements to the database
 */

import { db } from './client.js';
import { properties } from './schema.js';

const newProperties = [
  {
    // Property 1: 10 Acre Punjai/Dry Land for Layout
    title: 'Required: 10 Acre Punjai or Dry Land for Layout Purpose',
    slug: '10-acre-punjai-dry-land-chennai-layout',
    description: `REQUIRED: 10 ACRE PUNJAI OR DRY LAND FOR LAYOUT PURPOSE

Location: Within 15 km radius from Chennai

Property Details:
- Land Type: Punjai (Wet Land) or Dry Land
- Total Area: 10 Acres
- Purpose: Layout Development
- Preferred Distance: Within 15 km from Chennai city center

Ideal for:
- Residential layout development
- Plotted development projects
- Real estate investment
- Land banking

This is a requirement listing. If you have suitable land available, please contact us with complete details including exact location, documentation status, and pricing.`,
    propertyType: 'farmland',
    status: 'available',
    
    // Location
    addressLine1: 'Within 15 km radius from Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    locality: 'Chennai Outskirts',
    
    // Pricing
    price: 0, // Price on request
    currency: 'INR',
    negotiable: true,
    
    // Property Details
    plotArea: 435600, // 10 acres in sqft (1 acre = 43,560 sqft)
    areaUnit: 'sqft',
    
    // SEO
    metaTitle: 'Required: 10 Acre Land for Layout - Chennai | Big Partner',
    metaDescription: 'Looking for 10 acre punjai or dry land for layout development within 15 km from Chennai. Contact us if you have suitable land available.',
    keywords: JSON.stringify(['10 acre land', 'punjai land', 'dry land', 'layout development', 'chennai land', 'land for sale chennai']),
    isFeatured: true,
    isVerified: true,
    
    // Timestamps
    publishedAt: new Date(),
  },
  
  {
    // Property 2: Showroom for Non-Veg Restaurant
    title: 'Required: 2000-3000 Sq Ft Showroom for Non-Veg Restaurant - Ashok Nagar',
    slug: 'showroom-rental-nonveg-restaurant-ashok-nagar',
    description: `REQUIRED: 2000 TO 3000 SQUARE FEET SHOWROOM FOR RENTAL PURPOSE

Purpose: Running Non-Veg Restaurant
Location: Ashok Nagar Area, Chennai
Floor: Ground Floor Only

Property Requirements:
- Area: 2,000 to 3,000 square feet
- Floor: Ground floor mandatory
- Type: Showroom/Commercial space
- Location: Ashok Nagar and surrounding areas
- Purpose: Non-vegetarian restaurant operations

Ideal Features:
- Good frontage and visibility
- Adequate parking space
- Proper drainage and water supply
- Commercial electricity connection
- Easy accessibility

This is a rental requirement. Property owners with suitable showrooms in Ashok Nagar area, please contact us with rental terms, advance requirements, and property details.`,
    propertyType: 'commercial',
    status: 'available',
    
    // Location
    addressLine1: 'Ashok Nagar Area',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600083',
    locality: 'Ashok Nagar',
    
    // Pricing
    price: 0, // Rental price on request
    currency: 'INR',
    negotiable: true,
    
    // Property Details
    builtUpArea: 2500, // Average of 2000-3000
    areaUnit: 'sqft',
    floorNumber: 0, // Ground floor
    furnishingStatus: 'unfurnished',
    
    // Amenities
    amenities: JSON.stringify(['parking', 'water_supply', 'drainage', 'commercial_electricity', 'road_access']),
    
    // SEO
    metaTitle: 'Required: Showroom for Restaurant Rental - Ashok Nagar | Big Partner',
    metaDescription: '2000-3000 sq ft showroom required for non-veg restaurant in Ashok Nagar, Chennai. Ground floor only. Contact us if you have suitable property.',
    keywords: JSON.stringify(['showroom rental', 'restaurant space', 'ashok nagar', 'commercial rental', 'ground floor showroom', 'chennai commercial']),
    isFeatured: true,
    isVerified: true,
    
    // Timestamps
    publishedAt: new Date(),
  },
  
  {
    // Property 3: Commercial Vacant Land - Vallam SIPCOT
    title: 'Commercial Vacant Land Available for Rent - Vallam SIPCOT (Oragadam)',
    slug: 'commercial-land-rental-vallam-sipcot-oragadam',
    description: `COMMERCIAL VACANT LAND AVAILABLE FOR RENT IN VALLAM SIPCOT (ORAGADAM)

Available Area: 1 Acre to 10 Acres
Rental Rate: ₹8 per Square Foot
Advance: 10 Months Rental

Location Details:
- Area: Vallam SIPCOT, Oragadam
- Type: Commercial/Industrial vacant land
- Minimum: 1 Acre (43,560 sq ft)
- Maximum: 10 Acres (4,35,600 sq ft)

Rental Terms:
- Rate: ₹8 per sq ft per month
- Advance: 10 months rental (refundable)
- Lease Period: Negotiable (minimum 3 years preferred)

Example Calculation (1 Acre):
- Area: 43,560 sq ft
- Monthly Rent: 43,560 × ₹8 = ₹3,48,480
- Advance (10 months): ₹34,84,800

Ideal For:
- Industrial warehouses
- Manufacturing units
- Logistics and distribution centers
- Storage facilities
- Commercial developments

Location Advantages:
- SIPCOT Industrial Area
- Excellent connectivity to Chennai
- Proximity to major highways
- Established industrial zone
- Good infrastructure

Contact us for site visit and detailed terms.`,
    propertyType: 'industrial',
    status: 'available',
    
    // Location
    addressLine1: 'Vallam SIPCOT',
    addressLine2: 'Oragadam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '602105',
    locality: 'Oragadam',
    landmark: 'SIPCOT Industrial Area',
    
    // Pricing (calculated for 1 acre as base)
    price: 348480, // Monthly rent for 1 acre (43,560 × 8)
    pricePerSqft: 8,
    currency: 'INR',
    negotiable: true,
    
    // Property Details
    plotArea: 43560, // 1 acre minimum
    areaUnit: 'sqft',
    
    // Amenities
    amenities: JSON.stringify(['road_access', 'electricity', 'water_supply', 'security', 'industrial_zone', 'highway_access']),
    
    // SEO
    metaTitle: 'Commercial Land for Rent - Vallam SIPCOT Oragadam | Big Partner',
    metaDescription: '1-10 acres commercial vacant land for rent in Vallam SIPCOT, Oragadam. ₹8/sqft. Ideal for industrial, warehouse, manufacturing. 10 months advance.',
    keywords: JSON.stringify(['commercial land rental', 'sipcot land', 'oragadam land', 'industrial land', 'warehouse land', 'vallam sipcot']),
    isFeatured: true,
    isVerified: true,
    
    // Timestamps
    publishedAt: new Date(),
  },
  
  {
    // Property 4: Building for CBSE School
    title: 'Required: Building on Rent for CBSE School - Chennai & Outskirts',
    slug: 'building-rental-cbse-school-chennai',
    description: `LOOKING FOR A BUILDING ON RENT FOR CBSE SCHOOL

Requirements:

WITHIN CHENNAI:
- Land: 11 Grounds (approximately 10,890 sq ft)
- Building: 20,000 square feet minimum
- Type: Educational institution ready or convertible

OUTSIDE CHENNAI:
- Land: 1 Acre (43,560 sq ft)
- Building: 20,000 square feet minimum
- Type: Standalone building with open space

PREFERRED LOCATIONS:

1. OMR - Kelambakkam
   - IT corridor proximity
   - Growing residential area
   - Good connectivity

2. ECR - Akkarai
   - Coastal area
   - Premium residential zone
   - Excellent infrastructure

3. Chrompet - Mahindra City - Vandalur
   - Established residential areas
   - Industrial corridor proximity
   - Good transport connectivity

4. Medavakkam Belt
   - Rapidly developing area
   - Residential growth zone
   - Affordable options

5. All South Chennai Areas
   - Velachery, Pallikaranai
   - Tambaram, Perungalathur
   - Guduvanchery, Urapakkam

Building Requirements:
- Minimum 20,000 sq ft built-up area
- Ground + 2 or 3 floors preferred
- Adequate open space for playground
- Proper ventilation and natural light
- Parking facility for staff and visitors
- Safe and secure location
- Residential area proximity

Ideal Features:
- Existing school building (preferred)
- Convertible commercial building
- Good road access
- Public transport connectivity
- Residential catchment area
- Safe neighborhood

This is a long-term rental requirement for establishing a CBSE affiliated school. Property owners with suitable buildings, please contact us with complete details, rental terms, and documentation status.`,
    propertyType: 'commercial',
    status: 'available',
    
    // Location
    addressLine1: 'Multiple Locations - South Chennai',
    addressLine2: 'OMR, ECR, Chrompet, Medavakkam, Vandalur',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600000',
    locality: 'South Chennai',
    landmark: 'Various locations in South Chennai',
    
    // Pricing
    price: 0, // Rental price on request
    currency: 'INR',
    negotiable: true,
    
    // Property Details
    builtUpArea: 20000,
    plotArea: 43560, // 1 acre for outside Chennai
    areaUnit: 'sqft',
    totalFloors: 3,
    
    // Amenities
    amenities: JSON.stringify([
      'parking',
      'playground',
      'security',
      'water_supply',
      'power_backup',
      'cctv',
      'fire_safety',
      'ventilation',
      'road_access',
      'public_transport'
    ]),
    
    // SEO
    metaTitle: 'Required: Building for CBSE School Rent - Chennai | Big Partner',
    metaDescription: '20,000 sq ft building required for CBSE school in South Chennai. Locations: OMR, ECR, Chrompet, Medavakkam, Vandalur. Long-term rental.',
    keywords: JSON.stringify([
      'school building rental',
      'cbse school building',
      'educational building',
      'school property chennai',
      'omr school building',
      'south chennai school'
    ]),
    isFeatured: true,
    isVerified: true,
    
    // Timestamps
    publishedAt: new Date(),
  },
];

async function seedNewProperties() {
  try {
    console.log('🌱 Starting to seed new properties...');
    
    for (const property of newProperties) {
      console.log(`\n📝 Adding property: ${property.title}`);
      
      const result = await db.insert(properties).values(property);
      
      console.log(`✅ Property added successfully with ID: ${result[0].insertId}`);
    }
    
    console.log('\n✅ All 4 new properties have been added successfully!');
    console.log('\n📊 Summary:');
    console.log('1. ✅ 10 Acre Punjai/Dry Land - Chennai (Layout)');
    console.log('2. ✅ 2000-3000 Sq Ft Showroom - Ashok Nagar (Restaurant)');
    console.log('3. ✅ Commercial Land - Vallam SIPCOT (1-10 Acres)');
    console.log('4. ✅ Building for CBSE School - South Chennai');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    process.exit(1);
  }
}

// Run the seed function
seedNewProperties();
