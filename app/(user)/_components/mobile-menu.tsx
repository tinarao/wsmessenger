"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Home, UserPlus, Users, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import { Button } from "@/components/ui/button";
import AddFriendModal from "./add-friend-modal";
import { Session } from "next-auth";
import ProfileDropdown from "./profile-dropdown";

interface MMProps {
  children: React.ReactNode;
  size: "icon" | "default";
  variant: "outline" | "default";
  session: Session;
}

const MobileMenu = ({
  children,
  size = "default",
  variant = "default",
  session,
}: MMProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button size={size} variant={variant} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Закрыть меню</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="font-bold text-xl leading-6 text-neutral-700">
                          Меню
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-2">
                            <Button
                              asChild
                              className="w-full border text-md"
                              variant="menu"
                              size="lg"
                            >
                              <Link href="/user">
                                <Home className="size-5 mr-2" /> Главная
                              </Link>
                            </Button>
                            <Button
                              asChild
                              className="w-full border text-md"
                              variant="menu"
                              size="lg"
                            >
                              <Link href="/user/requests">
                                <Users className="size-5 mr-2" /> Заявки в друзья
                              </Link>
                            </Button>
                            <AddFriendModal
                              username={session!.user.name as string}
                            >
                              <Button
                                size="lg"
                                variant="menu"
                                className="w-full border text-md"
                              >
                                <UserPlus className="size-5 mr-2" /> Добавить
                                контакт
                              </Button>
                            </AddFriendModal>
                          </div>
                          <div>
                            <ProfileDropdown session={session} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileMenu;
