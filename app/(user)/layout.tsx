import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "./_components/sidebar";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect("/login");
  }

  return (  
    <div className="grid grid-cols-12">
      <div className="col-span-2 h-screen">
        <Sidebar session={session} />
      </div>
      <main className="col-span-10 overflow-y-auto">
        {/* <Header /> */}
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
