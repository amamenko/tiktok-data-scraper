import { useContext } from "react";
import RoyaltyTalentLogo from "../../assets/RoyaltyTalentLogo.png";
import { AppContext } from "../../App";
import "./HeaderLogo.scss";

export const HeaderLogo = () => {
  const { darkMode } = useContext(AppContext);
  return (
    <div className={`header_logo_container ${darkMode ? "dark" : ""}`}>
      <img src={RoyaltyTalentLogo} alt="Royalty Talent Agency Logo" />
    </div>
  );
};
