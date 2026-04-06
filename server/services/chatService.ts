import { AppError } from "../errors";
import ChatRepository from "../repositories/chatRepository";
import {
    CreateChatRequest,
    CreateChatResponse,
    ChatListResponse,
    ChatDetailResponse,
    SendMessageRequest,
    SendMessageResponse,
} from "../schemas";
import { generateImage, type ChatMessage } from './openrouter';
import { imageUrlToBase64, uploadImage } from "./storage";

class ChatService {
    constructor(private chatRepository: ChatRepository = new ChatRepository()) {}

    async create(userId: string, data: CreateChatRequest): Promise<CreateChatResponse> {
        return this.chatRepository.createChat({
            title: data.title,
            model: data.model,
            user: { connect: { id: userId } },
            messages: {
                create: [
                    { role: 'user', content: data.title },
                    { role: 'assistant', content: '', imageUrl: data.imageUrl },
                ],
            },
        });
    }

    async getAllForUser(userId: string): Promise<ChatListResponse> {
        const chats = await this.chatRepository.getAllChats(userId);
        return chats.map(({ messages, ...chat }) => ({
            ...chat,
            thumbnail: messages[0]?.imageUrl ?? null,
        }));
    }

    async getById(chatId: string, userId: string): Promise<ChatDetailResponse> {
        const chat = await this.chatRepository.getSingleChat(chatId);
        if (!chat) throw new AppError('Chat not found', 404);
        if (chat.userId !== userId) throw new AppError('Forbidden', 403);
        return chat;
    }

    async delete(chatId: string, userId: string): Promise<void> {
        const chat = await this.chatRepository.getSingleChat(chatId);
        if (!chat) throw new AppError('Chat not found', 404);
        if (chat.userId !== userId) throw new AppError('Forbidden', 403);
        await this.chatRepository.deleteChat(chatId);
    }

    async sendMessage(chatId: string, userId: string, data: SendMessageRequest): Promise<SendMessageResponse> {
        const chat = await this.chatRepository.getSingleChat(chatId)
    
        if (!chat) throw new AppError('Chat not found', 404);
        if (chat.userId !== userId) throw new AppError('Forbidden', 403)
        
        const lastImage = [...chat.messages].reverse().find((m) => m.imageUrl);
        const messages: ChatMessage[] = [];

        if (lastImage?.imageUrl) {
            const base64Url = await imageUrlToBase64(lastImage.imageUrl);
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: 'Here is the image I want you to modify:' },
                    { type: 'image_url', image_url: { url: base64Url } },
                ],
            });
        }

        messages.push({ role: 'user', content: data.content });

        // Generate new image with full history
        const result = await generateImage(data.content, data.size || '1:1', data.model || chat.model, messages);
        const images = result.choices?.[0]?.message?.images;
        if (!images || images.length === 0) {
            throw new AppError('Model did not return an image. Try a different prompt.');
        }
 
        const base64Url = images[0].image_url.url;
        const filename = `${Date.now()}.png`;
        const s3ImageUrl = await uploadImage(base64Url, filename);

        // First: save the user's prompt
        await this.chatRepository.createMessage({
            chat: { connect: { id: chatId } },
            role: 'user',
            content: data.content,
        });

        // Second: save the assistant's generated image
        const assistantMessage = await this.chatRepository.createMessage({
            chat: { connect: { id: chatId } },
            role: 'assistant',
            content: '',
            imageUrl: s3ImageUrl,
        });
        
        return assistantMessage
    }
}

export default ChatService