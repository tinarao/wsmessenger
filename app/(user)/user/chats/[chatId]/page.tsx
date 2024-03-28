import ChatInput from "@/app/(user)/_components/chat-input";
import MessagesList from "@/app/(user)/_components/messages-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/lib/auth";
import redis from "@/lib/db";
import { Message } from "@/lib/validations";
import { getChatMessages } from "@/utils/messages";
import { Send } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const ChatPage = async ({ params }: { params: { chatId: string } }) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    redirect("/login");
  }

  const [user1, user2] = chatId.split("-to-");

  if (session.user.id !== user1 && session.user.id !== user2) {
    redirect("/user/chats");
  }

  const chatCompanionID = session.user.id === user1 ? user2 : user1;
  const chatCompanion = (await redis.get(`user:${chatCompanionID}`)) as User;
  const initMessages = await getChatMessages(chatId);

  return (
    <section className="max-h-screen flex flex-1 h-screen flex-col justify-between">
      <div className="px-8 py-4 border-b-2 h-20">
        <div className="w-fit flex gap-4">
          <div className="">
            <div className="relative">
              <div className="size-12">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  src={chatCompanion.image}
                  alt={`Аватарка ${chatCompanion.name}`}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-neutral-700 mr-3 font-semibold">
                {chatCompanion.name}
              </span>
            </div>
            <span className="text-sm text-neutral-500 font-medium">
              {chatCompanion.email}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
          <MessagesList
            chatId={chatId}
            session={session}
            chatCompanion={chatCompanion}
            initMessages={initMessages as Message[]}
          />
        </div>
        <div className="h-20">
        <ChatInput chatId={chatId} />
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
