"use client";

import { useState } from "react";
import { toggleLoginForm } from "./Login";

export default function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <a href="#introduction">הקדמה</a>
        </li>
        <li>
          <a href="#upcoming-games">משחקים קרובים</a>
        </li>
        <li>
          <a href="#recent-results">תוצאות אחרונות</a>
        </li>
        <li>
          <a href="#league-information">מידע על הליגה</a>
        </li>
        <li>
          <a href="#teams-overview">סקירת קבוצות</a>
        </li>
        <li>
          <a href="#player-profiles">פרופילי שחקנים</a>
        </li>
        <li>
          <a href="#match-highlights">תקצירי משחקים</a>
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
          <a href="#login" className="login-button" onClick={toggleLoginForm}>
            התחברות
          </a>
        </li>
      </ul>
    </nav>
  );
}
