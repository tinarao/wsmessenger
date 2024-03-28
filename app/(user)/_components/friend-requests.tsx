"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Check, LoaderCircleIcon, UserCircle2Icon, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import NotificationBubble from "./notification-bubble";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/utils/messages";

interface FPProps {
  children: React.ReactNode;
  sessionId: string;
  initUnseenReqCount: number;
}

interface FRLProps {
  incomingRequests: FriendRequest[];
  sessionId: string;
}

export const FriendRequestsButton = ({
  children,
  sessionId,
  initUnseenReqCount,
}: FPProps) => {
  const [unseenReqCount, setUnseenReqCount] =
    useState<number>(initUnseenReqCount);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestHandler = () => {
      setUnseenReqCount((p) => p + 1);
      toast.info("Новая заявка в друзья"!);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  return (
    <Button asChild size="sm" variant="menu" className="w-full">
      <Link href="/user/requests" className="flex items-center">
        <UserCircle2Icon className="size-4 mr-2" /> {children}
        <span className="ml-auto">
          {unseenReqCount > 0 && <NotificationBubble number={unseenReqCount} />}
        </span>
      </Link>
    </Button>
  );
};

export const FriendRequestList = ({
  incomingRequests,
  sessionId,
}: FRLProps) => {
  const [requests, setRequests] = useState<FriendRequest[]>(incomingRequests);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestHandler = ({ senderId, senderEmail }: FriendRequest) => {
      setRequests((prev) => [...prev, { senderId, senderEmail }]);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderID: string) => {
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/requests/accept", {
        id: senderID,
      });
      setRequests((p) => p.filter((i) => i.senderId !== senderID));
    } catch (error) {
      toast.error("Произошла ошибка, попробуйте ещё разок");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const denyFriend = async (senderID: string) => {
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/requests/deny", {
        id: senderID,
      });
      setRequests((p) => p.filter((i) => i.senderId !== senderID));
      router.refresh();
      toast.success("Запрос в друзья принят!");
    } catch (error) {
      toast.error("Произошла ошибка, попробуйте ещё разок");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {requests.length === 0 ? (
        <div className="flex flex-col gap-y-4 items-center justify-center h-[calc(100vh-6rem)]">
          <h5 className="text-8xl">☹️</h5>
          <h1 className="text-neutral-700 text-4xl font-medium ">
            Здесь пусто, как в голове у дурака. Видимо, вы никому не нужны.
          </h1>
        </div>
      ) : (
        <div className="pt-8 px-8">
          <h1 className="font-bold text-6xl mb-8">Запросы</h1>
          <div className="grid grid-cols-2 gap-8">
            {requests.map((i) => (
              <div
                key={i.senderId}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <h3 className="font-bold text-md">{i.senderEmail}</h3>
                <div className="flex gap-2">
                  <Button
                    disabled={loading}
                    className="bg-green-400 hover:bg-green-600"
                    size="icon"
                    onClick={() => acceptFriend(i.senderId)}
                  >
                    {loading ? (
                      <LoaderCircleIcon className="size-6 animate-spin" />
                    ) : (
                      <Check className="size-6" />
                    )}
                  </Button>
                  <Button
                    disabled={loading}
                    className="bg-red-400 hover:bg-red-600"
                    size="icon"
                    onClick={() => denyFriend(i.senderId)}
                  >
                    {loading ? (
                      <LoaderCircleIcon className="size-6 animate-spin" />
                    ) : (
                      <X className="size-6" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
