import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { MessageCircle, User2Icon } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Dudes from "@/public/dudes.svg";
import Image from "next/image";
import Logo from "@/public/logo.svg";

const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <main className="h-screen max-h-screen">
      <title>YouChat</title>
      <header className="border-b">
        <div className="container py-2 flex justify-center md:justify-between items-center">
          <div className="flex gap-2 items-center">
            <Image src={Logo} width={40} height={40} alt="YouChat" />
            <h2 className="font-medium text-lg text-neutral-700">YouChat</h2>
          </div>
          {session?.user.id ? (
            <div className="hidden md:flex items-center h-fit gap-x-4">
              <div>
                <Button asChild>
                  <Link href="/user">
                    <User2Icon className="size-4 mr-2" /> Личный кабинет
                  </Link>
                </Button>
              </div>
              <div className="pl-4 border-l border-neutral-200">
                <Image
                  src={session.user.image as string}
                  className="rounded-full"
                  alt="Ваш аватар"
                  width={40}
                  height={40}
                />
              </div>
            </div>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">
                <MessageCircle className="size-4 mr-2"/> Начать общение
              </Link>
            </Button>
          )}
        </div>
      </header>
      <div className="container flex flex-col pt-24 items-center justify-center">
        <div>
          <Image src={Dudes} width={500} height={300} alt="Люди общаются" />
        </div>
        <h1 className="text-neutral-700 text-4xl text-center">
          <strong>Общение без ограничений.</strong>
          <br />
          Медленно, ненадёжно и небезопасно.
        </h1>
        <Button className="mt-8" asChild>
          <Link href={session ? "/user" : "/login"}>
            <MessageCircle className="size-4 mr-2" /> Приступить к работе
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default Home;
