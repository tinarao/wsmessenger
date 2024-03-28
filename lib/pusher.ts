import PusherServer from "pusher"    // server-side
import PusherClient from "pusher-js" // client-side

// https://pusher.com/channels/
// https://habr.com/ru/sandbox/171066/

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: "eu",
    useTLS: true
})

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: "eu"
})