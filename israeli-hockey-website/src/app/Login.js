"use client";

import { useState } from "react";
import "./style.css";
export function toggleLoginForm() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.style.display =
      loginForm.style.display === "none" ? "block" : "none";
  }
}

export function login() {
  // Login logic here
}

export function signup() {
  // Signup logic here
}

export default function LoginForm() {
  return (
    <section id="login-form" className="login-form" style={{ display: "none" }}>
      <div className="form-container">
        <button type="button" className="close-btn" onClick={toggleLoginForm}>
          X
        </button>
        <h3>התחברות למערכת</h3>
        <label htmlFor="username">שם משתמש:</label>
        <input type="text" id="username" placeholder="הזן שם משתמש" />
        <label htmlFor="password">סיסמה:</label>
        <input type="password" id="password" placeholder="הזן סיסמה" />
        <div className="button-container">
          <button type="submit" onClick={login}>
            התחבר
          </button>
          <button type="button" onClick={signup}>
            הרשמה
          </button>
        </div>
      </div>
    </section>
  );
}
