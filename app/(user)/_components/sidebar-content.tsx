import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import ProfileDropdown from "./profile-dropdown";
import { getServerSession } from "next-auth";
import { fetchRedis } from "@/utils/redis";
import { FriendRequestsButton } from "./friend-requests";
import { getFriendsByUserID } from "@/utils/contacts";
import ChatsListSidebar from "./chats-list";
import AddFriendModal from "./add-friend-modal";
import { authOptions } from "@/lib/auth";

const SidebarContent = async () => {
  const session = await getServerSession(authOptions);

  const unseenReqCount = (
    (await fetchRedis(
      "smembers",
      `user:${session!.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;
  const friends = await getFriendsByUserID(session!.user.id);

  return (
    <>
      <Link href="/user">
        <div className="h-[10%] flex justify-center items-center border-b">
          <Image src={Logo} width={50} height={50} alt="Logo" />
        </div>
      </Link>
      <div className="h-[90%] flex flex-col justify-between py-6 px-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Ваши чаты</h3>
            <ChatsListSidebar friends={friends} session={session!} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Действия</h3>
            <div className="space-y-2 mt-2">
              <AddFriendModal username={session!.user.name as string}>
                <Button size="sm" variant="menu" className="w-full">
                  <UserPlus className="size-4 mr-2" /> Добавить контакт
                </Button>
              </AddFriendModal>
              <FriendRequestsButton
                sessionId={session!.user.id}
                initUnseenReqCount={unseenReqCount}
              >
                Заявки в друзья
              </FriendRequestsButton>
            </div>
          </div>
        </div>
        <div className="w-fit mx-auto">
          <ProfileDropdown session={session} />
        </div>
      </div>
    </>
  );
};

export default SidebarContent;
