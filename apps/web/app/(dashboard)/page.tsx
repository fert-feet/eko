"use client";

import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { OrganizationSwitcher, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.user.getTest);
  const add = useMutation(api.user.add)
  console.log(users);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <SignInButton mode="modal">
          <Button>
            sign in
          </Button>
        </SignInButton>
        <SignOutButton>
          <Button>
            sign out
          </Button>
        </SignOutButton>
        <Button onClick={() => add()}>
          Add
        </Button>
        <UserButton />
        <OrganizationSwitcher />
      </div>
    </div>
  );
}
