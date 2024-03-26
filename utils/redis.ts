const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers"

export const fetchRedis = async (command: Command, ...args: (string | number)[]) => {
    const commandURL = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;
    const response = await fetch(commandURL, {
        headers: {
            Authorization: `Bearer ${upstashRedisRestToken}`
        },
        cache: "no-cache",
    });

    if (!response.ok) {
        throw new Error(`Ошибка при исполнении Redis-комманды; ${response.statusText}`)
    }

    const data = await response.json();
    return data.result

}