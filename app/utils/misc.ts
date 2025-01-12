import { isCuid } from "@paralleldrive/cuid2";
import { z, ZodError } from "zod";

export const ERROR_SYMBOL = "error_symbol";
export const ERROR_MESSAGE =
  "Something went wrong. Please try again later or reach out to support for help.";

export const getInitials = (name = ""): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .splice(0, 2)
    .join("")
    .toUpperCase();

export const flattenErrors = (error: ZodError) => {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors ?? {}).map(([name, errors]) => [
      name,
      { message: errors?.[0] },
    ]),
  );
};

export const cuidSchema = z
  .string()
  .min(24)
  .refine((id) => isCuid(id));

export const noteFormatter = (
  text: string,
  length = 128,
  replace?: string,
): string => {
  if (replace) {
    text = text.replace(replace, "").trim();
  }

  if (text.length > length) {
    text = text.slice(0, length).trim();
    const lastSpace = text.lastIndexOf(" ");
    if (lastSpace > 0) {
      text = text.slice(0, lastSpace);
    }
    return text;
  }

  return text;
};

export const noteTime = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  switch (date.toDateString()) {
    case today.toDateString():
      return date.toLocaleTimeString("en-US", { timeStyle: "short" });
    case yesterday.toDateString():
      return "Yesterday";
    default:
      return date.toLocaleDateString("en-US", { dateStyle: "short" });
  }
};
