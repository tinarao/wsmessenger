import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Dudes from "@/public/dudes-user.svg";
import { getFriendsByUserID } from "@/utils/contacts";
import { fetchRedis } from "@/utils/redis";
import { getChatLink } from "@/utils/messages";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import MobileHeader from "../_components/mobile-header";

const UserPage = async () => {
  const session = await getServerSession(authOptions);
  const friends = await getFriendsByUserID(session!.user.id);

  const friendsWithMessages = await Promise.all(
    friends.map(async (friend) => {
      const chatLink = getChatLink(session!.user.id, friend.id);
      const [lastMessageStr] = (await fetchRedis(
        "zrange",
        `chat:${chatLink}:messages`,
        -1,
        -1
      )) as string[];
      const lastMessage = JSON.parse(lastMessageStr);

      return {
        ...friend,
        lastMessage,
      };
    })
  );

  return (
    <>
    <div className="block md:hidden">
      <MobileHeader />
    </div>
    <div className="pt-8">
      <h1 className="mx-8 text-6xl text-neutral-700">
        И снова здравствуй, <strong>{session?.user.name?.split(" ")[0]}</strong>
        !
      </h1>
      <div className="my-2">
        <hr />
      </div>
      <div className="px-8">
        <h3 className="text-neutral-700 font-medium text-3xl my-2 mb-6">
          Последние сообщения
        </h3>
        <div>
          {friendsWithMessages.length === 0 ? (
            <div>
              <h3 className="text-2xl">
                Новых сообщений не обнаружено. Добавьте кого-нибудь в друзья и
                начните общение, иначе зачем Вы сюда пришли?
              </h3>
            </div>
          ) : (
            friendsWithMessages.map((i) => {
              const chatLink = getChatLink(session!.user.id, i.id);

              return (
                <div
                  key={i.id}
                  className="relative bg-neutral-50 border p-3 rounded-md"
                >
                  <div className="absolute right-4 inset-y-0 flex items-center">
                    <ChevronRightIcon className="size-7 text-neutral-500" />
                  </div>
                  <Link
                    href={`/user/chats/${chatLink}`}
                    className="relative sm:flex"
                  >
                    <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                      <div>
                        <div className="relative size-6">
                          <Image
                            fill
                            referrerPolicy="no-referrer"
                            src={i.image}
                            className="rounded-full"
                            alt={`Аватарка ${i.name}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">
                        {i.name.split(" ")[0]}
                      </h4>
                      <p className="mt-2 max-w-md">
                        <span className="text-neutral-700">
                          {i.lastMessage.senderId === session!.user.id
                            ? <span className="text-neutral-500">Вы: </span>
                            : ""}
                        </span>
                        {i.lastMessage.text}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default UserPage;
