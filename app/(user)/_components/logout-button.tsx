"use client"

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React, { ReactNode } from "react";

const LogoutButton = ({ children }: { children: ReactNode }) => {
  return (
    <Button variant="outline" className="hover:bg-red-500 hover:text-white" onClick={() => signOut()}>
        {children}
    </Button>
  );
};

export default LogoutButton;
