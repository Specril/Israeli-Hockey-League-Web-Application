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
          <a href="browse_teams">סקירת קבוצות</a>
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
          <a href="form_add_game">הוספת משחק</a>
        </li>
        <li>
          <a href="form_personal_details">עדכון פרטים אישיים</a>
        </li>

        <li>
          <a href="form_add_player">הוספת שחקן</a>
        </li>
        <li>
          <a href="form_add_team">הוספת קבוצה</a>
        </li>
        <li>
          <a href="form_results_updating">העלאת תוצאות משחק</a>
        </li>
        <li>
          <a href="form_delete_player">מחיקת שחקן</a>
        </li>
        <li>
          <a href="form_delete_team">מחיקת קבוצה</a>
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
