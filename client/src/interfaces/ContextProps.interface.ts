import React, { Dispatch, SetStateAction } from "react";

export interface ContextProps {
  darkMode: boolean;
  changeDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}
