import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "./_components/sidebar";
import MobileMenu from "./_components/mobile-menu";
import { Menu } from "lucide-react";
import MobileHeader from "./_components/mobile-header";
import { fetchRedis } from "@/utils/redis";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);
  const unseenReqCount = (
    (await fetchRedis(
      "smembers",
      `user:${session?.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  if (!session?.user.id) {
    redirect("/login");
  }

  return (  
    <div className="md:grid md:grid-cols-12">
      {/* <MobileMenu>
        <Menu className="size-4 mr-2"/> Меню
      </MobileMenu> */}
      <div className="hidden md:block col-span-4 xl:col-span-2 h-screen">
        <Sidebar unseenReqCount={unseenReqCount} session={session} />
      </div>
      <main className="block md:col-span-8 xl:col-span-10 overflow-y-auto">
        {/* <Header /> */}
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
