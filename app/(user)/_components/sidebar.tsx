import { Button } from "@/components/ui/button";
import { Home, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import ProfileDropdown from "./profile-dropdown";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FriendRequests from "./friend-requests";
import { fetchRedis } from "@/utils/redis";

const Sidebar = async () => {
  const session = await getServerSession(authOptions);
  const unseenReqCount = (await fetchRedis("smembers", `user:${session!.user.id}:incoming_friend_requests`) as User[]).length

  return (
    <aside className="border-r h-screen">
      <div className="h-[10%] flex justify-center items-center border-b">
        <Image src={Logo} width={50} height={50} alt="Logo" />
      </div>
      <div className="h-[90%] flex flex-col justify-between py-6 px-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Ваши чаты</h3>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Обзор</h3>
            <div className="space-y-2">
            <Button asChild size="sm" variant="ghost" className="w-full">
              <Link href="/user/add">
                <UserPlus className="size-4 mr-2" /> Добавить контакт
              </Link>
            </Button>
            <FriendRequests 
              sessionId={session!.user.id}
              initUnseenReqCount={unseenReqCount}
            >
              Заявки в друзья
            </FriendRequests>
            </div>
          </div>
        </div>
        <div className="w-fit mx-auto">
          <ProfileDropdown session={session} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
