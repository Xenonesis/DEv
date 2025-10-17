import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearSeedUsers() {
  console.log('🗑️  Removing seed users...');

  const seedEmails = [
    'alex.chen@neofest.com',
    'sarah.kim@neofest.com',
    'mike.johnson@neofest.com',
    'emma.wilson@neofest.com',
  ];

  try {
    const result = await prisma.user.deleteMany({
      where: {
        email: {
          in: seedEmails,
        },
      },
    });

    console.log(`✅ Deleted ${result.count} seed users`);
    console.log('Leaderboard will now only show real users');
  } catch (error) {
    console.error('❌ Error deleting seed users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearSeedUsers();
