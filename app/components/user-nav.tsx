import { SignedIn } from "~/components/contexts/session/provider";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function UserNavigation() {
  return (
    <SignedIn>
      {({ user }) => (
        <button className="rounded-full transition-colors focus:outline-none focus:ring focus:ring-border-150">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </button>
      )}
    </SignedIn>
  );
}
