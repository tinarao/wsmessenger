import LogoutButton from "./logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, UserMinus2, UserPlus } from "lucide-react";
import Logo from "@/public/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import ProfileDropdown from "./profile-dropdown";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="w-full border-b flex py-2">
      <div className="container flex items-center justify-between">
        <div>
          <Image src={Logo} width={50} height={50} alt="Logo" />
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/user">
                <Home className="size-4 mr-2" /> Главная
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/user/add">
                <UserPlus className="size-4 mr-2" /> Добавить контакт
              </Link>
            </Button>
          </nav>
          <ProfileDropdown session={session} />
        </div>
      </div>
    </header>
  );
};

export default Header;
