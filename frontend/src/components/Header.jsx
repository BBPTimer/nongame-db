import { use } from "react";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { getEmailFromStorage } from "../services/storageService";
import "./Header.css";

const Header = () => {
  const { auth } = use(AuthContext);

  let page = useLocation().pathname;

  return (
    <header>
      <img src="/logo.svg" id="logo" alt="The Nongame! Logo" />
      {page === "/" ? (
        <div className="heading">The Nongame!</div>
      ) : (
        <Link to="/">The Nongame!</Link>
      )}
      {page === "/instructions" ? (
        <div className="heading">How to Play</div>
      ) : (
        <Link to="/instructions">How to Play</Link>
      )}
      {page === "/custom" || page === "/register" || page === "/login" || page === "/pwchange" ? (
        <div className="heading">Custom Decks</div>
      ) : (
        (auth.isAuthenticated && <Link to="/custom">Custom Decks</Link>) ||
        (!auth.isAuthenticated && !getEmailFromStorage() && (
          <Link to="/register">Custom Decks</Link>
        )) ||
        (!auth.isAuthenticated && getEmailFromStorage() && (
          <Link to="/login">Custom Decks</Link>
        ))
      )}
    </header>
  );
};

export default Header;
