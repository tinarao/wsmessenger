import Image from "next/image";
import React from "react";
import { ToastT } from "sonner";

interface NMTProps {
  senderName: string;
  senderImage: string;
  message: string;
}

const NewMessageToast = ({ senderName, senderImage, message }: NMTProps) => {
  return (
    <div className="flex items-center gap-2 w-fit truncate">
      <div>
        <Image className="rounded-full" src={senderImage} width={25} height={25} alt={`Аватарка ${senderName}`} />
      </div>
      <div>
        <div>
        <h5 className="font-bold">
          {senderName}
        </h5>
        </div>
        <div className="truncate line-clamp-2">
            {message}
        </div>
      </div>
    </div>
  );
};

export default NewMessageToast;
