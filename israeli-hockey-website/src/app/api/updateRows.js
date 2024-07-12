const { Connection, Request, TYPES } = require("tedious");

// Database credentials
const DB_USER = "IsraeliHockeyLeague";
const DB_PASSWORD = "ZivCool69";
const DB_SERVER = "hockey-il-server.database.windows.net";
const DB_NAME = "Hockey League DB v2";


// Connection configuration
const config = {
  authentication: {
    options: {
      userName: DB_USER,
      password: DB_PASSWORD,
    },
    type: "default",
  },
  server: DB_SERVER,
  options: {
    database: DB_NAME,
    encrypt: true, // Use encryption
    trustServerCertificate: true, // Change this based on your security requirements
  },
};

async function updateData(query, params) {
  return new Promise((resolve, reject) => {
    const connection = new Connection(config);

    connection.on("connect", (err) => {
      if (err) {
        console.error("Connection failed:", err);
        reject(err);
      } else {
        console.log("Connected to database");
        executeUpdate(query, params);
      }
    });

    function executeUpdate(query, params) {
      const request = new Request(query, (err, rowCount) => {
        if (err) {
          console.error("Query execution failed:", err);
          reject(err);
        } else {
          console.log(`Query executed successfully. Rows affected: ${rowCount}`);
          resolve(rowCount);
        }
        connection.close();
      });

      params.forEach((param) => {
        request.addParameter(param.name, param.type, param.value);
      });

      connection.execSql(request);
    }

    connection.connect();
  });
}

module.exports = updateData;


// const updateData = require("../api/updateRows");
async function fetchIds(query) {
  let gamesIds = [];
  try {
    gamesIds = await fetchRows(() => query);
  } catch (error) {
    console.error("Error fetching ids:", error);
  }
  return gamesIds;
}

// Table Games:
// insert:
const query_get_games_ids = `SELECT Game_ID from Games;`;
const addGameQuery = `INSERT INTO Games (Game_ID, League_ID, Home_Team_ID, Away_Team_ID, Day, Date, Start_Time, Location, Location_ID, Referee_ID, Second_Referee_ID)
  VALUES (@Game_ID, @League_ID, @Home_Team_ID, @Away_Team_ID, @Day, @Date, @Start_Time, @Location, @Location_ID, @Referee_ID, @Second_Referee_ID)`;

async function getAddGameParams(values) {
  const gamesIds = await fetchIds(query_get_games_ids);
  const lastGameId = gamesIds[gamesIds.length -1]['Game_ID']
  const params = [
    { name: 'Game_ID', type: TYPES.Int, value: lastGameId + 1 },
    { name: 'League_ID', type: TYPES.Int, value: values[0] },
    { name: 'Home_Team_ID', type: TYPES.Int, value: values[1] },
    { name: 'Away_Team_ID', type: TYPES.Int, value: values[2] },
    { name: 'Day', type: TYPES.NVarChar, value: values[3] },
    { name: 'Date', type: TYPES.DateTime, value: new Date(values[4]) },
    { name: 'Start_Time', type: TYPES.Time, value: new Date(values[5]) },
    { name: 'Location', type: TYPES.NVarChar, value: values[6] },
    { name: 'Location_ID', type: TYPES.Int, value: values[7] },
    { name: 'Referee_ID', type: TYPES.Int, value: values[8] },
    { name: 'Second_Referee_ID', type: TYPES.Int, value: values[9] },
  ];
  return params;
}

// delete:
const deleteGameQuery = `DELETE FROM Games WHERE Game_ID = @Game_ID;`;
async function getDeleteGameParams(gameId) {
  const params = [
    { name: 'Game_ID', type: TYPES.Int, value: gameId },
  ];
  return params;
}

// update:
const updateGameQuery = `UPDATE Games SET League_ID = @League_ID, Home_Team_ID = @Home_Team_ID, Away_Team_ID = @Away_Team_ID, Day = @Day, Date = @Date, Start_Time = @Start_Time, Location = @Location, Location_ID = @Location_ID, Referee_ID = @Referee_ID, Second_Referee_ID = @Second_Referee_ID WHERE Game_ID = @Game_ID`;
async function getUpdateGameParams(values) {
  const params = [
    { name: 'Game_ID', type: TYPES.Int, value: values[0] },
    { name: 'League_ID', type: TYPES.Int, value: values[1] },
    { name: 'Home_Team_ID', type: TYPES.Int, value: values[2] },
    { name: 'Away_Team_ID', type: TYPES.Int, value: values[3] },
    { name: 'Day', type: TYPES.NVarChar, value: values[4] },
    { name: 'Date', type: TYPES.DateTime, value: new Date(values[5]) },
    { name: 'Start_Time', type: TYPES.Time, value: new Date(values[6]) },
    { name: 'Location', type: TYPES.NVarChar, value: values[7] },
    { name: 'Location_ID', type: TYPES.Int, value: values[8] },
    { name: 'Referee_ID', type: TYPES.Int, value: values[9] },
    { name: 'Second_Referee_ID', type: TYPES.Int, value: values[10] },
  ];
  return params;
}

let values = [] // all the values of the row you want to insert
const updateGameParams = await getUpdateGameParams(values);
await updateData(updateGameQuery, updateGameParams);


// Table Users:
// insert:
const query_get_users_ids = `SELECT User_ID from Games;`;
const addUserQuery = `INSERT INTO Users (User_ID, Full_Name, Date_of_Birth, Phone, Email)
  VALUES (@User_ID, @Full_Name, @Date_of_Birth, @Phone, @Email`;

async function getAddUserParams(values) {
  const gamesIds = await fetchIds(query_get_users_ids);
  const lastUserId = gamesIds[gamesIds.length -1]['User_ID']
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserId + 1 },
    { name: 'Full_Name', type: TYPES.NVarChar, value: values[0] },
    { name: 'Date_of_Birth', type: TYPES.DateTime, value: new Date(values[1]) },
    { name: 'Phone', type: TYPES.NVarChar, value: values[2] },
    { name: 'Email', type: TYPES.VarChar, value: values[3] }
  ];
  return params;
}

// delete:
const deleteUsersQuery = `DELETE FROM Users WHERE User_ID = @User_ID;`;
async function getDeleteUsersParams(userId) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: userId },
  ];
  return params;
}

// update:
const updateUserQuery = `UPDATE Users SET Full_Name = @Full_Name, Date_of_Birth = @Date_of_Birth, Phone = @Phone, Email = @Email WHERE User_ID = @User_ID`;
async function getUpdateUserParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Full_Name', type: TYPES.Int, value: values[1] },
    { name: 'Date_of_Birth', type: TYPES.Int, value: values[2] },
    { name: 'Phone', type: TYPES.NVarChar, value: values[3] },
    { name: 'Email', type: TYPES.VarChar, value: values[4] }
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateUserParams = await getUpdateUserParams(values);
await updateData(updateUserQuery, updateUserParams);



// Table UsersReferees:
// insert:
const query_get_users_referees_ids = `SELECT User_ID from UsersReferees;`;
const addUserRefereeQuery = `INSERT INTO UsersReferees (User_ID, Date_Created, Experience)
  VALUES (@User_ID, @Date_Created, @Experience`;

async function getAddUsersRefereesParams(values) {
  const usersRefereesIds = await fetchIds(query_get_users_referees_ids);
  const lastUserRefereeId = usersRefereesIds[usersRefereesIds.length -1]['User_ID']
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserRefereeId + 1 },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values[0]) },
    { name: 'Experience', type: TYPES.NVarChar, value: values[1] }
  ];
  return params;
}

// delete:
const deleteUsersRefereesQuery = `DELETE FROM UsersReferees WHERE User_ID = @User_ID;`;
async function getDeleteUsersRefereesParams(userId) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: userId },
  ];
  return params;
}

// update:
const updateUserRefereesQuery = `UPDATE UsersReferees SET Date_Created = @Date_Created, Experience = @Experience WHERE User_ID = @User_ID`;
async function getUpdateUserRefereesParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserRefereeId + 1 },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values[0]) },
    { name: 'Experience', type: TYPES.NVarChar, value: values[1] }
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateUserRefereesParams = await getUpdateUserRefereesParams(values);
await updateData(updateUserRefereesQuery, updateUserRefereesParams);


// Table UsersPlayers:
// insert:
const query_get_users_players_ids = `SELECT User_ID from UsersPlayers;`;
const addUserPlayersQuery = `INSERT INTO UsersPlayers (User_ID, Date_Created, Experience, Residence)
  VALUES (@User_ID, @Date_Created, @Experience, @Residence`;

async function getAddUsersPlayersParams(values) {
  const usersPlayersIds = await fetchIds(query_get_users_players_ids);
  const lastUserPlayersId = usersPlayersIds[usersPlayersIds.length -1]['User_ID']
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserPlayersId + 1 },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values[0]) },
    { name: 'Experience', type: TYPES.NVarChar, value: values[1] },
    { name: 'Residence', type: TYPES.NVarChar, value: values[2] }
  ];
  return params;
}

// delete:
const deleteUsersPlayersQuery = `DELETE FROM UsersPlayers WHERE User_ID = @User_ID;`;
async function getDeleteUsersPlayersParams(userId) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: userId },
  ];
  return params;
}

// update:
const updateUsersPlayersQuery = `UPDATE UsersPlayers SET Date_Created = @Date_Created, Experience = @Experience AND Residence = @Residence WHERE User_ID = @User_ID`;
async function getUpdateUserPlayersParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserRefereeId + 1 },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values[0]) },
    { name: 'Experience', type: TYPES.NVarChar, value: values[1] },
    { name: 'Residence', type: TYPES.NVarChar, value: values[2] }

  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateUserPlayersParams = await getUpdateUserPlayersParams(values);
await updateData(updateUsersPlayersQuery, updateUserPlayersParams);



// Table UsersFans:
// insert:
const query_get_users_fans_ids = `SELECT User_ID from UsersFans;`;
const addUserFansQuery = `INSERT INTO UsersFans (User_ID, Email, Full_Name, Date_Created, Date_of_Birth)
  VALUES (@User_ID, @Email, @Full_Name, @Date_Created, @Date_of_Birth`;

async function getAddUsersFansParams(values) {
  const usersFansIds = await fetchIds(query_get_users_fans_ids);
  const lastUserFansId = usersFansIds[usersFansIds.length -1]['User_ID']
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserFansId + 1 },
    { name: 'Email', type: TYPES.VarChar, value: values[0] },
    { name: 'Full_Name', type: TYPES.NVarChar, value: values[1] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values[2]) },
     {name: 'Date_of_Birth', type: TYPES.DateTime, value: new Date(values[3]) },
  ];
  return params;
}

// delete:
const deleteUsersFansQuery = `DELETE FROM UsersFans WHERE User_ID = @User_ID;`;
async function getDeleteUsersFansParams(userId) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: userId },
  ];
  return params;
}

// update:
const updateUsersFansQuery = `UPDATE UsersFans SET Email = @Email, Full_Name = @Full_Name AND Date_Created = @Date_Created AND Date_of_Birth = @Date_of_Birth WHERE User_ID = @User_ID`;
async function getUpdateUserFansParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserFansId + 1 },
    { name: 'Email', type: TYPES.VarChar, value: values[0] },
    { name: 'Full_Name', type: TYPES.NVarChar, value: values[1] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values[2]) },
     {name: 'Date_of_Birth', type: TYPES.DateTime, value: new Date(values[3]) },
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateUserFansParams = await getUpdateUserFansParams(values);
await updateData(updateUsersFansQuery, updateUserFansParams);



// Table UsersCoaches:
// insert:
const query_get_users_coaches_ids = `SELECT User_ID from UsersCoaches;`;
const addUserCoachesQuery = `INSERT INTO UsersCoaches (User_ID, Date_Created, Role, Experience)
  VALUES (@User_ID, @Date_Created, @Role, @Experience`;

async function getAddUsersCoachesParams(values) {
  const usersCoachesIds = await fetchIds(query_get_users_coaches_ids);
  const lastUserCoachesId = usersCoachesIds[usersCoachesIds.length -1]['User_ID']
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserCoachesId + 1 },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values[0]) },
    { name: 'Role', type: TYPES.NVarChar, value: values[1] },
    { name: 'Experience', type: TYPES.NVarChar, value: values[2] },
  ];
  return params;
}

// delete:
const deleteUsersCoachesQuery = `DELETE FROM UsersCoaches WHERE User_ID = @User_ID;`;
async function getDeleteUsersCoachesParams(userId) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: userId },
  ];
  return params;
}

// update:
const updateUsersCoachesQuery = `UPDATE UsersCoaches SET Date_Created = @Date_Created, Role = @Role, Experience = @Experience WHERE User_ID = @User_ID`;
async function getUpdateUserCoachesParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserCoachesId + 1 },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values[0]) },
    { name: 'Role', type: TYPES.NVarChar, value: values[1] },
    { name: 'Experience', type: TYPES.NVarChar, value: values[2] },
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateUserCoachesParams = await getUpdateUserCoachesParams(values);
await updateData(updateUsersCoachesQuery, updateUserCoachesParams);


// Table PlayersInTeams
// insert
const addPlayersInTeamsQuery = `INSERT INTO PlayersInTeams (User_ID, Team_ID, Position, Shirt_Number)
  VALUES (@User_ID, @Team_ID, @Position, @Shirt_Number)`;

async function getAddPlayersInTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] },
    { name: 'Position', type: TYPES.NVarChar, value: values[2] },
    { name: 'Shirt_Number', type: TYPES.Int, value: values[3] }
  ];
  return params;
}

// delete
const deletePlayersInTeamsQuery = `DELETE FROM PlayersInTeams WHERE User_ID = @User_ID AND Team_ID = @Team_ID;`;
async function getDeletePlayersInTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] }
  ];
  return params;
}

// update
const updatePlayersInTeamsQuery = `UPDATE PlayersInTeams SET Team_ID = @Team_ID, Position = @Position, Shirt_Number = @Shirt_Number WHERE User_ID = @User_ID`;
async function getUpdatePlayersInTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] },
    { name: 'Position', type: TYPES.NVarChar, value: values[2] },
    { name: 'Shirt_Number', type: TYPES.Int, value: values[3] }
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updatePlayersInTeamsParams = await getUpdatePlayersInTeamsParams(values);
await updateData(updatePlayersInTeamsQuery, updatePlayersInTeamsParams);


// Table FansOfTeams
// insert
const addFansOfTeamsQuery = `INSERT INTO FansOfTeams (User_ID, Team_ID)
  VALUES (@User_ID, @Team_ID)`;

async function getAddFansOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] },
  ];
  return params;
}

//delete
const deleteFansOfTeamsQuery = `DELETE FROM FansOfTeams WHERE User_ID = @User_ID AND Team_ID = @Team_ID;`;
async function getDeleteFansOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] }
  ];
  return params;
}

// update
const updateFansOfTeamsQuery = `UPDATE FansOfInTeams SET Team_ID = @Team_ID WHERE User_ID = @User_ID`;
async function getUpdateFansOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] }
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateFansOfTeamsParams = await getUpdateFansOfTeamsParams(values);
await updateData(updateFansOfTeamsQuery, updateFansOfTeamsParams);


// Table CoachesOfInTeams
// insert
const addCoachesOfTeamsQuery = `INSERT INTO CoachesOfTeams (User_ID, Team_ID)
  VALUES (@User_ID, @Team_ID)`;

async function getAddCoachesOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] },
  ];
  return params;
}

// delete
const deleteCoachesOfTeamsQuery = `DELETE FROM CoachesOfTeams WHERE User_ID = @User_ID AND Team_ID = @Team_ID;`;
async function getDeleteCoachesOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] }
  ];
  return params;
}

// update
const updateCoachesOfTeamsQuery = `UPDATE CoachesOfInTeams SET Team_ID = @Team_ID WHERE User_ID = @User_ID`;
async function getUpdateCoachesOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_ID', type: TYPES.Int, value: values[1] }
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateCoachesOfTeamsParams = await getUpdateCoachesOfTeamsParams(values);
await updateData(updateCoachesOfTeamsQuery, updateCoachesOfTeamsParams);


// Table League
// insert
const addLeagueQuery = `INSERT INTO League (League_ID, League_Name, League_Type)
  VALUES (@League_ID, @League_Name, @League_Type)`;

const query_get_leagues_ids = `SELECT League_ID from League;`;
async function getAddLeagueParams(values) {
  const leagueIds = await fetchIds(query_get_leagues_ids);
  const lastLeagueId = leagueIds[leagueIds.length -1]['League_ID']
  const params = [
    { name: 'League_ID', type: TYPES.Int, value: lastLeagueId + 1 },
    { name: 'League_Name', type: TYPES.NVarChar, value: values[0] },
    { name: 'League_Type', type: TYPES.NVarChar, value: values[1] }
  ];
  return params;
}

// delete
const deleteLeagueQuery = `DELETE FROM League WHERE League_ID = @League_ID;`;
async function getDeleteLeagueParams(values) {
  const params = [
    { name: 'League_ID', type: TYPES.Int, value: values[0] }
  ];
  return params;
}

// update
const updateLeagueQuery = `UPDATE League SET League_Name = @League_Name AND League_Type = @League_Type WHERE League_ID = @League_ID`;
async function getUpdateLeagueParams(values) {
  const params = [
    { name: 'League_ID', type: TYPES.Int, value: values[0] },
    { name: 'League_Name', type: TYPES.NVarChar, value: values[1] },
    { name: 'League_Type', type: TYPES.NVarChar, value: values[2] }
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateLeagueParams = await getUpdateLeagueParams(values);
await updateData(updateLeagueQuery, updateLeagueParams);


// Table Penalties
// insert
const addPenaltyQuery = `INSERT INTO Penalties (Penalty_ID, Game_ID, User_ID, Time_Stamp, Team_ID)
  VALUES (@Penalty_ID, @Game_ID, @User_ID, @Time_Stamp, @Team_ID)`;

const query_get_penalties_ids = `SELECT League_ID from League;`;
async function getAddPenaltyParams(values) {
  const penaltiesIds = await fetchIds(query_get_penalties_ids);
  const lastPenaltyId = penaltiesIds[penaltiesIds.length -1]['Penalty_ID']
  const params = [
    { name: 'Penalty_ID', type: TYPES.Int, value: lastPenaltyId + 1 },
    { name: 'Game_ID', type: TYPES.Int, value: values[0] },
    { name: 'User_ID', type: TYPES.Int, value: values[1] },
    { name: 'Time_Stamp', type: TYPES.Time, value: values[2] },
    { name: 'Team_ID', type: TYPES.Int, value: values[3] },
  ];
  return params;
}

// delete
const deletePenaltyQuery = `DELETE FROM Penalties WHERE Penalty_ID = @Penalty_ID`;
async function getDeletePenaltyParams(values) {
  const params = [
    { name: 'Penalty_ID', type: TYPES.Int, value: values[0] }
  ];
  return params;
}

// update
const updatePenaltyQuery = `UPDATE Penalties SET Game_ID = @Game_ID AND User_ID = @User_ID AND Time_Stamp = @Time_Stamp AND Team_ID = @Team_ID WHERE Penalty_ID = @Penalty_ID`;
async function getUpdatePenaltyParams(values) {
  const params = [
    { name: 'Penalty_ID', type: TYPES.Int, value: values[0] },
    { name: 'Game_ID', type: TYPES.Int, value: values[1] },
    { name: 'User_ID', type: TYPES.Int, value: values[2] },
    { name: 'Time_Stamp', type: TYPES.Time, value: values[3] },
    { name: 'Team_ID', type: TYPES.Int, value: values[4] },
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updatePenaltyParams = await getUpdatePenaltyParams(values);
await updateData(updatePenaltyQuery, updatePenaltyParams);


// Table Teams
// insert
const addTeamQuery = `INSERT INTO Teams (Team_ID, Team_Name, Rank, Location_ID, League_ID)
  VALUES (@Team_ID, @Team_Name, @Rank, @Location_ID, @League_ID)`;

const query_get_team_ids = `SELECT Team_ID from Teams;`;
async function getAddTeamParams(values) {
  const teamsIds = await fetchIds(query_get_team_ids);
  const lastTeamId = teamsIds[teamsIds.length -1]['Team_ID']
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: lastTeamId + 1 },
    { name: 'Team_Name', type: TYPES.NVarChar, value: values[0] },
    { name: 'Rank', type: TYPES.Int, value: values[1] },
    { name: 'Location_ID', type: TYPES.Int, value: values[2] },
    { name: 'League_ID', type: TYPES.Int, value: values[3] },
  ];
  return params;
}

// delete
const deleteTeamQuery = `DELETE FROM Teams WHERE Team_ID = @Team_ID`;
async function getDeleteTeamParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values[0] }
  ];
  return params;
}

// update
const updateTeamQuery = `UPDATE Teams SET Team_Name = @Team_Name AND Rank = @Rank AND Location_ID = @Location_ID AND League_ID = @League_ID WHERE Team_ID = @Team_ID`;
async function getUpdateTeamParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values[0] },
    { name: 'Team_Name', type: TYPES.NVarChar, value: values[1] },
    { name: 'Rank', type: TYPES.Int, value: values[2] },
    { name: 'Location_ID', type: TYPES.Int, value: values[3] },
    { name: 'League_ID', type: TYPES.Int, value: values[4] },
  ];
  return params;
}
values = [] // all the values of the row you want to insert
const updateTeamParams = await getUpdateTeamParams(values);
await updateData(updateTeamQuery, updateTeamParams);



// Table TeamsInLeagues
// insert
const addTeamsInLeaguesQuery = `INSERT INTO TeamsInLeagues (Team_ID, League_ID)
  VALUES (@Team_ID, @League_ID)`;

const query_get_team_in_league_ids = `SELECT Team_ID from TeamsInLeagues;`;
async function getAddTeamInLeaguesParams(values) {
  const teamInLeaguesIds = await fetchIds(query_get_team_in_league_ids);
  const lastTeamInLeaguesId = teamInLeaguesIds[teamInLeaguesIds.length -1]['Team_ID']
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: lastTeamInLeaguesId + 1 },
    { name: 'League_ID', type: TYPES.Int, value: values[0] },
  ];
  return params;
}

// delete
const deleteTeamInLeaguesQuery = `DELETE FROM TeamsInLeagues WHERE Team_ID = @Team_ID`;
async function getDeleteTeamInLeaguesParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values[0] }
  ];
  return params;
}

// update
const updateTeamInLeaguesQuery = `UPDATE TeamsInLeagues SET League_ID = @League_ID WHERE Team_ID = @Team_ID`;
async function getUpdateTeamInLeaguesParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values[0] },
    { name: 'League_ID', type: TYPES.Int, value: values[1] }
  ];
  return params;
}
values = [] // all the values of the row you want to insert
const updateTeamInLeaguesParams = await getUpdateTeamInLeaguesParams(values);
await updateData(updateTeamInLeaguesQuery, updateTeamInLeaguesParams);


// Table Goals:
// insert:
const query_get_goals_ids = `SELECT Goal_ID from Goals;`;
const addGoalQuery = `INSERT INTO Goals (Goal_ID, Game_ID, User_ID, Team_ID, Time_Stamp)
  VALUES (@Goal_ID, @Game_ID, @User_ID, @Team_ID, @Time_Stamp)`;

async function getAddGoalParams(values) {
  const goalsIds = await fetchIds(query_get_goals_ids);
  const lastGoalId = goalsIds[goalsIds.length -1]['Goal_ID']
  const params = [
    { name: 'Goal_ID', type: TYPES.Int, value: lastGoalId + 1 },
    { name: 'Game_ID', type: TYPES.Int, value: values[0] },
    { name: 'User_ID', type: TYPES.Int, value: values[1] },
    { name: 'Team_ID', type: TYPES.Int, value: values[2] },
    { name: 'Time_Stamp', type: TYPES.DateTime, value: new Date(values[3]) }
  ];
  return params;
}
// delete:
const deleteGoalQuery = `DELETE FROM Goals WHERE Goal_ID = @Goal_ID;`;
async function getDeleteGoalParams(gameId) {
  const params = [
    { name: 'Goal_ID', type: TYPES.Int, value: gameId },
  ];
  return params;
}
// update:
const updateGoalQuery = `UPDATE Goals SET Game_ID = @Game_ID, User_ID = @User_ID, Team_ID = @Team_ID, Time_Stamp = @Time_Stamp WHERE Goal_ID = @Goal_ID`;
async function getUpdateGoalParams(values) {
  const params = [
    { name: 'Goal_ID', type: TYPES.Int, value: values[0]  },
    { name: 'Game_ID', type: TYPES.Int, value: values[1] },
    { name: 'User_ID', type: TYPES.Int, value: values[2] },
    { name: 'Team_ID', type: TYPES.Int, value: values[3] },
    { name: 'Time_Stamp', type: TYPES.DateTime, value: new Date(values[4]) }
  ];
  return params;
}

values = [] // all the values of the row you want to insert
const updateGoalParams = await getUpdateGoalParams(values);
await updateData(updateGoalQuery, updateGoalParams);



// Table Locations
// insert
const addLocationQuery = `INSERT INTO Locations (Location_ID, Location_Name)
  VALUES (@Location_ID, @Location_Name)`;

const query_get_location_ids = `SELECT Location_ID from Locations;`;
async function getAddTeamParams(values) {
  const locationsIds = await fetchIds(query_get_location_ids);
  const lastLocationId = locationsIds[locationsIds.length -1]['Location_ID']
  const params = [
    { name: 'Location_ID', type: TYPES.Int, value: lastLocationId + 1 },
    { name: 'Location_Name', type: TYPES.NVarChar, value: values[0] }
  ];
  return params;
}

// delete
const deleteLocationQuery = `DELETE FROM Location WHERE Location_ID = @Location_ID`;
async function getDeleteLocationParams(values) {
  const params = [
    { name: 'Location_ID', type: TYPES.Int, value: values[0] }
  ];
  return params;
}

// update
const updateLocationQuery = `UPDATE Location SET Location_Name = @Location_Name WHERE Location_ID = @Location_ID`;
async function getUpdateLocationParams(values) {
  const params = [
    { name: 'Location_ID', type: TYPES.Int, value: values[0] },
    { name: 'Location_Name', type: TYPES.NVarChar, value: values[1] }
  ];
  return params;
}
values = [] // all the values of the row you want to insert
const updateLocationParams = await getUpdateLocationParams(values);
await updateData(updateLocationQuery, updateLocationParams);