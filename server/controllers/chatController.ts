import ChatService from "../services/chatService";
import {
    CreateChatRequest,
    CreateChatResponse,
    ChatListResponse,
    ChatDetailResponse,
    SendMessageRequest,
    SendMessageResponse,
} from "../schemas";

class ChatController {
    constructor(private chatService: ChatService = new ChatService()) {}

    async create(userId: string, data: CreateChatRequest): Promise<CreateChatResponse> {
        return this.chatService.create(userId, data);
    }

    async getAll(userId: string): Promise<ChatListResponse> {
        return this.chatService.getAllForUser(userId);
    }

    async getById(chatId: string, userId: string): Promise<ChatDetailResponse> {
        return this.chatService.getById(chatId, userId);
    }

    async sendMessage(chatId: string, userId: string, data: SendMessageRequest): Promise<SendMessageResponse> {
        return this.chatService.sendMessage(chatId, userId, data);
    }

    async delete(chatId: string, userId: string): Promise<void> {
        return this.chatService.delete(chatId, userId);
    }
}

export default ChatController;
