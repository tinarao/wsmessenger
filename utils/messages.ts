import { redirect } from "next/navigation"
import { fetchRedis } from "./redis"
import { messageArrayValidator } from "@/lib/validations";

export const getChatMessages = async (chatId: string) => {
    try {
        const results: string[] = await fetchRedis("zrange", `chat:${chatId}:messages`, 0, -1);
        const dbMessages = results.map(msg => JSON.parse(msg));
        const reversedDbMessages = dbMessages.reverse();
        // const messages = messageArrayValidator.parse(reversedDbMessages)
        // console.log(reversedDbMessages)

        return reversedDbMessages;

    } catch (error) {
        console.error(error)
    }
}

export const getChatLink = (id1: string, id2: string) => {
    const sortedIDs = [id1, id2].sort();
    return `${sortedIDs[0]}-to-${sortedIDs[1]}`
}