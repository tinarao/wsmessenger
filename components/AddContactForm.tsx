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

  const { register, handleSubmit, setError, formState: {errors} } = useForm<Data>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    setLoading(true);
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("http://localhost:3000/api/contacts/add", {
        email: validatedEmail,
      });

      toast.success("Запрос отправлен!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Введённый адрес некорректен");
        setError("email", { message: error.message });
        return;
      }
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data
        );
        setError("email", { message: error.response?.data });
        return;
      }

      setError("email", { message: "Неизвестная ошибка, мы её уже чиним" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: Data) => {
    addFriend(data.email)
  }

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="emailAddInput" >Почта приятеля</Label>
      </div>
      <div className="flex gap-4">
        <Input
          id="emailAddInput"
          {...register("email")}
          type="text"
          className="block"
          placeholder="tinarao@main.go"
        />
        <Button disabled={loading} variant={variant} className={className}>
          {children}
        </Button>
      </div>
      <span className="text-red-500 font-medium text-sm">
        {errors.email?.message}
      </span>
    </form>
  );
};

export default AddContactForm;
