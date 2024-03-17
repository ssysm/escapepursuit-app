import { PrismaClient,Role } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export default function getEdgePrisma(env) {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: env['DATABASE_URL']
            }
        }
    }).$extends(withAccelerate());
    return prisma;
}