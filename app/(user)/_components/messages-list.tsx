"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/lib/validations";
import { Session } from "next-auth";
import React, { useEffect, useRef, useState } from "react";

import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/utils/messages";

interface MLProps {
  initMessages: Message[]
  session: Session
  chatCompanion: User
  chatId: string
}

const MessagesList = ({ initMessages, session, chatCompanion, chatId }: MLProps) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initMessages);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatId}`)
    )

    const messageHandler = (message: Message) => {
      setMessages(prev => [message, ...prev])
    }
    
    pusherClient.bind("incoming_message", messageHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatId}`)
      );
      pusherClient.unbind("incoming_message", messageHandler)
    }
  }, [chatId])

  return (
    <div className="flex flex-col-reverse gap-2 p-3 overflow-y-auto">
      <div ref={scrollDownRef} />
      {messages.map((msg, index) => {
        const isCurrentUser = msg.senderId === session.user.id;
        const isNextMessageExists =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div key={`${msg.id}-${msg.createdAt}`} className="px-4 md:px-12">
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-neutral-700 text-white": isCurrentUser,
                    "bg-white text-neutral-700 border": !isCurrentUser,
                    "rounded-br-none": !isNextMessageExists && isCurrentUser,
                    "rounded-bl-none": !isNextMessageExists && !isCurrentUser,
                  })}
                >
                  {msg.text}{" "}
                  <span className="ml-2 text-xs text-neutral-400">
                    {formatTimestamp(msg.createdAt)}
                  </span>
                </span>
              </div>
              <div className={cn("relative size-6", {
                "order-2": isCurrentUser,
                "order-1": !isCurrentUser,
                "invisible": isNextMessageExists
              })}>
                <Image 
                  fill 
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                  alt={`Аватарка ${isCurrentUser ? session.user.image as string : chatCompanion.image as string}`}
                  src={isCurrentUser ? session.user.image as string : chatCompanion.image as string} 
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
