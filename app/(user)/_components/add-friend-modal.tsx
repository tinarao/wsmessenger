import AddContactForm from "@/components/AddContactForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

const AddFriendModal = ({ children, username }: {children: React.ReactNode, username: string}) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Добавить контакт
          </DialogTitle>
          <DialogDescription>
            Добавьте друга и общайтесь с ним без ограничений. 
            Круто когда есть друзья! У тебя же есть друзья,{" "}
            <strong>{username.split(" ")[0]}</strong>?
          </DialogDescription>
        </DialogHeader>
        <AddContactForm>
          <UserPlus className="size-4 mr-2" /> Добавить
        </AddContactForm>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
