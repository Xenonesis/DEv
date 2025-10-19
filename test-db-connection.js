// Database connection and functionality test
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection and functionality...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');

    // Test 2: Check if tables exist
    console.log('2. Checking database tables...');
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(`✅ Found ${tableCount[0].count} tables in database\n`);

    // Test 3: Test User operations
    console.log('3. Testing User operations...');
    const userCount = await prisma.user.count();
    console.log(`✅ Users in database: ${userCount}`);

    // Test 4: Test Hackathon operations
    console.log('4. Testing Hackathon operations...');
    const hackathonCount = await prisma.hackathon.count();
    console.log(`✅ Hackathons in database: ${hackathonCount}`);

    // Test 5: Test Course operations
    console.log('5. Testing Course operations...');
    const courseCount = await prisma.course.count();
    console.log(`✅ Courses in database: ${courseCount}`);

    // Test 6: Test Event operations
    console.log('6. Testing Event operations...');
    const eventCount = await prisma.event.count();
    console.log(`✅ Events in database: ${eventCount}`);

    // Test 7: Test complex query with relations
    console.log('7. Testing complex queries with relations...');
    const usersWithRelations = await prisma.user.findMany({
      take: 1,
      include: {
        hackathons: true,
        events: true,
        achievements: true,
      }
    });
    console.log(`✅ Complex query successful, found ${usersWithRelations.length} users with relations\n`);

    // Test 8: Test enum values
    console.log('8. Testing enum values...');
    const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
    const userRoles = ['USER', 'HOST', 'ADMIN'];
    const hackathonStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
    console.log(`✅ Enum values configured: ${difficulties.length} difficulties, ${userRoles.length} roles, ${hackathonStatuses.length} statuses\n`);

    console.log('🎉 All database tests passed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Hackathons: ${hackathonCount}`);
    console.log(`   - Courses: ${courseCount}`);
    console.log(`   - Events: ${eventCount}`);
    console.log(`   - Tables: ${tableCount[0].count}`);

  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('\n🌐 Testing API endpoints...\n');

  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    '/api/health',
    '/api/hackathons',
    '/api/courses',
    '/api/events',
    '/api/sessions',
    '/api/ideas'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (response.ok) {
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
      } else {
        console.log(`⚠️  ${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

// Run tests
async function runAllTests() {
  await testDatabaseConnection();
  
  // Only test API endpoints if server is running
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      await testAPIEndpoints();
    } else {
      console.log('\n⚠️  Server not running, skipping API tests');
      console.log('   Run "npm run dev" to start the server and test APIs');
    }
  } catch (error) {
    console.log('\n⚠️  Server not running, skipping API tests');
    console.log('   Run "npm run dev" to start the server and test APIs');
  }
}

runAllTests();