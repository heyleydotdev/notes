import { tv } from "tailwind-variants";

const { root, title } = tv({
  slots: {
    root: "flex items-center justify-between pb-6",
    title: "font-display text-lg font-semibold text-zinc-900",
  },
})();

const PageHeadingRoot: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => <div className={root({ className })} {...rest} />;

const PageHeading: React.FC<React.ComponentPropsWithRef<"h1">> = ({
  className,
  ...rest
}) => <h1 className={title({ className })} {...rest} />;

export { PageHeadingRoot, PageHeading };
