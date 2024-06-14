import Button from "./Button";
import "./style.css";
import { fetchTeams } from "./api/fetchTeams";
import TeamsTable from "./TeamsTable";

export default async function Home() {
  async function handleFetchTeams() {
    try {
      const teams = await fetchTeams();
      console.log("Teams fetched on button click:", teams);
      setTeamsData(teams); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  }

  handleFetchTeams();
  return (
    <>
      <TeamsTable></TeamsTable>
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
    </>
  );
}
