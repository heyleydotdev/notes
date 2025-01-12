import { tv } from "tailwind-variants";

const tvSpinner = tv({ base: "size-4 animate-spin" });

const Spinner: React.FC<React.ComponentPropsWithRef<"svg">> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={tvSpinner({ className })}
    {...rest}
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

export { Spinner };
