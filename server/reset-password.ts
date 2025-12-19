import bcrypt from 'bcryptjs';
import { prisma } from './src/db';

async function reset() {
  const email = 'admin@ancient.com';
  const newPassword = 'admin123';
  
  console.log(`[RESET] Looking for user: ${email}`);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`[RESET] User ${email} not found!`);
    return;
  }

  console.log('[RESET] Hashing new password...');
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  console.log('[RESET] Updating database...');
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`[RESET] SUCCESS! Password for ${email} has been reset to: ${newPassword}`);
}

reset()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
