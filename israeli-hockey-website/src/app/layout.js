import "./globals.css";

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
            <img src="tomerlogo.jpg" alt="לוגו גולנט" class="logo" />
          </div>
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
            </ul>
          </nav>
          <h1>גולנט: פורטל הוקי גלגליות ישראלי</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
