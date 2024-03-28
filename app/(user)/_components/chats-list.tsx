"use client";

import { Button } from "@/components/ui/button";
import { getChatLink, toPusherKey } from "@/utils/messages";
import { User } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NotificationBubble from "./notification-bubble";
import { pusherClient } from "@/lib/pusher";
import { toast } from "sonner";
import NewMessageToast from "./new-msg-toast";

interface CLSProps {
  session: Session;
  friends: User[];
}

interface MessageExtd extends Message {
  senderImage: string
  senderName: string
}

const ChatsListSidebar = ({ session, friends }: CLSProps) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const pathname = usePathname();
  const router = useRouter()

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`));

    const newMessageHandler = (message: MessageExtd) => {
      const chatLink = getChatLink(session.user.id, message.senderId)
      const isOnChatPage = pathname === `/user/chat/${chatLink}`

      if (isOnChatPage) return;

      toast(<NewMessageToast message={message.text} senderImage={message.senderImage} senderName={message.senderName} />)
    }

    const newFriendHandler = () => {
      router.refresh();
      toast.info("Новая заявка в друзья!")
    }

    pusherClient.bind("new_message", newMessageHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:friends`));
    }
  }, [session.user.id])

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((p) => {
        return p.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul className="mt-2 max-h-[25rem] overflow-y-auto space-y-1">
      {friends.length === 0 ? (
        <span className="text-md font-semibold text-gray-800">
          Здесь пусто 😔
        </span>
      ) : (
        friends.sort().map((friend) => {
          const unseenMessagesCount = unseenMessages.filter((msg) => {
            return msg.senderId === friend.id;
          }).length;

          const href = getChatLink(session.user.id, friend.id);

          return (
            <li key={friend.id}>
              <Button asChild className="w-full border" variant="menu">
                <a href={`/user/chats/${href}`}>
                  <Image
                    width={30}
                    height={30}
                    src={friend.image}
                    alt={friend.name}
                    className="size-4 mr-2 rounded-full"
                  />{" "}
                  {friend.name.split(" ")[0]}
                  {unseenMessages.length !== 0 && (
                    <NotificationBubble number={unseenMessages.length} />
                  )}
                </a>
              </Button>
            </li>
          );
        })
      )}
    </ul>
  );
};

export default ChatsListSidebar;
