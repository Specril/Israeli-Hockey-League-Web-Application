CREATE VIEW Teams_stats_all_leagues AS 

SELECT T6.League_ID,T1.Team_ID,T1.Team_Name AS שם_הקבוצה, COALESCE(T1.Total_Games,0) AS משחקים , (3*COALESCE(win_count,0)+COALESCE(tie_count,0)) AS נקודות, 
COALESCE(win_count,0) as נצחונות, COALESCE(tie_count,0) as תיקו, 
(COALESCE(T1.Total_Games,0) - COALESCE(win_count,0) - COALESCE(tie_count,0)) AS הפסדים,
COALESCE(total_goals,0) AS שערי_זכות, COALESCE(rivals_goals,0) AS שערי_חובה, (COALESCE(total_goals,0)-COALESCE(rivals_goals,0)) AS הפרש
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
AS T6 on T1.Team_ID = T6.Team_ID;




