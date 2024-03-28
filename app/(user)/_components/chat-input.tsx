"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { LoaderCircleIcon, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

const ChatInput = ({ chatId }: { chatId: string }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const sendMessage = async () => {
    if (inputValue === "") {
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/message/send", {
        text: inputValue,
        chatId,
      });
      setInputValue("")
      router.refresh()
    } catch (error) {
        toast.error("Произошла непредвиденная ошибка, попробуйте ещё раз попозже")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-8 flex justify-center items-center border-t-2">
      <div className="px-2 py-2 relative flex-1 overflow-hidden flex items-center gap-4">
        <TextareaAutosize
          className="max-h-24 w-full block border-neutral-300 resize-none bg-neutral-100 text-neutral-700 rounded-lg focus:border-neutral-400 focus:ring-neutral-700 font-medium disabled:bg-neutral-100 disabled:text-neutral-300"
          placeholder="Напишите сообщение..."
          rows={1}
          disabled={isLoading}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <div
          onClick={() => textAreaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9 " />
          </div>
        </div>
        <Button
          disabled={isLoading}
          size="icon"
          className="text-neutral-700"
          variant="outline"
          onClick={sendMessage}
        >
          {isLoading ? (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
