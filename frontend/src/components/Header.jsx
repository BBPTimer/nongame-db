import { Link, useLocation } from "react-router";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <img src="/logo.svg" id="logo" alt="The Nongame! Logo" />
      {useLocation().pathname === "/" ? (
        <div className="heading">The Nongame!</div>
      ) : (
        <Link to="/">The Nongame!</Link>
      )}
      {useLocation().pathname === "/instructions" ? (
        <div className="heading">How to Play</div>
      ) : (
        <Link to="/instructions">How to Play</Link>
      )}
      {useLocation().pathname === "/custom" ? (
        <div className="heading">Custom Decks</div>
      ) : (
        <Link to="/custom">Custom Decks</Link>
      )}
    </header>
  );
};

export default Header;
