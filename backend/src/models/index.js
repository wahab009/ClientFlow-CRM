import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Export Prisma models for easy access throughout the application
export const models = {
  user: prisma.user,
  client: prisma.client,
  task: prisma.task
}

export default prisma
