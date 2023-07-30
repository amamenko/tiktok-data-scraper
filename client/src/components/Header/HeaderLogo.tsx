import RoyaltyTalentLogo from "../../assets/RoyaltyTalentLogo.png";
import "./HeaderLogo.scss";

export const HeaderLogo = () => {
  return (
    <div className="header_logo_container">
      <img src={RoyaltyTalentLogo} alt="Royalty Talent Agency Logo" />
    </div>
  );
};
