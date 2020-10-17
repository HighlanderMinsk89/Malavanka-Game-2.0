import React from "react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
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
            <NavLink to="/auth">Login / Register</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
