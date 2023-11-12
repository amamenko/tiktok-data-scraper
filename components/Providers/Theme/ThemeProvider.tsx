import { createContext, useState } from "react";
import { themeContextDefaults } from "./themeContextDefaults";
import { ThemeContextProps } from "@/interfaces/ThemeContextProps.interface";

export const ThemeContext =
  createContext<ThemeContextProps>(themeContextDefaults);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, changeDarkMode] = useState(true);
  return (
    <ThemeContext.Provider value={{ darkMode, changeDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
