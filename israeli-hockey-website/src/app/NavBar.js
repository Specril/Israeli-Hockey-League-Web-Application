"use client";

import React from "react";
import "./style.css";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default function NavBar() {
  const fanZoneMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href="#fan-zone">אזור האוהדים</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="#educational-resources">משאבים הדרכתיים</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="#interactive-challenges">אתגרים אינטראקטיביים</a>
      </Menu.Item>
      <Menu.Item key="4">
        <a href="#contact-us">צור קשר</a>
      </Menu.Item>
    </Menu>
  );

  const managementMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href="form_add_game">הוספת משחק</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="form_personal_details">עדכון פרטים אישיים</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="form_add_player">הוספת שחקן</a>
      </Menu.Item>
      <Menu.Item key="4">
        <a href="form_add_team">הוספת קבוצה</a>
      </Menu.Item>
      <Menu.Item key="5">
        <a href="form_results_updating">העלאת תוצאות משחק</a>
      </Menu.Item>
      <Menu.Item key="6">
        <a href="form_delete_player">מחיקת שחקן</a>
      </Menu.Item>
      <Menu.Item key="7">
        <a href="form_delete_team">מחיקת קבוצה</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav>
      <ul className="nav-menu">
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
          <Dropdown overlay={fanZoneMenu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              אזור האוהדים <DownOutlined />
            </a>
          </Dropdown>
        </li>
        <li>
          <Dropdown overlay={managementMenu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              ניהול <DownOutlined />
            </a>
          </Dropdown>
        </li>
        <li>
          <a href="authentication">התחברות</a>
        </li>
      </ul>
    </nav>
  );
}
