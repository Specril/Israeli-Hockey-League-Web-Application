
-- Displaying teams' players: their name, position and shirt number
SELECT  Teams.Team_Name,  Users.Full_Name, PlayersInTeams.Position, PlayersInTeams.Shirt_Number
FROM Users inner join PlayersInTeams on PlayersInTeams.User_ID = Users.User_ID
RIGHT join Teams on Teams.Team_ID=PlayersInTeams.Team_ID
WHERE Teams.Team_ID=3; 
-- לא עובד לפי שם קבוצה