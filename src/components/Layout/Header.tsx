import Image from "next/image";
import Link from "next/link";
import AvatarDefault from "../../../public/img/avatar-default.png";
import IconSpinner from "../icons/IconSpinner";
import useToggle from "@/hooks/useToggle";
import { STRAPI_BASE_URL } from "@/config";
import { useStytchSession } from "@stytch/nextjs";
import loadStytch from "@/lib/loadStytch";
import { OrgService } from "@/lib/orgService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Organization } from "stytch";
import { Member } from "@stytch/vanilla-js";

export type HeaderLogo = {
  url: string;
  height: number;
  width: number;
};

export type HeaderMenu = {
  id: number;
  url: string;
  title: string;
};

function UserAvatar({
  user,
  organization,
}: {
  user?: Member | null;
  organization?: Organization | null;
}) {
  const [isOpenFloatingMenu, toggleOpenFloatingMenu, setIsOpenFloatingMenu] =
    useToggle();

  return (
    <div className="flex items-center relative">
      <div className="flex items-center">
        {organization && (
          <Link
            title={organization.organization_name}
            href={`/${organization.organization_slug}/dashboard`}
          >
            <div className="h-8 w-8 bg-sky-600 text-white flex items-center justify-center rounded-full overflow-hidden relative">
              {organization.organization_name[0]}
            </div>
          </Link>
        )}
        {user ? (
          <button
            type="button"
            onClick={toggleOpenFloatingMenu}
            className="flex gap-3 items-center relative"
          >
            <p className="font-medium text-sm">{user.name}</p>
            <div className="h-8 w-8 rounded-full overflow-hidden relative">
              <Image
                priority
                src={AvatarDefault}
                alt="user"
                height={360}
                width={360}
              />
            </div>
            {isOpenFloatingMenu && (
              <div
                onClick={() => setIsOpenFloatingMenu(false)}
                className="bg-white flex w-full text-left divide-y flex-col min-w-[100px] absolute border shadow-xl z-10 top-10 rounded-lg text-sm font-medium right-0"
              >
                <Link
                  href={`/${organization?.organization_slug}/dashboard`}
                  className="hover:text-indigo-600 transition-colors py-2 px-4"
                >
                  Profile
                </Link>
                <Link
                  href="/api/logout"
                  className="hover:text-indigo-600 transition-colors py-2 px-4"
                >
                  Logout
                </Link>
              </div>
            )}
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-indigo-700 hover:bg-indigo-800 transition-colors px-4 py-1 font-medium text-sm text-white rounded-lg"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Header({
  logo,
  menus,
  user,
  organization,
}: {
  logo: HeaderLogo;
  menus: HeaderMenu[];
  organization?: Organization | null;
  user?: Member | null;
}) {
  return (
    <header className="w-full border-b">
      <div className="w-full max-w-5xl flex items-center justify-between mx-auto px-4 py-2">
        <Link href="/">
          <Image
            priority
            className="h-10 w-auto"
            src={`${STRAPI_BASE_URL}${logo.url}`}
            alt="logo"
            height={logo.height}
            width={logo.width}
          />
        </Link>
        <div className="flex gap-10 items-center">
          <div className="w-full gap-6 flex items-center">
            {menus.map((menu) => (
              <Link key={menu.id} href={menu.url} className="font-medium ">
                {menu.title}
              </Link>
            ))}
          </div>
          <UserAvatar organization={organization} user={user} />
        </div>
      </div>
    </header>
  );
}