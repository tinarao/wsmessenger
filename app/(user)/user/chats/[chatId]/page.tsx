import { authOptions } from "@/lib/auth";
import redis from "@/lib/db";
import { getChatMessages } from "@/utils/messages";
import { getServerSession } from "next-auth";
import {  redirect } from "next/navigation";
import React from "react";

const ChatPage = async ({ params }: { params: { chatId: string } }) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    redirect("/login")
  }

  const [user1, user2] = chatId.split("-to-");

  // return (
  //   <div>
  //     <h1>{user1}</h1>
  //     <h1>{user2}</h1>
  //   </div>
  // )

  // TODO: DEBUG THIS
  if (session.user.id !== user1 && session.user.id !== user2 ) {
    redirect("/user/chats")
  }

  
  const chatCompanionID = session.user.id === user1 ? user2 : user1;
  const chatCompanion = await redis.get(`user:${chatCompanionID}`) as User
  const initMessages = await getChatMessages(chatId)

  return (
    <section className="pt-8 px-8 h-full">
        <div>

        </div>  
    </section>
  );
};

export default ChatPage;
