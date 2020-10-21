import React from "react";
import { GuestForm } from "../components/auth/GuestForm";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

export const AuthPage = () => {
  return (
    <div>
      <h3 className="center">Auth Features</h3>
      <div className="forms-cont">
        <LoginForm />
        <RegisterForm />
        <GuestForm />
      </div>
    </div>
  );
};
