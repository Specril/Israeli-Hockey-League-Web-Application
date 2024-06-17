
SELECT Home_Team_Name AS "קבוצת בית", Away_Team_Name AS "קבוצת חוץ", Day AS "יום", Date AS "תאריך", Start_Time AS "זמן התחלה", Location AS "מיקום", First_referee AS "שופט 1", Users.Full_Name as "שופט 2"
FROM
(Select Home_Team_ID, Home_Team_Name, Away_Team_ID, Teams.Team_Name as Away_Team_Name, Day, Date, Start_Time, Location, Second_Referee_ID, Referee_ID,Users.Full_Name As First_referee From

(SELECT Game_ID, Games.League_ID, Home_Team_ID, Team_Name As Home_Team_Name, Away_Team_ID, Day,Date,Start_Time,Location,Second_Referee_ID, Referee_ID from Games 
INNER JOIN Teams ON Home_Team_ID = Team_ID
WHERE Date>CURRENT_TIMESTAMP AND Games.League_ID = 1) AS T1
INNER JOIN 
Teams ON Away_Team_ID = Team_ID
INNER JOIN Users 
On Referee_ID=user_ID) AS outer_table
inner JOIN Users
ON Second_Referee_ID=User_ID;