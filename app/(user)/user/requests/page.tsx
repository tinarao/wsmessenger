import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import React from "react";
import { FriendRequestList } from "../../_components/friend-requests";

const ReqPage = async () => {
  const session = await getServerSession(authOptions);
  const incomingSenderIDs = (await fetchRedis(
    "smembers",
    `user:${session!.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequest = await Promise.all(
    incomingSenderIDs.map(async (senderID) => {
      const senderStr = await fetchRedis("get", `user:${senderID}`) as string;
      const sender = JSON.parse(senderStr);
      return { senderID, senderEmail: sender.email };
    })
  )

  return (
    <section className="pt-8 px-8">
      <div>
        <FriendRequestList sessionId={session!.user.id} incomingRequests={incomingFriendRequest as FriendRequest[]} />
      </div>
    </section>
  );
};

export default ReqPage;
