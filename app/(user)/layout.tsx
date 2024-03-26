import { ReactNode } from "react";
import Header from "./_components/header";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession();

  if (!session) {
    notFound()
  }

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default UserLayout;
