import prisma from '../db';
import { PrismaClient, User, Prisma } from '@/app/generated/prisma/client';

class UserRepository {
    constructor(private db: PrismaClient = prisma) {}

    async findByEmail(email: string): Promise<User | null> {
        return await this.db.user.findUnique({
            where: { email }
        })
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.db.user.create({ data })
    }
}

export default UserRepository