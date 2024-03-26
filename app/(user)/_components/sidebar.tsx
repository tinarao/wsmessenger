import { Button } from "@/components/ui/button";
import { Home, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";

const Sidebar = () => {
  return (
    <div className="h-screen border-r">
        <div className="flex border-b p-8 w-full justify-center items-center">
            <Image src={Logo} width={50} height={50} alt="Logo" />
        </div>
      <nav className="flex flex-col w-fit mx-auto justify-start gap-2 py-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/user">
            <Home className="size-8" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/user/add">
            <UserPlus className="size-8" />
          </Link>
        </Button>
      </nav>
    </div>
  );
};

export default Sidebar;
