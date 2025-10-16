import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupHost() {
  try {
    console.log('=== Host User Setup ===\n');

    const email = await question('Enter host email: ');
    const name = await question('Enter host name: ');

    if (!email || !name) {
      console.log('Email and name are required!');
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Update existing user to host
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: 'HOST',
          isHostApproved: true,
          isActive: true
        }
      });

      console.log('\n✅ User updated to HOST role successfully:');
      console.log('Email:', updatedUser.email);
      console.log('Name:', updatedUser.name);
      console.log('Role:', updatedUser.role);
      console.log('Host Approved:', updatedUser.isHostApproved);
    } else {
      // Create new host user
      const hostUser = await prisma.user.create({
        data: {
          email,
          name,
          role: 'HOST',
          isActive: true,
          isHostApproved: true
        }
      });

      console.log('\n✅ Host user created successfully:');
      console.log('Email:', hostUser.email);
      console.log('Name:', hostUser.name);
      console.log('Role:', hostUser.role);
      console.log('Host Approved:', hostUser.isHostApproved);
    }

    console.log('\nThe user can now:');
    console.log('- Create and manage hackathons');
    console.log('- View hackathon participants');
    console.log('- Update hackathon details');
    console.log('- Delete hackathons they created');

  } catch (error) {
    console.error('❌ Error setting up host user:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

setupHost();
