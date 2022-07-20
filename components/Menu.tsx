import { XIcon } from "@heroicons/react/solid";
import { signOut, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React, { SetStateAction } from "react";

interface MenuProps {
  setOpen: (value: SetStateAction<boolean>) => void;
  open: Boolean;
}

function Menu({ setOpen, open }: MenuProps) {
  const { data: session } = useSession();
  // translate-x-0, -translate-x-full
  return (
    <div
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      } flex-col h-screen p-8 absolute 
      top-12 left-0 transition transform ease-in-out duration-300 w-full bg-white z-50 lg:hidden`}
    >
      {session ? (
        <div
          onClick={() => signOut()}
          className="flex items-center space-x-2 border border-gray-100 cursor-pointer p-2"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              src="https://links.papareact.com/23l"
              objectFit="contain"
              layout="fill"
              alt=""
            />
          </div>
          <div className="flex-1 text-sm">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-400">Sign Out</p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="flex items-center space-x-2 border border-gray-100 cursor-pointer p-2"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              src="https://links.papareact.com/23l"
              objectFit="contain"
              layout="fill"
              alt=""
            />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  );
}

export default Menu;
