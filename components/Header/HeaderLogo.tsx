import { useContext } from "react";
import RoyaltyTalentLogo from "../../public/RoyaltyTalentLogo.png";
import Image from "next/image";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import "./HeaderLogo.scss";

export const HeaderLogo = () => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div className={`header_logo_container ${darkMode ? "dark" : ""}`}>
      <Image
        src={RoyaltyTalentLogo}
        alt="Royalty Talent Agency Logo"
        width={512}
        height={359.95}
        priority
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
