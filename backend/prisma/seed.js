import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

if (process.env.NODE_ENV === 'production') {
  console.error('Seed script is disabled in production.')
  process.exit(1)
}

const prisma = new PrismaClient()

async function main() {
  await prisma.task.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  const user = await prisma.user.create({
    data: {
      name: 'Normal User',
      email: 'user@test.com',
      password: userPassword,
      role: 'USER'
    }
  })

  const client1 = await prisma.client.create({
    data: {
      name: 'Client One',
      email: 'client1@test.com',
      company: 'Company A',
      status: 'active',
      assignedTo: admin.id
    }
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'Client Two',
      email: 'client2@test.com',
      company: 'Company B',
      status: 'active',
      assignedTo: user.id
    }
  })

  await prisma.task.createMany({
    data: [
      {
        title: 'Task 1',
        clientId: client1.id,
        userId: admin.id,
        status: 'pending',
        priority: 'medium'
      },
      {
        title: 'Task 2',
        clientId: client2.id,
        userId: user.id,
        status: 'completed',
        priority: 'high'
      }
    ]
  })

  console.log('Seed completed')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
