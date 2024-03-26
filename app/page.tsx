import { Button } from "@/components/ui/button";
import redis from "@/lib/db";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

const Home = async () => {
  return (
    <main className="flex h-screen justify-center items-center">
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
