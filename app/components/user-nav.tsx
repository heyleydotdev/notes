import { useNavigate } from "react-router";

import { authClient } from "~/auth/client";
import { SignedIn } from "~/components/contexts/session/provider";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown";

export default function UserNavigation() {
  return (
    <SignedIn>
      {({ user }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-border-150">
            <Avatar>
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" className="w-64">
            <DropdownMenuLabel>
              <p className="truncate text-[0.8rem]/6 font-medium text-zinc-950">
                {user.name}
              </p>
              <p className="truncate text-xs/5 text-zinc-500">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </SignedIn>
  );
}

const SignOutButton: React.FC<
  React.ComponentPropsWithRef<typeof DropdownMenuItem>
> = (props) => {
  const navigate = useNavigate();

  return (
    <DropdownMenuItem
      {...props}
      className="text-red-600 focus:bg-red-50"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess() {
              navigate("/signin");
            },
          },
        })
      }
    >
      Sign out
    </DropdownMenuItem>
  );
};
