import React from "react";
import { Card } from "antd";
import "./style.css";
import Table from "./Table";
import PremierLeagueTable from "./MainCard";
import CarouselComponent from "./MainCarousel";
import MainCardUpcomingGames from "./MainCardUpcomingGames"


const query_team_statistics = `
SELECT 
    T1.Team_Name AS 'שם הקבוצה', 
    COALESCE(T7.Photo, '') AS Logo,
    COALESCE(T1.Total_Games, 0) AS משחקים, 
    (3 * COALESCE(win_count, 0) + COALESCE(tie_count, 0)) AS נקודות, 
    (COALESCE(total_goals, 0) - COALESCE(rivals_goals, 0)) AS הפרש
FROM 
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
        Teams.Team_Name
    ) AS T1
LEFT JOIN
    (SELECT 
        Winner_ID, 
        COUNT(*) as win_count
    FROM 
        Games_with_winner 
    WHERE 
        Winner_ID != 0
    GROUP BY
        Winner_ID
    ) AS T2 on T1.Team_ID = T2.Winner_ID
LEFT JOIN
    (SELECT 
        Team_ID, 
        COUNT(*) as tie_count
    FROM 
        (SELECT Home_Team_ID AS Team_ID
        FROM Games_with_winner 
        WHERE Winner_ID = 0
        UNION ALL
        SELECT Away_Team_ID AS Team_ID
        FROM Games_with_winner 
        WHERE Winner_ID = 0
        ) AS combined
    GROUP BY
        Team_ID
    ) AS T3 on T1.Team_ID = T3.Team_ID
LEFT JOIN
    (SELECT 
        Goals.Team_ID, 
        COUNT(*) as total_goals
    FROM 
        Goals
    GROUP BY 
        Team_ID
    ) AS T4 on T1.Team_ID = T4.Team_ID
LEFT JOIN 
    (SELECT 
        home_team_id as Team_ID, 
        SUM(away_team_goals) as rivals_goals 
    FROM 
        games_with_winner 
    GROUP BY 
        home_team_id
    ) AS T5 on T1.Team_ID = T5.Team_ID
LEFT JOIN
    (SELECT 
        League_ID, 
        Team_ID 
    FROM 
        Teams
    ) AS T6 on T1.Team_ID = T6.Team_ID
LEFT JOIN
    (SELECT 
        Team_ID, 
        Photo 
    FROM 
        TeamsLogos
    ) AS T7 on T1.Team_ID = T7.Team_ID
ORDER BY 
    נקודות DESC;
`;

const query_upcoming_games = `
SELECT
    Home_Team_Name AS "קבוצת בית",
    TeamsLogos_Home.Photo AS "לוגו קבוצת בית",
    Away_Team_Name AS "קבוצת חוץ",
    TeamsLogos_Away.Photo AS "לוגו קבוצת חוץ",
    Day as "יום",
    Date AS "תאריך",
    Start_Time AS "זמן התחלה"
FROM
    (SELECT
        Home_Team_ID,
        Home_Team_Name,
        Away_Team_ID,
        Teams.Team_Name AS Away_Team_Name,
        Day,
        Date,
        Start_Time,
        Location,
        Referee_ID,
        Users.Full_Name AS first_referee,
        Second_Referee_ID
    FROM
        (SELECT
            Home_Team_ID,
            Team_Name AS Home_Team_Name,
            Away_Team_ID,
            Day,
            Date,
            Start_Time,
            Location,
            Referee_ID,
            Second_Referee_ID
        FROM
            Games
        INNER JOIN Teams ON Home_Team_ID = Team_ID
        WHERE
            Date > CURRENT_TIMESTAMP
            AND Games.League_ID = 1) AS T1
    LEFT JOIN Teams ON Away_Team_ID = Teams.Team_ID
    LEFT JOIN Users ON Referee_ID = user_ID) AS T_with_first_referee
LEFT JOIN Users ON Second_Referee_ID = user_ID
LEFT JOIN TeamsLogos AS TeamsLogos_Home ON T_with_first_referee.Home_Team_ID = TeamsLogos_Home.Team_ID
LEFT JOIN TeamsLogos AS TeamsLogos_Away ON T_with_first_referee.Away_Team_ID = TeamsLogos_Away.Team_ID
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
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0px" }}>
      
      <PremierLeagueTable data={data_statistics} name={"סטטיסטיקות קבוצתיות"} style={{ flex: "12", marginRight: "20px" }} /> {/* Adjust styles as needed */}
      <CarouselComponent style={{ flex: "2", marginRight: "20px" }} /> {/* Adjust styles as needed */}
      <MainCardUpcomingGames data={data_upcoming} name={"משחקים קרובים"} style={{ flex: "2" }} /> {/* Adjust styles as needed */}
    </div>
  );
}
