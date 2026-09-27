// Next
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// For components that take a className: a caller's h-full has to beat the default height, not sit beside it.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
