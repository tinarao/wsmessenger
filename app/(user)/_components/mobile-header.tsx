import Image from "next/image";
import React from "react";
import Logo from "@/public/logo.svg";
import MobileMenu from "./mobile-menu";
import { Menu } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MobileHeader = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex justify-between px-8 border-b py-2">
      <Image src={Logo} height={35} width={35} alt="YouChat" />
      <MobileMenu session={session!} size="icon" variant="outline">
        <Menu />
      </MobileMenu>
    </header>
  );
};

export default MobileHeader;
