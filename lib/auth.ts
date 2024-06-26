import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"
import redis from "./db";
import GoogleProvider from "next-auth/providers/google"
import { fetchRedis } from "@/utils/redis";

const loadCreds = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error("Google ClientID is undefined or empty string")
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Google ClientSecret is undefined or empty string")
    }

    return { clientId, clientSecret }

}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(redis),
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.JWT_SECRET,
    providers: [
        GoogleProvider({
            clientId: loadCreds().clientId,
            clientSecret: loadCreds().clientSecret,
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            const candidateRes = await fetchRedis("get", `user:${token.id}`) as string | null

            if (!candidateRes) {
                token.id = user!.id
                return token
            } else {

                const candidate = JSON.parse(candidateRes) as User

                return {
                    id: candidate.id,
                    name: candidate.name,
                    email: candidate.email,
                    image: candidate.image
                }
            }

        },
        async session({ session, token }) {
            if (token) {
                session.user!.id = token.id;
                session.user!.name = token.name;
                session.user!.email = token.email;
                session.user!.image = token.image as string
            }

            return session
        },
        redirect() {
            return "/user"
        }
    }
}