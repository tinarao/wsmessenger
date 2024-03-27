import { authOptions } from "@/lib/auth";
import redis from "@/lib/db";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { id: idToAdd } = z.object({ id: z.string() }).parse(body)
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Пользователь не авторизован", { status: 401 });
        }

        const isAlreadyFriends = await fetchRedis("sismember", `user:${session.user.id}:friends`, idToAdd);
        if (isAlreadyFriends) {
            // TODO: Поменять текст ответа
            return new Response("Пользователи уже добавили друг друга в друзья", { status: 400 });
        }

        const isFriendRequestExists = await fetchRedis("sismember", `user:${session.user.id}:incoming_friend_requests`, idToAdd);
        if (!isFriendRequestExists) {
            return new Response("Запрос не существует", { status: 400 })
        }

        await redis.sadd(`user:${session.user.id}:friends`, idToAdd);
        await redis.sadd(`user:${idToAdd}:friends`, session.user.id);
        await redis.srem(`user:${idToAdd}:friends:incoming_friend_requests`, session.user.id);
        await redis.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

        return new Response("Запрос в друзья принят!")

    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return new Response("Некорректные данные", { status: 422 })
        }

        return new Response("Некорректный запрос", { status: 400 })
    }
}