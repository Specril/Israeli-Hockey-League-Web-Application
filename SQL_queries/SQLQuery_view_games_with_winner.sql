
ALTER VIEW Games_with_winner AS
SELECT 
    g.Game_ID,
    g.League_ID,
    ht.Team_ID As Home_Team_ID,
    ht.Team_Name AS Home_Team_Name,
    COALESCE(ht_goals.Goals_Scored, 0) AS Home_Team_Goals,
    at.Team_ID AS Away_Team_ID,
    at.Team_Name AS Away_Team_Name,
    g.Day,
    g.Date,
    g.Start_Time,
    g.Location,
    g.Location_ID,
    g.Referee_ID,
    g.Second_Referee_ID,
    COALESCE(at_goals.Goals_Scored, 0) AS Away_Team_Goals,
    CASE 
        WHEN COALESCE(ht_goals.Goals_Scored, 0) > COALESCE(at_goals.Goals_Scored, 0) THEN Home_Team_ID
        WHEN COALESCE(ht_goals.Goals_Scored, 0) < COALESCE(at_goals.Goals_Scored, 0) THEN Away_Team_ID
        ELSE 0
    END AS Winner_ID
FROM 
    Games g
LEFT JOIN 
    Teams ht ON g.Home_Team_ID = ht.Team_ID
LEFT JOIN 
    Teams at ON g.Away_Team_ID = at.Team_ID
LEFT JOIN (
    SELECT 
        Game_ID,
        Team_ID,
        COUNT(Goal_ID) AS Goals_Scored
    FROM 
        Goals
    GROUP BY 
        Game_ID, Team_ID
) ht_goals ON g.Game_ID = ht_goals.Game_ID AND g.Home_Team_ID = ht_goals.Team_ID
LEFT JOIN (
    SELECT 
        Game_ID,
        Team_ID,
        COUNT(Goal_ID) AS Goals_Scored
    FROM 
        Goals
    GROUP BY 
        Game_ID, Team_ID
) at_goals ON g.Game_ID = at_goals.Game_ID AND g.Away_Team_ID = at_goals.Team_ID;
