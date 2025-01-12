import { ZodError } from "zod";

import { ERROR_MESSAGE, ERROR_SYMBOL, flattenErrors } from "~/utils/misc";

export type HandlerErrorShape = {
  [ERROR_SYMBOL]: true;
  status: "error";
  error_message?: string;
  error_fields?: {
    [k: string]: { message: string | undefined };
  };
};

export type ActionHandlerFunction<T> = () => Promise<T> | T;

export const $action = async <T>(
  fn: ActionHandlerFunction<T>,
): Promise<HandlerErrorShape | T> => {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    console.log("[ActionError]:", error);

    return errorHandler(error);
  }
};

export const errorHandler = (err: unknown): HandlerErrorShape => {
  if (err instanceof ZodError) {
    return {
      [ERROR_SYMBOL]: true,
      status: "error",
      error_fields: flattenErrors(err),
    };
  }

  let message = ERROR_MESSAGE;

  if (err instanceof ActionError) {
    message = err.message;
  }

  return {
    [ERROR_SYMBOL]: true,
    status: "error",
    error_message: message,
  };
};

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
