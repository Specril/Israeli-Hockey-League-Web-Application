"use client";

import "./style.css";
import { useState } from "react";
import { toggleLoginForm } from "./Login";

export default function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">ראשי</a>
        </li>
        <li>
          <a href="upcoming_games">משחקים קרובים</a>
        </li>
        <li>
          <a href="goal_king">מלך השערים</a>
        </li>
        <li>
          <a href="league_information">מידע על הליגה</a>
        </li>
        <li>
          <a href="#teams-overview">סקירת קבוצות</a>
        </li>
        <li>
          <a href="#fan-zone">אזור האוהדים</a>
        </li>
        <li>
          <a href="#educational-resources">משאבים הדרכתיים</a>
        </li>
        <li>
          <a href="#interactive-challenges">אתגרים אינטראקטיביים</a>
        </li>
        <li>
          <a href="#contact-us">צור קשר</a>
        </li>
        <li>
          {/* <a href="#login" className="login-button" onClick={toggleLoginForm}> */}
          <a href="authentication">
            התחברות
          </a>
        </li>
      </ul>
    </nav>
  );
}
