"use client";

import { useClerk } from "@clerk/nextjs";
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { ComponentProps } from "react";

export function DropdownMenuItemSignOut(
  props: ComponentProps<typeof DropdownMenuItem>
) {
  const { signOut } = useClerk();

  return (
    <DropdownMenuItem
      onClick={() =>
        signOut({
          redirectUrl: "/",
        })
      }
      {...props}
    >
      <LogOutIcon />
      Sign Out
    </DropdownMenuItem>
  );
}
