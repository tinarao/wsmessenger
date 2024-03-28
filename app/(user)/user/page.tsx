import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Dudes from "@/public/dudes-user.svg"

const UserPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Image src={Dudes} width={800} height={500} alt="Нарисованные люди" />
      <h1 className="text-6xl text-neutral-700">
        И снова здравствуй, <strong>{session?.user.name?.split(" ")[0]}</strong>!
      </h1>
    </div>
  );
};

export default UserPage;
