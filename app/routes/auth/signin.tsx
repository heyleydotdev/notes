import type { Route } from ".react-router/types/app/routes/auth/+types/signin";

import { useState } from "react";
import { tv } from "tailwind-variants";

import { authClient } from "~/auth/client";
import { $auth } from "~/auth/index.server";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";

export async function loader({ request }: Route.LoaderArgs) {
  return $auth.permitGuests(request);
}

export default function SigninPage() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Welcome! Choose your favorite provider to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <OAuthButton provider="github" icon="github">
          Continue with Github
        </OAuthButton>
        <OAuthButton provider="discord" icon="discord">
          Continue with Discord
        </OAuthButton>
      </CardContent>
    </Card>
  );
}

type OAuthButtonProps = React.ComponentPropsWithRef<typeof Button> & {
  provider: "discord" | "github";
  icon: keyof typeof Icons;
};

const tvOAuthButton = tv({ base: "w-full" });

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  icon,
  children,
  className,
  ...rest
}) => {
  const IconComp = Icons[icon];
  const [isPending, setIsPending] = useState(false);

  const onSignInHandler = async () => {
    await authClient.signIn.social(
      { provider, callbackURL: "/notes" },
      {
        onRequest() {
          setIsPending(true);
        },
        onResponse() {
          setIsPending(false);
        },
      },
    );
  };

  return (
    <Button
      className={tvOAuthButton({ className })}
      {...rest}
      variant="outline"
      size="lg"
      onClick={onSignInHandler}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <IconComp />}
      {children}
    </Button>
  );
};
