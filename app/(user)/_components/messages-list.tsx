"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/lib/validations";
import { Session } from "next-auth";
import React, { useRef, useState } from "react";

import { format } from "date-fns";
import Image from "next/image";

interface MLProps {
  initMessages: Message[]
  session: Session
  chatCompanion: User
}

const MessagesList = ({ initMessages, session, chatCompanion }: MLProps) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initMessages);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  return (
    <div className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto">
      <div ref={scrollDownRef} />
      {messages.map((msg, index) => {
        const isCurrentUser = msg.senderId === session.user.id;
        const isNextMessageExists =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div key={`${msg.id}-${msg.createdAt}`} className="">
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
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
