import { z } from 'zod'

// ── Auth ──

export const signupRequestSchema = z.object({
    email: z.email('Invalid email'),
    name: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const loginRequestSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
})

export const authResponseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string().nullable(),
    }),
})

// ── Generate ──

export const generateRequestSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required'),
    size: z.string().optional(),
    models: z.array(z.string()).optional(),
})

// No response schema — generate uses SSE streaming

// ── Chats ──

export const createChatRequestSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    model: z.string().min(1, 'Model is required'),
    imageUrl: z.url('Invalid image URL'),
})

export const createChatResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    model: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    messages: z.array(z.object({
        id: z.string(),
        role: z.string(),
        content: z.string(),
        imageUrl: z.string().nullable(),
        createdAt: z.date(),
    })),
})

export const chatListResponseSchema = z.array(z.object({
    id: z.string(),
    title: z.string(),
    model: z.string(),
    createdAt: z.date(),
    thumbnail: z.string().nullable(),
}))

export const chatDetailResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    model: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    messages: z.array(z.object({
        id: z.string(),
        role: z.string(),
        content: z.string(),
        imageUrl: z.string().nullable(),
        createdAt: z.date(),
    })),
})

// ── Messages ──

export const sendMessageRequestSchema = z.object({
    content: z.string().min(1, 'Message content is required'),
    model: z.string().optional(),
    size: z.string().optional(),
})

export const sendMessageResponseSchema = z.object({
    id: z.string(),
    chatId: z.string(),
    role: z.string(),
    content: z.string(),
    imageUrl: z.string().nullable(),
    createdAt: z.date(),
})

// ── Inferred types ──

export type SignupRequest = z.infer<typeof signupRequestSchema>
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>

export type GenerateRequest = z.infer<typeof generateRequestSchema>

export type CreateChatRequest = z.infer<typeof createChatRequestSchema>
export type CreateChatResponse = z.infer<typeof createChatResponseSchema>
export type ChatListResponse = z.infer<typeof chatListResponseSchema>
export type ChatDetailResponse = z.infer<typeof chatDetailResponseSchema>

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>
export type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>
