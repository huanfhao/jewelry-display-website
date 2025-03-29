import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 创建带有重试逻辑的 Prisma 客户端
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  }).$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const maxRetries = 3
        let retries = 0
        
        while (retries < maxRetries) {
          try {
            return await query(args)
          } catch (error) {
            retries++
            if (retries === maxRetries) throw error
            
            // 指数退避重试
            const delay = Math.min(1000 * Math.pow(2, retries), 10000)
            console.warn(`Database operation failed, retrying in ${delay}ms...`, {
              operation,
              model,
              error,
              retry: retries,
            })
            
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }
    }
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma