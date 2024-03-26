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
    <header className="w-full sticky top-0 border-b flex items-center justify-between py-4 px-6">
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
    </header>
  );
};

export default Header;
