"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Check,
  LoaderCircleIcon,
  LoaderIcon,
  UserCircle2Icon,
  UserPlus2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import NotificationBubble from "./notification-bubble";

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

  return (
    <Button asChild size="sm" variant="menu" className="w-full">
      <Link href="/user/requests" className="flex items-center">
        <UserCircle2Icon className="size-4 mr-2" /> {children}
        <span>
          {unseenReqCount > 0 && (
            <NotificationBubble number={unseenReqCount} />
          )}
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

  const acceptFriend = async (senderID: string) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/requests/accept", {
        id: senderID
      })
      setRequests(p => p.filter(i => i.senderID !== senderID))
      router.refresh()
    } catch (error) {
      toast.error("Произошла ошибка, попробуйте ещё разок");
    } finally {
      setLoading(false);
    }
  };

  const denyFriend = async (senderID: string) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/requests/deny", {
        id: senderID
      })
      setRequests(p => p.filter(i => i.senderID !== senderID))
      router.refresh()
      toast.success("Запрос в друзья принят!")
    } catch (error) {
      toast.error("Произошла ошибка, попробуйте ещё разок");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {requests.length === 0 ? (
        <span>Запросов нет!</span>
      ) : (
        <div className="pt-8 px-8">
          <h1 className="font-bold text-6xl mb-8">Запросы</h1>
          <div className="grid grid-cols-4 gap-8">
            {requests.map((i) => (
              <div
                key={i.senderID}
                className="border rounded-lg p-4 flex items-center gap-8"
              >
                <h3 className="font-bold text-lg">{i.senderEmail}</h3>
                <div className="flex gap-2">
                  <Button
                    disabled={loading}
                    className="bg-green-400 hover:bg-green-600"
                    size="icon"
                    onClick={() => acceptFriend(i.senderID)}
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
                    onClick={() => denyFriend(i.senderID)}
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
