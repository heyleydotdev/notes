import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { tv } from "tailwind-variants";

const { root, image, fallback } = tv({
  slots: {
    root: "pointer-events-none relative flex size-10 shrink-0 select-none overflow-hidden rounded-full",
    image: "aspect-square size-full",
    fallback:
      "flex size-full items-center justify-center rounded-full bg-black/10 text-sm/6 font-semibold text-zinc-900",
  },
})();

const Avatar: React.FC<
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Root>
> = ({ className, ...rest }) => (
  <AvatarPrimitive.Root className={root({ className })} {...rest} />
);

const AvatarImage: React.FC<
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Image>
> = ({ className, ...rest }) => (
  <AvatarPrimitive.Image className={image({ className })} {...rest} />
);

const AvatarFallback: React.FC<
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Fallback>
> = ({ className, ...rest }) => (
  <AvatarPrimitive.Fallback className={fallback({ className })} {...rest} />
);

export { Avatar, AvatarImage, AvatarFallback };
