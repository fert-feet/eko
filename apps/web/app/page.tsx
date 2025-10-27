"use client";

import { Button } from "@workspace/ui/components/button";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.user.getTest);
  const user = useUser();
  console.log(users);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">
          {JSON.stringify(users)}
        </h1>
        <SignOutButton>
          <Button>
            sign out
          </Button>
        </SignOutButton>
        <SignInButton mode="modal">
          <Button>
            sign in
          </Button>
        </SignInButton>
        <UserButton></UserButton>
      </div>
    </div>
  );
}
