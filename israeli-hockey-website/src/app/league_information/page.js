import DropdownTable from "../DropdownTable";
import "../style.css";
import Table from "../Table";

const query_team_statistics = `SELECT T1.Team_Name AS 'שם הקבוצה', COALESCE(T1.Total_Games,0) AS משחקים , (3*COALESCE(win_count,0)+COALESCE(tie_count,0)) AS נקודות, 
COALESCE(win_count,0) as נצחונות, COALESCE(tie_count,0) as תיקו, 
(COALESCE(T1.Total_Games,0) - COALESCE(win_count,0) - COALESCE(tie_count,0)) AS הפסדים,
COALESCE(total_goals,0) AS 'שערי זכות', COALESCE(rivals_goals,0) AS 'שערי חובה', (COALESCE(total_goals,0)-COALESCE(rivals_goals,0)) AS הפרש
FROM 
-- amount of games played for each team:
(SELECT 
    Teams.Team_ID,
    Teams.Team_Name,
    COUNT(Games.Game_ID) AS Total_Games
FROM 
    Teams
            LEFT JOIN (
            SELECT Home_Team_ID AS Team_ID, Game_ID
            FROM Games
            UNION ALL
            SELECT Away_Team_ID AS Team_ID, Game_ID
            FROM Games
        ) AS Games ON Teams.Team_ID = Games.Team_ID
        GROUP BY 
            Teams.Team_ID, 
            Teams.Team_Name) AS T1
LEFT JOIN

-- amount of wins per team:
(SELECT Winner_ID, COUNT(*) as win_count
FROM Games_with_winner 
WHERE Winner_ID != 0
GROUP BY
Winner_ID) AS T2 on T1.Team_ID = T2.Winner_ID

LEFT join

-- amount of ties per team:
(SELECT Team_ID, COUNT(*) as tie_count
FROM 
(SELECT Home_Team_ID AS Team_ID
    FROM Games_with_winner 
    WHERE Winner_ID = 0
    
    UNION ALL
    
    SELECT Away_Team_ID AS Team_ID
    FROM Games_with_winner 
    WHERE Winner_ID = 0) AS combined
GROUP BY
Team_ID) AS T3 on T1.Team_ID = T3.Team_ID

LEFT JOIN

-- amount of goals scored for each team:
(SELECT Goals.Team_ID, count(*) as total_goals
from Goals
group by Team_ID) AS T4 on T1.Team_ID = T4.Team_ID

LEFT join 
-- amount of goals scored on the team (from rivals) for each team:
(SELECT home_team_id as Team_ID, SUM(away_team_goals) as rivals_goals from games_with_winner 
GROUP BY home_team_id) AS T5 on T1.Team_ID = T5.Team_ID

LEFT JOIN

(SELECT League_ID, Team_ID From Teams)
AS T6 on T1.Team_ID = T6.Team_ID

ORDER BY נקודות DESC;
`;

const query_league_stats = `SELECT  Teams.Team_Name AS "שם קבוצה",  Users.Full_Name AS "שם שחקן", PlayersInTeams.Position AS "תפקיד", PlayersInTeams.Shirt_Number AS "מספר חולצה"
FROM Users inner join PlayersInTeams on PlayersInTeams.User_ID = Users.User_ID
RIGHT join Teams on Teams.Team_ID=PlayersInTeams.Team_ID
WHERE Teams.Team_ID=5; 
`;
const query_league_teams = `SELECT Team_Name FROM Teams;`

const fetchRows = require("../api/fetchRows");

async function dataFetchLeague() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_league_stats);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}
async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_league_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

async function dataFetchStatistics() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_team_statistics);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

export default async function Home() {
  // Fetch data on the server side
  const data_league = await dataFetchLeague();
  const data_teams = await dataFetchTeams();

  console.log(JSON.stringify(data_teams));

  const leagueOptions = ["בוגרים"];

  // Parse the JSON string into a JavaScript object
  const jsonArray = JSON.parse(JSON.stringify(data_teams));

  // Map through the array to extract the team names
  const teamNames = jsonArray.map(team => team.Team_Name);

  const data_statistics = await dataFetchStatistics();
  return (
    <>
      <DropdownTable
        options={leagueOptions}
        name="בחירת ליגה"
      />
      <Table data={data_statistics} name={"סטטיסטיקות קבוצתיות"} />
      <DropdownTable
        options={teamNames}
        name="בחירת קבוצה"
      />
      <Table data={data_league} name={"נתוני ליגה: בוגרים"} />
    </>
  );
}
