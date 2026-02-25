"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "@/services/auth.service"
import { useAppSelector } from "@/store/hooks"

export default function Header() {
  const router = useRouter()
  const user = useAppSelector((s) => s.auth.user)
  const session = useAppSelector((s) => s.auth.session)
  const displayName = user?.name?.trim() ?? null
  const email = session?.user?.email ?? ""

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="border-b border-border flex items-center p-2  pr-4 md:justify-between justify-normal gap-4 md:gap-0 bg-semantics-base-bg-dim-default">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger />
        <Image
          src="/assets/star.png"
          alt="Ramadan Tracker"
          width={24}
          height={24}
          className="md:hidden"
        />
      </div>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              styleVariant="gray"
              size="m"
              iconLeft={
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={user?.avatar_url ?? undefined} alt="" />
                  <AvatarFallback className="text-xs">
                    {displayName
                      ? displayName.slice(0, 2).toUpperCase()
                      : email
                        ? email.slice(0, 2).toUpperCase()
                        : "?"}
                  </AvatarFallback>
                </Avatar>
              }
            >


            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile">My profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
