const EmptyPattern: React.FC<
  React.ComponentPropsWithRef<"svg"> & { show: boolean }
> = ({ show, ...rest }) => {
  if (!show) {
    return null;
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <pattern
          id="a"
          width={15}
          height={15}
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100%" height="100%" fill="none" />
          <path fill="none" stroke="currentColor" d="M0 10h20z" />
        </pattern>
      </defs>
      <rect width="800%" height="800%" fill="url(#a)" />
    </svg>
  );
};

export { EmptyPattern };
