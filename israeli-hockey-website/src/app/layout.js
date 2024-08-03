// layout.js
import React from 'react';
import NavBar from "./NavBar";
import Login from "./Login";
import "./style.css";
import { AuthProvider } from './authentication/contexts/authContext';

export const metadata = {
  title: "GoalNet: Israeli Roller Hockey Portal",
  description: "The official website of the Israeli Roller Hockey League",
};

export default function RootLayout({ children }) {
  return (
      <html lang="he">
        <body>
          <header>
            <div className="logo-container">
              <img src="tomerlogo.jpg" alt="לוגו גולנט" className="logo" />
            </div>
            <NavBar />
            <h1>גולנט: פורטל הוקי גלגליות ישראלי</h1>
            <Login />
          </header>
          <main>
            <AuthProvider>
            {children}
            </AuthProvider>
          </main>
          <footer>
            <p>הוכן על ידי: שחר בלס, אורי מצר, זיו זקליק, תומר כהן, ונעמה גרנר</p>
          </footer>
        </body>
      </html>
  );
}
