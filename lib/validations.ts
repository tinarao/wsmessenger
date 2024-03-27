import { z } from "zod"

export const addFriendValidator = z.object({
    email: z.string().email(),
})

export const messageValidator = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string(),
    createdAt: z.number()
})

export const messageArrayValidator = z.object({
    messages: z.array(messageValidator)
})

export type Message = z.infer<typeof messageValidator>