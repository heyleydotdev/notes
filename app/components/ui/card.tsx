import { tvCard } from "~/components/ui/shared-styles";

const { base, header, title, description, content, footer } = tvCard();

const Card: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => <div className={base({ className })} {...rest} />;

const CardHeader: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => <div className={header({ className })} {...rest} />;

const CardTitle: React.FC<React.ComponentPropsWithRef<"h4">> = ({
  className,
  ...rest
}) => <h4 className={title({ className })} {...rest} />;

const CardDescription: React.FC<React.ComponentPropsWithRef<"p">> = ({
  className,
  ...rest
}) => <p className={description({ className })} {...rest} />;

const CardContent: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => <div className={content({ className })} {...rest} />;

const CardFooter: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => <div className={footer({ className })} {...rest} />;

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
