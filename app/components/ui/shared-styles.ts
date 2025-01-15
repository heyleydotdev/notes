import { tv } from "tailwind-variants";

export const tvCard = tv({
  slots: {
    base: "w-full space-y-[--gutter] rounded-xl border bg-white p-[--gutter] shadow-sm [--gutter:theme(spacing[6])] sm:[--gutter:theme(spacing[8])]",
    header: "space-y-1",
    title: "text-pretty text-base font-semibold text-zinc-900",
    description: "text-pretty text-sm/6",
    content: "w-full",
    footer: "w-full",
  },
});

export const tvButton = tv({
  base: "relative inline-flex h-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg text-center text-sm/6 font-medium text-zinc-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-black/5 disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default:
        "bg-zinc-900 text-zinc-50 after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/10 hover:bg-zinc-700 focus-visible:ring-black/15",
      destructive:
        "bg-red-600 text-zinc-50 after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/10 hover:bg-red-500 focus-visible:ring-red-600/15",
      outline:
        "bg-white outline outline-1 -outline-offset-1 outline-border-100 hover:bg-black/[0.025] focus-visible:outline focus-visible:outline-border-150",
    },
    size: {
      default: "px-3 py-1.5 text-[0.8rem]/6",
      lg: "px-3 py-1.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
