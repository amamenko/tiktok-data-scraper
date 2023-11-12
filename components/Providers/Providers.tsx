"use client";
import { ThemeProvider } from "./Theme/ThemeProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
