-- Displaying how many penalties each player got

SELECT Full_Name, Penalties_got from
Users INNER JOIN
(SELECT Penalties.User_ID, count(*) as Penalties_got
from Penalties
group by User_ID) AS T1 on Users.User_ID=T1.User_ID
order by Penalties_got DESC;