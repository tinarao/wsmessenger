interface User {
    id: string
    name: string
    email: string
    image: string // url to img
}

interface Chat {
    id: string
    messages: Message[]
}

interface Message {
    id: string
    senderId: string
    recieverId?: string
    text: string
    createdAt: number 
}

interface FriendRequest {
    id: string
    senderId: string
    recieverId: string
}