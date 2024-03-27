"use client";

import { Button } from "@/components/ui/button";
import { Check, UserCircle2Icon, UserPlus2, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
    <Button asChild size="sm" variant="ghost" className="w-full">
      <Link href="/user/requests" className="flex items-center">
        <UserCircle2Icon className="size-4 mr-2" /> {children}
        <span>
          {unseenReqCount > 0 && (
            <p className="size-6 p-0 flex justify-center items-center bg-black text-white text-center rounded-full ml-4">
              {unseenReqCount}
            </p>
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

  return (
    <>
      {
        requests.length === 0 ? (
          <span>Запросов нет!</span>
        ) : (
          <div className="pt-8 px-8">
            <h1 className='font-bold text-6xl mb-8'>
              Запросы
            </h1>
            <div className="grid grid-cols-4 gap-8">
            {requests.map(i => (
              <div key={i.senderID} className="border rounded-lg p-4 flex items-center gap-8">
                <h3 className="font-bold text-lg">
                  {i.senderEmail}
                </h3>
                <div className="flex gap-2">
                  <Button className="bg-green-400 hover:bg-green-600" size="icon" >
                    <Check className="size-8" />
                  </Button>
                  <Button className="bg-red-400 hover:bg-red-600" size="icon" >
                    <X className="size-8" />
                  </Button>
                </div>
              </div>
            ))}
            </div>
          </div>
        )
      }
    </>
  )

};
