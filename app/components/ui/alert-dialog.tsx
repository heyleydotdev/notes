import type { ButtonVariantProps } from "~/components/ui/button";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { tv } from "tailwind-variants";

import { tvButton, tvCard } from "~/components/ui/shared-styles";

const { overlay, content, contentInner, body, footer } = tv({
  slots: {
    overlay: [
      "fixed inset-0 isolate z-50 grid min-h-full w-screen grid-cols-1 grid-rows-[1fr_auto_3fr] justify-items-center overflow-hidden bg-zinc-950/25 p-4 sm:p-8",
      "data-[state=open]:animate-fade-in [--duration:100ms] data-[state=closed]:animate-fade-out",
    ],
    content: [
      "row-start-2 min-h-0 w-full max-w-md origin-center rounded-2xl bg-white p-[--spacing] shadow-lg ring-1 ring-border-150 will-change-[opacity,transform] [--spacing:theme(spacing[6])] focus-visible:outline-none sm:[--spacing:theme(spacing[8])]",
      "data-[state=open]:animate-zoom-in [--duration:100ms] data-[state=closed]:animate-fade-out",
    ],
    contentInner: "flex size-full min-h-0 flex-col",
    body: "mt-[--spacing]",
    footer: "mt-[--spacing] flex items-center justify-end gap-x-2",
  },
})();

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay: React.FC<
  React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Overlay>
> = ({ className, ...rest }) => (
  <AlertDialogPrimitive.Overlay className={overlay(className)} {...rest} />
);

const AlertDialogContent: React.FC<
  React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Content>
> = ({ children, className, ...rest }) => (
  <AlertDialogPortal>
    <AlertDialogOverlay>
      <AlertDialogPrimitive.Content className={content(className)} {...rest}>
        <div className={contentInner()}>{children}</div>
      </AlertDialogPrimitive.Content>
    </AlertDialogOverlay>
  </AlertDialogPortal>
);

const AlertDialogTitle: React.FC<
  React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Title>
> = ({ className, ...rest }) => (
  <AlertDialogPrimitive.Title
    className={tvCard().title({ className })}
    {...rest}
  />
);

const AlertDialogDescription: React.FC<
  React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Description>
> = ({ className, ...rest }) => (
  <AlertDialogPrimitive.Description
    className={tvCard().description({ className: ["mt-1", className] })}
    {...rest}
  />
);

const AlertDialogBody: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => <div className={body({ className })} data-slot="body" {...rest} />;

const AlertDialogFooter: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => <div className={footer({ className })} {...rest} />;

const AlertDialogAction: React.FC<
  React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Action> &
    ButtonVariantProps
> = ({ size, variant, className, ...rest }) => (
  <AlertDialogPrimitive.Action
    className={tvButton({ variant, size, className })}
    {...rest}
  />
);

const AlertDialogCancel: React.FC<
  React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Cancel>
> = ({ className, ...rest }) => (
  <AlertDialogPrimitive.Cancel
    className={tvButton({ variant: "outline", className })}
    {...rest}
  />
);

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
