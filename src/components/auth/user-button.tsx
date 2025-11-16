"use client";

import { useSession } from "@/lib/auth-client";
import { SignInButton } from "./sign-in-button";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { Skeleton } from "@/components/ui/skeleton";

export function UserButton() {
  const { data: session, isPending } = useSession();

  // Show skeleton loader while loading
  if (isPending) {
    return (
      <Skeleton className="size-8 rounded-full" />
    );
  }

  // Show sign-in button when not authenticated
  if (!session?.user) {
    return <SignInButton />;
  }

  // Show user profile dropdown when authenticated
  return <UserProfileDropdown user={session.user} />;
}
