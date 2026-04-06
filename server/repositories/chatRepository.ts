import { Prisma, PrismaClient, Message } from "@/app/generated/prisma/client";
import prisma from "../db";

class ChatRepository {
    constructor(private db: PrismaClient = prisma) {}

    async createChat(data: Prisma.ChatCreateInput) {
        return await this.db.chat.create({ data , include: { messages: true } })
    }

    async getAllChats(userId: string) {
        const chats = await this.db.chat.findMany({ 
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                messages: {
                    where: { role: 'assistant', imageUrl: { not: null } },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { imageUrl: true },
                },
            },
        })

        return chats
    }

    async getSingleChat(chatId: string) {
        const chat = await this.db.chat.findUnique({
            where: { id: chatId },
            include: { messages: {orderBy: { createdAt: 'asc' } } }
        })

        if (!chat) return null

        return chat
    }

    async createMessage(data: Prisma.MessageCreateInput) : Promise<Message> {
        return this.db.message.create({ data });
    }
    
    async deleteChat(chatId: string) {
        return this.db.chat.delete({ where: { id: chatId } });
    }
}

export default ChatRepository