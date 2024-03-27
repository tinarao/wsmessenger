import { authOptions } from "@/lib/auth"
import redis from "@/lib/db";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth"
import { nanoid } from "nanoid"
import { messageValidator } from "@/lib/validations";
import { z } from "zod";

export const POST = async (req: Request) => {
    try {
        const { text, chatId }: { text: string, chatId: string } = await req.json();
        const session = await getServerSession(authOptions);
        if (!session) return new Response("Пользователь не авторизован", { status: 401 })

        const [firstUserID, secondUserID] = chatId.split("-to-");

        if (firstUserID !== session.user.id && secondUserID !== session.user.id) {
            return new Response("Пользователь не авторизован", { status: 401 })
        }

        const friendID = session.user.id === firstUserID ? secondUserID : firstUserID;
        const friendList = await fetchRedis("smembers", `user:${session.user.id}:friends`) as string[]
        const isFriend = friendList.includes(friendID)
        if (!isFriend) return new Response("Пользователь не авторизован", { status: 401 })

        const senderStr = await fetchRedis("get", `user:${session.user.id}`) as string
        const sender = JSON.parse(senderStr)

        const timestamp = Date.now()
        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text: text,
            createdAt: timestamp
        }
        const message = messageValidator.parse(messageData);

        await redis.zadd(`chat:${chatId}:messages`, { score: timestamp, member: JSON.stringify(message) })
        return new Response("Сообщение отправлено!")
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Некорректные данные", { status: 422 })
        }
        return new Response("Непредвиденная ошибка", { status: 500 })
    }
}