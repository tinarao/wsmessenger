"use client";

import { Button } from "@/components/ui/button";
import { getChatLink } from "@/utils/messages";
import { User } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NotificationBubble from "./notification-bubble";

interface CLSProps {
  session: Session;
  friends: User[];
}

const ChatsListSidebar = ({ session, friends }: CLSProps) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const router = useRouter();
  const pathname = usePathname();

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
                  {friend.name}
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
