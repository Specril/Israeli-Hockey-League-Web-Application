import "./globals.css";
import NavBar from "./NavBar";
import Login from "./Login";
import "./style.css";

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
        {children}
      </body>
      <footer>
        <p>הוכן על ידי: שחר בלס, אורי מצר, זיו זקליק, תומר כהן, ונעמה גרנר</p>
      </footer>
    </html>
  );
}
