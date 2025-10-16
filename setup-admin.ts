import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@neofest.com',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        isHostApproved: false // Admins don't need host approval
      }
    });

    console.log('Admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Name:', adminUser.name);
    console.log('Role:', adminUser.role);
    console.log('');
    console.log('You can now sign in with this email to access the admin panel at /admin');
    console.log('Note: The current auth system accepts any password for demo purposes.');

  } catch (error) {
    console.error('Error setting up admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();