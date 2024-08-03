"use client";

import "./style.css";
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function NavBar() {
  const gamesMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href="form_add_game">הוספת משחק</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="form_delete_game">מחיקת משחקים</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="form_results_updating">העלאת תוצאות משחק</a>
      </Menu.Item>
      <Menu.Item key="4">
        <a href="form_edit_game_results">עריכת תוצאות משחק</a>
      </Menu.Item>
    </Menu>
  );

  const teamsMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href="form_add_player">הוספת שחקן לקבוצה</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="form_delete_player">מחיקת שחקן מקבוצה</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="form_add_team">הוספת קבוצה חדשה</a>
      </Menu.Item>
      <Menu.Item key="4">
        <a href="form_delete_team">מחיקת קבוצה</a>
      </Menu.Item>
      <Menu.Item key="5">
        <a href="form_add_team_to_league">הוספת קבוצה לליגה</a>
      </Menu.Item>
      <Menu.Item key="6">
        <a href="form_delete_team_from_league">מחיקת קבוצה מליגה</a>
      </Menu.Item>
    </Menu>
  );

  const administartionMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href="uploadPhotos">העלאת תמונה</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="form_user_clasification">סיווג משתמש</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="browse_users">סקירת משתמשים</a>
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
          <a href="goal_king">מלכים</a>
        </li>
        <li>
          <a href="league_information">מידע על הליגה</a>
        </li>
        <li>
          <Dropdown overlay={gamesMenu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              ניהול משחקים <DownOutlined />
            </a>
          </Dropdown>
        </li>
        <li>
          <Dropdown overlay={teamsMenu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              ניהול קבוצות <DownOutlined />
            </a>
          </Dropdown>
        </li>
        <li>
          <Dropdown overlay={administartionMenu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              ניהול כללי <DownOutlined />
            </a>
          </Dropdown>
        </li>
        <li>
          <a href="form_personal_details">עדכון פרטים אישיים</a>
        </li>
        <li>
          <a href="authentication" className="login-button">התחברות</a>
        </li>
      </ul>
    </nav>
  );
}
