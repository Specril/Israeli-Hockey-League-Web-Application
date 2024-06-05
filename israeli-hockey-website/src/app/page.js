"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./style.css";

function highlightTodaysGames() {
  const today = new Date().toISOString().split("T")[0];
  const gameRows = document.querySelectorAll("#upcoming-games tbody tr");
  gameRows.forEach((row) => {
    const gameDate = row.cells[0].textContent;
    if (gameDate === today) {
      row.style.backgroundColor = "#ffff99"; // Highlight with a light yellow color
    }
  });
}

function login() {
  // Placeholder function for login action
  alert("Login functionality not implemented yet.");
}

export default function Home() {
  const [displayLogin, setDisplayLogin] = useState("none");

  useEffect(() => {
    highlightTodaysGames();

    const handleScroll = () => {
      const navbar = document.querySelector("nav");
      const scrollThreshold = 100; // Change as needed
      navbar.style.opacity = window.scrollY > scrollThreshold ? "0.9" : "1";
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header>
        <div class="logo-container">
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
              <a
                href="#login"
                class="login-button"
                onClick={() => setDisplayLogin("block")}
              >
                התחברות
              </a>
            </li>
            <li>
              <a href="#contact-us">צור קשר</a>
            </li>
          </ul>
        </nav>
        <div
          id="login-form"
          class="login-form"
          style={{ display: displayLogin }}
        >
          <div class="form-container">
            <button
              type="button"
              class="close-btn"
              onClick={() => setDisplayLogin("none")}
            >
              X
            </button>
            <h3>התחברות למערכת</h3>
            <label for="username">שם משתמש:</label>
            <input type="text" id="username" placeholder="הזן שם משתמש" />
            <label for="password">סיסמה:</label>
            <input type="password" id="password" placeholder="הזן סיסמה" />
            <div class="button-container">
              <button type="submit" onclick="login()">
                התחבר
              </button>
              <button type="button" onclick="signup()">
                הרשמה
              </button>
            </div>
          </div>
        </div>

        <h1>גולנט: פורטל הוקי גלגליות ישראלי</h1>
      </header>

      <section id="upcoming-games">
        <h2>משחקים קרובים</h2>
        <table>
          <thead>
            <tr>
              <th>תאריך</th>
              <th>שעה</th>
              <th>קבוצות</th>
              <th>מיקום</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15/04/2024</td>
              <td>18:00</td>
              <td>גבעת עדה נגד בית לחם הגלילית</td>
              <td>גבעת עדה</td>
            </tr>
            <tr>
              <td>16/04/2024</td>
              <td>20:00</td>
              <td>קרית ביאליק נגד נופית</td>
              <td>קרית ביאליק</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="recent-results">
        <h2>תוצאות אחרונות</h2>
        <table>
          <thead>
            <tr>
              <th>תאריך</th>
              <th>קבוצות</th>
              <th>תוצאה</th>
              <th>מיקום</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10/04/2024</td>
              <td>קרית ים נגד קרית מוצקין</td>
              <td>2-3</td>
              <td>קרית ים</td>
            </tr>
            <tr>
              <td>09/04/2024</td>
              <td>רמת ישי נגד נופית</td>
              <td>1-4</td>
              <td>רמת ישי</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="league-standings">
        <h2>דירוג הליגה</h2>
        <table>
          <thead>
            <tr>
              <th>מקום</th>
              <th>קבוצה</th>
              <th>משחקים</th>
              <th>ניצחונות</th>
              <th>הפסדים</th>
              <th>נקודות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>גבעת עדה</td>
              <td>14</td>
              <td>10</td>
              <td>4</td>
              <td>30</td>
            </tr>
            <tr>
              <td>2</td>
              <td>בית לחם הגלילית</td>
              <td>14</td>
              <td>9</td>
              <td>5</td>
              <td>27</td>
            </tr>
            <tr>
              <td>3</td>
              <td>קרית ביאליק</td>
              <td>14</td>
              <td>8</td>
              <td>6</td>
              <td>24</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer>
        <p>הוכן על ידי: שחר בלס, אורי מצר, זיו זקליק, תומר כהן, ונעמה גרנר</p>
      </footer>
      <script src="script.js"></script>
      <script src="./script.js"></script>
    </>
  );
}

/*<div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.js</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div> */
