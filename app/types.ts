import "zod";

declare module "zod" {
  interface ZodType<Output> {
    $infer: Output;
  }
}
