"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { addFriendValidator } from "@/lib/validations";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalUrl } from "@/utils/getlocal";

interface ACBProps {
  children?: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

type Data = z.infer<typeof addFriendValidator>;

const AddContactForm = ({ children, className, variant }: ACBProps) => {
  const [loading, setLoading] = useState(false);
  const localUrl = getLocalUrl();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Data>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    setLoading(true);
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post(`${localUrl}/api/requests/send`, {
        email: validatedEmail,
      });

      toast.success("Запрос отправлен!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: "Некорректный адрес!" });
        return;
      }
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
        console.log(error)
        setError("email", { message: error.response?.data });
        return;
      }

      setError("email", { message: "Неизвестная ошибка, мы её уже чиним" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: Data) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="emailAddInput">Почта приятеля</Label>
      <div className="space-y-4 py-2">
        <Input
          id="emailAddInput"
          {...register("email")}
          type="text"
          placeholder="tinarao@main.go"
        />
        <span className="text-red-500 font-medium text-sm">
          {errors.email?.message}
        </span>
        <hr />
        <div className="w-fit mx-auto">
          <Button disabled={loading}>{children}</Button>
        </div>
      </div>
    </form>
  );
};

export default AddContactForm;
