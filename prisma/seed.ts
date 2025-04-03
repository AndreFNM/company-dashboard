import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@empresa.com',
      password,
      role: 'ADMIN',
      position: "Administrator"
    },
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())