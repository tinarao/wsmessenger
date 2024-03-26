import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import React from "react";

const ReqPage = async () => {
  const session = await getServerSession(authOptions);
  const incomingSenderIDs = await fetchRedis(
    "smembers",
    `user:${session!.user.id}:incoming_friend_request`
  );

  return <section>{session!.user.email}</section>;
};

export default ReqPage;
