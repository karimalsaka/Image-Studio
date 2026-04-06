import { request } from "./client";
import type { Chat, Message } from "@/app/shared/types";

export async function createChat(title: string, model: string, imageUrl: string): Promise<Chat> {
    return request<Chat>('/chats', {
        method: 'POST',
        body: JSON.stringify({ title, model, imageUrl }),
    });
}

export async function getChats(): Promise<Chat[]> {
    return request<Chat[]>('/chats');
}

export async function getChat(id: string): Promise<Chat> {
    return request<Chat>(`/chats/${encodeURIComponent(id)}`);
}

export async function deleteChat(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/chats/${encodeURIComponent(id)}`, {
        method: 'DELETE',
    });
}

export async function sendMessage(chatId: string, content: string, model?: string, size?: string): Promise<Message> {
    return request<Message>(`/chats/${encodeURIComponent(chatId)}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content, model, size }),
    });
}
