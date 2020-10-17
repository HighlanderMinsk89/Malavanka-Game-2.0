import React from "react";

export const GuestForm = () => {
  return (
    <div className="row auth-tile">
      <div className="col s12 m12 card-cont">
        <div className="card red darken-3">
          <div className="card-content white-text">
            <span className="card-title center">Play as Guest</span>
          </div>
          <div className="card-action">
            <div className="input-field ">
              <input id="name" type="text" />
              <label for="name" className="white-text">
                Name
              </label>
            </div>
            <div className="input-field">
              <input id="location" type="text" />
              <label for="location" className="white-text">
                Location
              </label>
            </div>
          </div>
          <div className="btn-form">
            <button className="btn white black-text waves-effect">Play!</button>
          </div>
        </div>
      </div>
    </div>
  );
};
