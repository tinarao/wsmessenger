import { authOptions } from "@/lib/auth";
import redis from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Пользователь не авторизован", { status: 401 })
        }

        const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

        await redis.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

        return new Response("Запрос в друзья отклонён")

    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return new Response("Некорректные данные", { status: 422 })
        }

        return new Response("Некорректный запрос", { status: 400 })
    }
}