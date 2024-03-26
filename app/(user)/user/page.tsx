import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";

const UserPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="border w-fit mx-auto flex items-center gap-4">
        <div>
          <Image
            src={session?.user?.image as string}
            alt={session?.user?.name as string}
            width={50}
            height={50}
          />
        </div>
        <h1 className="text-blue-600">
          {session?.user.id}
        </h1>
        <div>
          <h1 className="font-medium ">{session?.user?.name?.split(" ")[0]}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
