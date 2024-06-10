
-- SELECT top 3  Games.Game_ID, Games.Day, Games.Date, Games.Start_Time, Games.Location,
--  Games_with_winner.Home_Team_Name, Games_with_winner.Home_Team_Goals, Games_with_winner.Away_Team_Name, Games_with_winner.Away_Team_Goals
--  from Games_with_winner 
--  inner join games on Games.Game_ID=Games_with_winner.Game_ID;



SELECT T1.Team_ID, T1.Team_Name, T1.Total_Games, win_count as Total_Wins, total_goals
FROM 
-- amount of games played for each group:
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

-- amount of goals scored for each team
(SELECT Goals.Team_ID, count(*) as total_goals
from Goals
group by Team_ID) AS T3 on T1.Team_ID = T3.Team_ID;


