import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { MessageCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {

  const session = await getServerSession(authOptions);
  if (session?.user.id) {
    redirect("/user")
  }

  return (
    <main className="flex h-screen justify-center items-center">
      <title>YouChat</title>
      <div className="text-center border py-8 px-16 rounded-lg">
        <h1>Мессенджер прошлого поколения</h1>
        <Button className="mt-4" asChild>
          <Link href="/user">
            <MessageCircle className="size-4 mr-2" /> Приступить к работе
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default Home;
