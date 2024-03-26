"use client"

import { Button } from "@/components/ui/button";
import { UserCircle2Icon, UserPlus2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface FPProps {
    children: React.ReactNode
    sessionId: string
    initUnseenReqCount: number
}

const FriendRequests = ({ children, sessionId, initUnseenReqCount }: FPProps) => {

    const [unseenReqCount, setUnseenReqCount] = useState<number>(initUnseenReqCount)

  return (
    <Button asChild size="sm" variant="ghost" className="w-full">
      <Link href="/user/requests" className="flex items-center">
       <UserCircle2Icon className="size-4 mr-2" /> {children}
       <span>{unseenReqCount > 0 && (
        <p className="size-6 p-0 flex justify-center items-center bg-black text-white text-center rounded-full ml-4">
            {unseenReqCount}
        </p>
       )}</span>
      </Link>
    </Button>
  );
};

export default FriendRequests;
