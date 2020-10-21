import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useHttp } from "../../hooks/http.hook";
import { useMessage } from "../../hooks/message.hook";

export const LoginForm = () => {
  const { request, loading, error, clearError } = useHttp();
  const message = useMessage();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const login = async () => {
    const response = await request("/api/auth/login", "post", { ...form });

    if (response) {
      auth.login(response.token, response.userId);
      history.push("/game");
    }
  };

  useEffect(() => {
    message(error);
    clearError();
  }, [error, clearError, message]);

  return (
    <div className="row auth-tile">
      <div className="col s12 m12 card-cont">
        <div className="card red darken-3">
          <div className="card-content white-text">
            <span className="card-title center">Login</span>
          </div>
          <div className="card-action">
            <div className="input-field ">
              <input
                id="email"
                type="text"
                value={form.email}
                name="email"
                onChange={handleChange}
              />
              <label htmlFor="email" className="white-text">
                Email *
              </label>
            </div>
            <div className="input-field">
              <input
                id="password"
                type="password"
                value={form.password}
                name="password"
                onChange={handleChange}
              />
              <label htmlFor="password" className="white-text">
                Password *
              </label>
            </div>
          </div>
          <div className="btn-form">
            <button
              className="btn white black-text waves-effect"
              onClick={login}
              disabled={loading}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
