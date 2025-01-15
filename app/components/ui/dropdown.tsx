import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { tv } from "tailwind-variants";

const { content, item, label, separator } = tv({
  slots: {
    content: [
      "z-50 min-w-36 rounded-xl bg-white p-1 shadow-lg ring-1 ring-inset ring-border-100 will-change-[transform,opacity,top,left] focus:outline-none",
      "data-[state=closed]:animate-fade-out",
    ],
    item: "group flex w-full cursor-default items-center gap-2 rounded-lg px-3 py-1.5 text-[0.8rem]/6 text-zinc-950 focus:bg-zinc-100 focus:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-80 [&>svg]:size-4 [&>svg]:shrink-0",
    label: "min-w-0 px-3 py-1 text-xs/5",
    separator: "mx-3 my-1 h-px border-t border-border-50",
  },
})();

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent: React.FC<
  React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Content>
> = ({ className, sideOffset = 4, ...rest }) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={content({ className })}
      {...rest}
    />
  </DropdownMenuPrimitive.Portal>
);

const DropdownMenuItem: React.FC<
  React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Item>
> = ({ className, ...rest }) => (
  <DropdownMenuPrimitive.Item className={item({ className })} {...rest} />
);

const DropdownMenuLabel: React.FC<
  React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Label>
> = ({ className, ...rest }) => (
  <DropdownMenuPrimitive.Label className={label({ className })} {...rest} />
);

const DropdownMenuSeparator: React.FC<
  React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Separator>
> = ({ className, ...rest }) => (
  <DropdownMenuPrimitive.Separator
    className={separator({ className })}
    {...rest}
  />
);

export {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
