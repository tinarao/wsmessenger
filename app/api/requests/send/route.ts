import { authOptions } from "@/lib/auth";
import redis from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { addFriendValidator } from "@/lib/validations";
import { toPusherKey } from "@/utils/messages";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const { email: emailToAdd } = addFriendValidator.parse(body.email);

        // const upstashRestResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`, {
        //     headers: {
        //         Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        //     },
        //     cache: "no-cache",
        // });

        const idToAdd = await fetchRedis("get", `user:email:${emailToAdd}`) as string

        // const data = await upstashRestResponse.json() as { result: string | null };
        // const idToAdd = data.result;
        const session = await getServerSession(authOptions);

        // start validation

        if (!session) {
            return new Response("Unauthorized", { status: 401 })
        }

        if (!idToAdd) {
            return new Response("Человек не зарегистрирован!", { status: 400 })
        }

        if (idToAdd === session.user!.id) {
            return new Response("Вы не можете добавить в контакты себя", { status: 400 })
        }

        const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) as 0 | 1;
        if (isAlreadyAdded) {
            return new Response("Пользователь уже добавлен", { status: 400 })
        }

        const isAlreadyFriends = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd) as 0 | 1;
        if (isAlreadyFriends) {
            return new Response("Пользователь уже добавлен", { status: 400 })
        }

        // end validation

        // ws job

        pusherServer.trigger(
            toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
            "incoming_friend_requests", {
            senderId: session.user.id,
            senderEmail: session.user.email
        }),


        // ws job end

        redis.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
        return new Response("Запрос отправлен!", { status: 200 })


    } catch (error) {

        console.error(error);

        if (error instanceof z.ZodError) {
            return new Response("Неверные данные", { status: 422 })
        }

        return new Response("Некорректный запрос", { status: 400 })
    }
}