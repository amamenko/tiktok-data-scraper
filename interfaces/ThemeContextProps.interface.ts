import { Dispatch, SetStateAction } from "react";

export interface ThemeContextProps {
  darkMode: boolean;
  changeDarkMode: Dispatch<SetStateAction<boolean>>;
}
