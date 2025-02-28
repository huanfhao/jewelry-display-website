import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'SYJewelryDisplay@outlook.com' },
    update: {},
    create: {
      email: 'SYJewelryDisplay@outlook.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  console.log('Admin user created:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 