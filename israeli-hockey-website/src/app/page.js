import React from "react";
import PremierLeagueTable from "./MainCard";
import CarouselComponent from "./MainCarousel";
import MainCardUpcomingGames from "./MainCardUpcomingGames";

const fetchRows = require("./api/fetchRows");
const query_team_statistics = `
SELECT 
    T1.Team_Name AS 'שם הקבוצה', 
    COALESCE(T7.Photo, '') AS Logo,
    COALESCE(T1.Total_Games, 0) AS משחקים, 
    (3 * COALESCE(T2.win_count, 0) + COALESCE(T3.tie_count, 0)) AS נקודות, 
    (COALESCE(T4.total_goals, 0) - COALESCE(T5.rivals_goals, 0)) AS הפרש
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
    WHERE
        Teams.Age = N'בוגרים'
    GROUP BY 
        Teams.Team_ID, 
        Teams.Team_Name
    ) AS T1
LEFT JOIN
    (SELECT 
        Winner_ID, 
        COUNT(*) AS win_count
    FROM 
        Games_with_winner 
    WHERE 
        Winner_ID != 0
    GROUP BY
        Winner_ID
    ) AS T2 ON T1.Team_ID = T2.Winner_ID
LEFT JOIN
    (SELECT 
        Team_ID, 
        COUNT(*) AS tie_count
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
    ) AS T3 ON T1.Team_ID = T3.Team_ID
LEFT JOIN
    (SELECT 
        Goals.Team_ID, 
        COUNT(*) AS total_goals
    FROM 
        Goals
    GROUP BY 
        Goals.Team_ID
    ) AS T4 ON T1.Team_ID = T4.Team_ID
LEFT JOIN 
    (SELECT 
        home_team_id AS Team_ID, 
        SUM(away_team_goals) AS rivals_goals 
    FROM 
        games_with_winner 
    GROUP BY 
        home_team_id
    ) AS T5 ON T1.Team_ID = T5.Team_ID
LEFT JOIN
    (SELECT 
        Team_ID, 
        Photo 
    FROM 
        TeamsLogos
    ) AS T7 ON T1.Team_ID = T7.Team_ID
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
;
`;

const query_photos = `
SELECT Photo
FROM Photos`


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
  
  async function dataFetchPhotos() {
    let photosData = [];
    try {
      photosData = await fetchRows(() => query_photos);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
    return photosData;
  }
  
  export default async function Home() {
    const data_statistics = await dataFetchStatistics();
    const data_upcoming = await dataFetchUpcoming();
    const data_photos = await dataFetchPhotos();
    console.log("Fetched Photos Data:", data_photos);
  
    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: '0px', width: '100%' }}>
          <div style={{ flex: '3', marginRight: '10px' }}>
            <PremierLeagueTable data={data_statistics} name={"סטטיסטיקות קבוצתיות"} />
          </div>
          <div style={{ flex: '2', marginRight: '0px' }}>
            <CarouselComponent data={data_photos} style={{ height: '100%' }} />
          </div>
          <div style={{ flex: '2' }}>
            <MainCardUpcomingGames data={data_upcoming} name={"משחקים קרובים"} />
          </div>
        </div>
      );
    };
      
