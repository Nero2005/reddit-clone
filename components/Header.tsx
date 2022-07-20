import Image from "next/image";
import React, { SetStateAction, useState } from "react";
import {
  ChevronDownIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from "@heroicons/react/solid";
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Menu from "./Menu";
import Link from "next/link";

interface Props {
  setOpen: (value: SetStateAction<boolean>) => void;
  open: Boolean;
}

function Header({ open, setOpen }: Props) {
  const { data: session } = useSession();
  // const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setOpen((open) => !open);
  };
  return (
    <div className="flex bg-white px-4 py-2 shadow-sm sticky top-0 z-50 items-center">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Link href="/">
          <Image
            src="https://links.papareact.com/fqy"
            objectFit="contain"
            layout="fill"
          />
        </Link>
      </div>
      <div className="flex items-center mx-7 xl:min-w-[300px]">
        <HomeIcon className="h-5 w-5" />
        <p className="flex-1 ml-2 hidden lg:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>

      <form
        className="flex flex-1 items-center space-x-2 border 
      border-gray-200 rounded-sm bg-gray-100 px-3 py-1"
      >
        <SearchIcon className="h-6 w-6 text-gray-400" />
        <input
          type="text"
          placeholder="Search Reddit"
          className="flex-1 bg-transparent outline-none hidden md:inline"
        />
        <input type="submit" hidden />
      </form>

      <div className="hidden mx-5 text-gray-500 space-x-2 items-center lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>

      <div className="ml-5 flex items-center lg:hidden" onClick={handleClick}>
        {open ? <XIcon className="icon" /> : <MenuIcon className="icon" />}
      </div>

      <Menu setOpen={setOpen} open={open} />

      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden lg:flex items-center space-x-2 border border-gray-100 cursor-pointer p-2"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              src="https://links.papareact.com/23l"
              objectFit="contain"
              layout="fill"
              alt=""
            />
          </div>
          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-400">Sign Out</p>
          </div>

          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="hidden lg:flex items-center space-x-2 border border-gray-100 cursor-pointer p-2"
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

export default Header;
