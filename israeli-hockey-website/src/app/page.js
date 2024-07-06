import React from "react";
import { Card, Carousel, Table as AntTable } from "antd";
import "./style.css";
import Table from "./Table";

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

const query_upcoming_games = `select Home_Team_Name AS "קבוצת בית", Away_Team_Name AS "קבוצת חוץ", Day AS "יום", Date AS "תאריך", Start_Time AS "זמן התחלה", Location AS "מיקום", First_referee AS "שופט 1", Users.Full_Name as "שופט 2" from 

(Select Home_Team_ID, Home_Team_Name, Away_Team_ID, Teams.Team_Name as Away_Team_Name, Day, Date, Start_Time, Location, Referee_ID,Users.Full_Name AS first_referee, Second_Referee_ID From

(SELECT Home_Team_ID, Team_Name As Home_Team_Name, Away_Team_ID, Day,Date,Start_Time,Location, Referee_ID, Second_Referee_ID from Games 
INNER JOIN Teams ON Home_Team_ID = Team_ID
WHERE Date>CURRENT_TIMESTAMP AND Games.League_ID = 1) AS T1
LEFT JOIN 
Teams ON Away_Team_ID = Team_ID
LEFT JOIN Users 
On Referee_ID=user_ID) AS T_with_first_referee
LEFT JOIN Users on Second_Referee_ID = user_ID
;`;

const fetchRows = require("./api/fetchRows");

async function dataFetchStatistics() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_team_statistics);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

async function dataFetchUpcoming() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_upcoming_games);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

export default async function Home() {
  // Fetch data on the server side
  const data_statistics = await dataFetchStatistics();
  const data_upcoming = await dataFetchUpcoming();

  return (
    <div style={{ padding: "20px" }}>
      <Card title="Welcome to the Israeli Hockey League" bordered={false} style={{ marginBottom: "20px" }}>
        <p>Welcome to the official website of the Israeli Hockey League. Here, you will find the latest statistics, upcoming games, and much more about your favorite teams and players.</p>
      </Card>

      <Carousel autoplay style={{ marginBottom: "20px" }}>
        <div>
          <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Argentin_player_during_2007_rink_hockey_world_championship.jpg/1280px-Argentin_player_during_2007_rink_hockey_world_championship.jpg' alt="League Image 1" style={{ width: "100%" }} />
        </div>
        <div>
          <img src="https://www.worldskate.org/images/medium/20180723_jw_g11_40.JPG" alt="League Image 2" style={{ width: "100%" }} />
        </div>
        <div>
          <img src="https://www.worldskate.org/images/medium/20180723_jw_g11_40.JPG" alt="League Image 3" style={{ width: "100%" }} />
        </div>
      </Carousel>

      <Table data={data_statistics} name={"סטטיסטיקות קבוצתיות"} />
      <Table data={data_upcoming} name={"משחקים קרובים"} />
    </div>
  );
}
