import { fetchRedis } from "./redis"

export const getFriendsByUserID = async (userID: string) => {
    const friendsIDs = await fetchRedis("smembers", `user:${userID}:friends`) as string[];
    // Promise.all 
    const friends = await Promise.all(
        friendsIDs.map(async (friendID) => {
            const friend = await fetchRedis("get", `user:${friendID}`) as string;
            return JSON.parse(friend) as User
        })
    )

    return friends
}