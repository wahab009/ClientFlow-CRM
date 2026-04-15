import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/auth.js'

const prisma = new PrismaClient()

async function main() {
  // Delete existing data
  await prisma.task.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@clientflow.com',
      password: await hashPassword('admin123'),
      role: 'ADMIN'
    }
  })

  console.log('✅ Created admin user:', admin.email)

  // Create regular users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Sales',
      email: 'john.sales@clientflow.com',
      password: await hashPassword('password123'),
      role: 'USER'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Sarah Manager',
      email: 'sarah.manager@clientflow.com',
      password: await hashPassword('password123'),
      role: 'USER'
    }
  })

  console.log('✅ Created user1:', user1.email)
  console.log('✅ Created user2:', user2.email)

  // Create clients for user1
  const client1 = await prisma.client.create({
    data: {
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0123',
      company: 'Acme Corp',
      status: 'active',
      assignedTo: user1.id
    }
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'TechStart Inc',
      email: 'info@techstart.com',
      phone: '+1-555-0456',
      company: 'TechStart',
      status: 'active',
      assignedTo: user1.id
    }
  })

  console.log('✅ Created client1:', client1.name)
  console.log('✅ Created client2:', client2.name)

  // Create clients for user2
  const client3 = await prisma.client.create({
    data: {
      name: 'Global Solutions',
      email: 'hello@global.com',
      phone: '+1-555-0789',
      company: 'Global',
      status: 'active',
      assignedTo: user2.id
    }
  })

  console.log('✅ Created client3:', client3.name)

  // Create tasks for user1
  const task1 = await prisma.task.create({
    data: {
      title: 'Initial consultation call',
      description: 'Discuss project requirements with Acme leadership',
      status: 'completed',
      priority: 'high',
      userId: user1.id,
      clientId: client1.id
    }
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Prepare proposal',
      description: 'Create detailed proposal for Acme project',
      status: 'in-progress',
      priority: 'high',
      userId: user1.id,
      clientId: client1.id
    }
  })

  const task3 = await prisma.task.create({
    data: {
      title: 'Follow up with TechStart',
      description: 'Send proposal and schedule review',
      status: 'pending',
      priority: 'medium',
      userId: user1.id,
      clientId: client2.id
    }
  })

  // Create unassigned task for user1
  const task4 = await prisma.task.create({
    data: {
      title: 'Update CRM records',
      description: 'Review and update all client information',
      status: 'pending',
      priority: 'low',
      userId: user1.id
    }
  })

  console.log('✅ Created tasks for user1')

  // Create tasks for user2
  const task5 = await prisma.task.create({
    data: {
      title: 'Onboarding meeting',
      description: 'Schedule and prepare for Global Solutions onboarding',
      status: 'pending',
      priority: 'high',
      userId: user2.id,
      clientId: client3.id
    }
  })

  console.log('✅ Created tasks for user2')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
