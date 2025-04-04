import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);  

  await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@empresa.com',
      password,
      role: 'ADMIN', 
      position: "Administrator",
    },
  });

  await prisma.user.upsert({
    where: { email: 'user1@empresa.com' },
    update: {},
    create: {
      name: 'User One',
      email: 'user1@empresa.com',
      password: await bcrypt.hash('user123', 10),  
      role: 'USER',  
      position: "Employee",
    },
  });

  await prisma.user.upsert({
    where: { email: 'user2@empresa.com' },
    update: {},
    create: {
      name: 'User Two',
      email: 'user2@empresa.com',
      password: await bcrypt.hash('user123', 10), 
      role: 'USER',  
      position: "Employee",
    },
  });

  await prisma.user.upsert({
    where: { email: 'user3@empresa.com' },
    update: {},
    create: {
      name: 'User Three',
      email: 'user3@empresa.com',
      password: await bcrypt.hash('user123', 10), 
      role: 'USER',  
      position: "Employee",
    },
  });

  console.log('Database seeded with users');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
