-- Displaying how many goals each player scored


SELECT Full_Name, Goals_Scored from
Users INNER JOIN
(SELECT Goals.User_ID, count(*) as Goals_Scored
from Goals
group by User_ID) AS T1 on Users.User_ID=T1.User_ID
order by Goals_Scored DESC;