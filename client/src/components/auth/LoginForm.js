import React from "react";

export const LoginForm = () => {
  return (
    <div className="row auth-tile">
      <div className="col s12 m12 card-cont">
        <div className="card red darken-3">
          <div className="card-content white-text">
            <span className="card-title center">Login</span>
          </div>
          <div className="card-action">
            <div className="input-field ">
              <input id="email" type="text" />
              <label for="email" className="white-text">
                Email
              </label>
            </div>
            <div className="input-field">
              <input id="password" type="password" />
              <label for="password" className="white-text">
                Password
              </label>
            </div>
          </div>
          <div className="btn-form">
            <button className="btn white black-text waves-effect">
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
