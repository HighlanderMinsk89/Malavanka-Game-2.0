import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  return (
    <nav>
      <div className="nav-wrapper red darken-2">
        <a href="/" className="brand-logo">
          Malavanka
        </a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <NavLink to="/scores">Scores</NavLink>
          </li>
          <li>
            {isAuthenticated ? (
              <NavLink to="/" onClick={logout}>
                Logout
              </NavLink>
            ) : (
              <NavLink to="/auth">Login / Register</NavLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
