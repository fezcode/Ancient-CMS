import bcrypt from 'bcryptjs';
import { prisma } from '../db';

export const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.warn('[seed] ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Skipping admin seed.');
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      console.log(`[seed] Creating initial admin user: ${email}`);
      const hashedPassword = await bcrypt.hash(password, 12);
      
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'ADMIN',
        },
      });
      console.log('[seed] Admin user created successfully.');
    } else {
      console.log('[seed] Admin user already exists.');
    }
  } catch (error) {
    console.error('[seed] Failed to seed admin user:', error);
  }
};
