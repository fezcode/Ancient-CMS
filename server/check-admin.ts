import { prisma } from './src/db';

async function check() {
  console.log('Checking for users...');
  const users = await prisma.user.findMany();
  console.log('Found users:', users);
  
  if (users.length === 0) {
    console.log('No users found. Seeding did not run.');
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
