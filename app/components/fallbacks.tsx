import { useNavigation } from "react-router";
import { useSpinDelay } from "spin-delay";

import { Spinner } from "~/components/ui/spinner";

const LoadingFallback: React.FC = () => (
  <div className="grid h-full flex-1 grid-cols-1 grid-rows-[1fr_auto_3fr]">
    <div className="row-start-2">
      <Spinner className="mx-auto size-7 text-zinc-500" />
    </div>
  </div>
);

const NavigationFallback: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const navigation = useNavigation();
  const isNavigating = useSpinDelay(
    Boolean(navigation.location) && navigation.formMethod === undefined,
  );

  if (isNavigating) {
    return <LoadingFallback />;
  }

  return children;
};

export { LoadingFallback, NavigationFallback };
