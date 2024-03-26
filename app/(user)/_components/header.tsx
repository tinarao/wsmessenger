import React from "react";
import LogoutButton from "./logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="w-full border-b flex py-2">
      <div className="container flex items-center justify-between">
        <div>
            <h1>messenger</h1>
        </div>
        <div className="flex items-center gap-2">
            <div className="mr-12">
                <Button asChild size="sm" variant="outline">
                    <Link href="/user/add">
                        <UserPlus className="size-4 mr-2" /> Добавить контакт
                    </Link>
                </Button>
            </div>
          <div>{session!.user.id && <LogoutButton>Выйти</LogoutButton>}</div>
          <div className="flex items-center ml-8">
            <h3 className="font-medium">
                {session!.user.name}
            </h3>
            <Image
              src={session!.user.image as string}
              alt={session!.user.name as string}
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
