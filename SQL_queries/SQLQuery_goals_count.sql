-- Displaying how many goals each player scored


SELECT Full_Name AS "שם_השחקן", "כמות_גולים" from
Users INNER JOIN
(SELECT Goals.User_ID, count(*) as "כמות_גולים"
from Goals
group by User_ID) AS T1 on Users.User_ID=T1.User_ID
order by "כמות_גולים" DESC;