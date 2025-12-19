"use client";

import { Button } from "@workspace/ui/components/button";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { OrganizationSwitcher, SignIn, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@workspace/ui/components/empty";
import { ArrowUpRightIcon, BedIcon, FileIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import ConversationsView from "../../modules/dashboard/ui/view/conversations-view";

export default function Page() {
  const users = useQuery(api.user.getTest);
  const {isLoading, isAuthenticated} = useConvexAuth()
  const router = useRouter()

  if (isAuthenticated) {
      redirect("/conversations")
  }

  return (
        <SignInButton mode="modal" />
  )
}
