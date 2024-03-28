"use client";

import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Dudes from "@/public/dudes-auth.svg"
import Image from "next/image";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Произошла ошибка, попробуйте ещё разок");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen justify-center items-center px-8 md:px-0">
      <title>YouChat - Авторизация</title>
      <div>
        <Image src={Dudes} width={500} height={500} alt="Неживые люди" />
      </div>
      <h1 className="text-neutral-700 text-4xl font-bold my-4 text-center">
        Ну ты долго? Только тебя и ждём!
      </h1>
      <div className="space-y-4">
        <Button
          variant="outline"
          size="lg"
          disabled={loading}
          onClick={loginWithGoogle}
        >
          <>
            {loading ? (
              <LoaderCircleIcon className="size-4 animate-spin mr-2" />
            ) : (
              <FaGoogle className="size-4 mr-2" />
            )}
            Войти через Google
          </>
        </Button>
      </div>
    </main>
  );
};

export default LoginPage;
