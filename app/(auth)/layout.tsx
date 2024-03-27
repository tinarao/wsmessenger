import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (session?.user.id) {
    redirect("/user");
  }

  return (
    <>
      {children}
    </>
  );
};

export default AuthLayout;
