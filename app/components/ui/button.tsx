import type { VariantProps } from "tailwind-variants";

import { Slot } from "@radix-ui/react-slot";
import { tv } from "tailwind-variants";

import { tvButton } from "~/components/ui/shared-styles";
import { Spinner } from "~/components/ui/spinner";

export type ButtonVariantProps = VariantProps<typeof tvButton>;

export interface ButtonProps
  extends React.ComponentPropsWithRef<"button">,
    ButtonVariantProps {
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  asChild = false,
  ...rest
}) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={tvButton({ variant, size, className })} {...rest} />;
};

export interface PendingButtonProps extends ButtonProps {
  pending?: boolean;
}

const tvPendingButton = tv({
  base: "group data-[pending=true]:pointer-events-none",
});

const PendingButton: React.FC<PendingButtonProps> = ({
  pending,
  disabled,
  children,
  className,
  ...rest
}) => {
  return (
    <Button
      className={tvPendingButton({ className })}
      data-pending={pending}
      disabled={disabled || pending}
      {...rest}
    >
      {pending && <Spinner className="absolute size-4" />}
      <span className="contents group-data-[pending=true]:invisible">
        {children}
      </span>
    </Button>
  );
};

export { Button, PendingButton };
