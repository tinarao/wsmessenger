"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMinus2 } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";

interface PDProps {
  session: Session | null;
}

const ProfileDropdown = ({ session }: PDProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 w-full px-4 py-1">
        <Image
          src={session!.user.image as string}
          alt={session!.user.name as string}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="text-left">
          <h3 className="font-semibold text-sm">
            {session!.user.name?.split(" ")[0]}
          </h3>
          <p className="text-xs text-gray-700 font-medium">
            {session!.user.email}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <UserMinus2 className="size-4 mr-2" /> Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
