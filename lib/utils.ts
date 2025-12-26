import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Basic object type for error handling
type BasicObject = { [key: string]: any };

export const isError = (errObject: BasicObject, rawField: string): boolean => {
  if (!errObject || !rawField) return false;
  const splitField = rawField.split(".");

  if (!errObject[splitField[0]]) return false;

  if (splitField.length === 1) {
    return true;
  } else {
    return isError(
      errObject[splitField[0]],
      splitField.slice(1).reduce((a, b) => {
        if (splitField.length === 1) {
          return a + b;
        } else return a + "." + b;
      })
    );
  }
};
