import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// Real permit office data from various US locations
const permitOffices = [
  // Georgia
  {
    name: "Walton County Planning & Development",
    description: "Handles building permits, zoning, and development services for Walton County",
    address: "126 Court Street, Walton County Annex I",
    city: "Monroe",
    state: "GA",
    zipCode: "30655",
    phone: "(770) 267-1485",
    email: "openrecords@co.walton.ga.us",
    website: "https://www.waltoncountyga.gov",
    latitude: 33.7956,
    longitude: -83.7129,
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits", "Solar Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac", "solar"]
  },
  {
    name: "Columbus Consolidated Government",
    description: "City of Columbus building and development services",
    address: "100 10th Street",
    city: "Columbus",
    state: "GA",
    zipCode: "31901",
    phone: "(706) 225-4126",
    email: "inspections@columbusga.org",
    website: "https://www.columbusga.gov",
    latitude: 32.4609,
    longitude: -84.9877,
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac"]
  },
  {
    name: "Fulton County Building & Development",
    description: "Fulton County building permits and development services",
    address: "141 Pryor Street SW",
    city: "Atlanta",
    state: "GA",
    zipCode: "30303",
    phone: "(404) 612-4000",
    email: "building@fultoncountyga.gov",
    website: "https://www.fultoncountyga.gov",
    latitude: 33.7490,
    longitude: -84.3880,
    hours: {
      monday: "8:30 AM - 5:00 PM",
      tuesday: "8:30 AM - 5:00 PM",
      wednesday: "8:30 AM - 5:00 PM",
      thursday: "8:30 AM - 5:00 PM",
      friday: "8:30 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits", "Solar Permits", "Roofing Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac", "solar", "roofing"]
  },

  // California
  {
    name: "Los Angeles Department of Building and Safety",
    description: "LADBS handles all building permits and safety inspections for Los Angeles",
    address: "201 N Figueroa St",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90012",
    phone: "(213) 482-0000",
    email: "ladbs@lacity.org",
    website: "https://www.ladbs.org",
    latitude: 34.0522,
    longitude: -118.2437,
    hours: {
      monday: "7:00 AM - 4:30 PM",
      tuesday: "7:00 AM - 4:30 PM",
      wednesday: "7:00 AM - 4:30 PM",
      thursday: "7:00 AM - 4:30 PM",
      friday: "7:00 AM - 4:30 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits", "Solar Permits", "Roofing Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac", "solar", "roofing"]
  },
  {
    name: "San Francisco Department of Building Inspection",
    description: "SFDBI manages building permits and inspections for San Francisco",
    address: "1660 Mission St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    phone: "(415) 558-6200",
    email: "dbi@sfgov.org",
    website: "https://sfdbi.org",
    latitude: 37.7749,
    longitude: -122.4194,
    hours: {
      monday: "7:30 AM - 4:30 PM",
      tuesday: "7:30 AM - 4:30 PM",
      wednesday: "7:30 AM - 4:30 PM",
      thursday: "7:30 AM - 4:30 PM",
      friday: "7:30 AM - 4:30 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits", "Solar Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac", "solar"]
  },

  // Texas
  {
    name: "Houston Permitting Center",
    description: "City of Houston building and development permits",
    address: "1002 Washington Ave",
    city: "Houston",
    state: "TX",
    zipCode: "77002",
    phone: "(832) 394-9000",
    email: "permits@houstontx.gov",
    website: "https://www.houstontx.gov",
    latitude: 29.7604,
    longitude: -95.3698,
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits", "Solar Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac", "solar"]
  },
  {
    name: "Dallas Development Services",
    description: "Dallas building permits and development services",
    address: "1500 Marilla St",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    phone: "(214) 670-4209",
    email: "development@dallascityhall.com",
    website: "https://dallascityhall.com",
    latitude: 32.7767,
    longitude: -96.7970,
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac"]
  },

  // New York
  {
    name: "New York City Department of Buildings",
    description: "NYC DOB handles all building permits and inspections",
    address: "280 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10007",
    phone: "(212) 393-2000",
    email: "dob@buildings.nyc.gov",
    website: "https://www1.nyc.gov/site/buildings",
    latitude: 40.7128,
    longitude: -74.0060,
    hours: {
      monday: "8:30 AM - 4:30 PM",
      tuesday: "8:30 AM - 4:30 PM",
      wednesday: "8:30 AM - 4:30 PM",
      thursday: "8:30 AM - 4:30 PM",
      friday: "8:30 AM - 4:30 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits", "Solar Permits", "Roofing Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac", "solar", "roofing"]
  },

  // Florida
  {
    name: "Miami-Dade County Building Department",
    description: "Miami-Dade building permits and inspections",
    address: "11805 SW 26th St",
    city: "Miami",
    state: "FL",
    zipCode: "33175",
    phone: "(786) 315-2000",
    email: "building@miamidade.gov",
    website: "https://www.miamidade.gov",
    latitude: 25.7617,
    longitude: -80.1918,
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits", "Solar Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac", "solar"]
  },

  // Illinois
  {
    name: "Chicago Department of Buildings",
    description: "Chicago building permits and safety inspections",
    address: "121 N LaSalle St",
    city: "Chicago",
    state: "IL",
    zipCode: "60602",
    phone: "(312) 744-3449",
    email: "dob@cityofchicago.org",
    website: "https://www.chicago.gov",
    latitude: 41.8781,
    longitude: -87.6298,
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    servicesOffered: ["Building Permits", "Electrical Permits", "Plumbing Permits", "HVAC Permits", "Solar Permits"],
    permitTypes: ["building", "electrical", "plumbing", "hvac", "solar"]
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.application.deleteMany();
  await prisma.permitOffice.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Create permit offices
  for (const officeData of permitOffices) {
    const office = await prisma.permitOffice.create({
      data: officeData,
    });
    console.log(`✅ Created permit office: ${office.name}`);
  }

  // Create some sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '(555) 123-4567',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        phone: '(555) 987-6543',
      },
    }),
    prisma.user.create({
      data: {
        email: 'contractor@example.com',
        name: 'Mike Johnson',
        phone: '(555) 456-7890',
      },
    }),
  ]);

  console.log('✅ Created sample users');

  // Create some sample reviews
  const offices = await prisma.permitOffice.findMany();
  
  for (let i = 0; i < 10; i++) {
    const randomOffice = offices[Math.floor(Math.random() * offices.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    await prisma.review.create({
      data: {
        rating: Math.floor(Math.random() * 5) + 1,
        comment: [
          'Great service, very helpful staff!',
          'Quick processing time, would recommend.',
          'Staff was knowledgeable and friendly.',
          'Easy to work with, clear requirements.',
          'Professional and efficient service.',
          'Good communication throughout the process.',
          'Reasonable fees and fast turnaround.',
          'Helpful with questions and guidance.',
          'Well organized and easy to navigate.',
          'Excellent customer service.'
        ][Math.floor(Math.random() * 10)],
        userId: randomUser.id,
        permitOfficeId: randomOffice.id,
      },
    });
  }

  console.log('✅ Created sample reviews');

  // Create some sample applications
  for (let i = 0; i < 5; i++) {
    const randomOffice = offices[Math.floor(Math.random() * offices.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    await prisma.application.create({
      data: {
        type: ['building', 'electrical', 'solar', 'plumbing', 'hvac'][Math.floor(Math.random() * 5)],
        status: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED'][Math.floor(Math.random() * 4)],
        userId: randomUser.id,
        permitOfficeId: randomOffice.id,
        applicationData: {
          projectAddress: '123 Main St, Anytown, USA',
          projectDescription: 'Sample project description',
          estimatedValue: Math.floor(Math.random() * 100000) + 10000,
        },
      },
    });
  }

  console.log('✅ Created sample applications');

  console.log('🎉 Database seeded successfully!');
  console.log(`📊 Created ${permitOffices.length} permit offices`);
  console.log(`👥 Created ${users.length} users`);
  console.log('⭐ Created 10 reviews');
  console.log('📋 Created 5 applications');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });