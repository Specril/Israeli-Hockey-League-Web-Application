const { Connection, Request, TYPES } = require("tedious");
const fetchRows = require("../api/fetchRows");
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

export async function updateData(query, params) {
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


export async function fetchIds(query) {
  let Ids = [];
  try {
    Ids = await fetchRows(() => query);
  } catch (error) {
    console.error("Error fetching ids:", error);
  }
  return Ids;
}

// Table Games:
// insert:
export const query_get_games_ids = `SELECT Game_ID from Games;`;
export const addGameQuery = `INSERT INTO Games (Game_ID, League_ID, Home_Team_ID, Away_Team_ID, Day, Date, Start_Time, Location, Location_ID, Referee_ID, Second_Referee_ID)
  VALUES (@Game_ID, @League_ID, @Home_Team_ID, @Away_Team_ID, @Day, @Date, @Start_Time, @Location, @Location_ID, @Referee_ID, @Second_Referee_ID)`;

export async function getAddGameParams(values) {
  const gamesIds = await fetchIds(query_get_games_ids);
  const lastGameId = gamesIds[gamesIds.length -1]['Game_ID']
  const params = [
    { name: 'Game_ID', type: TYPES.Int, value: lastGameId + 1 },
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] },
    { name: 'Home_Team_ID', type: TYPES.Int, value: values['Home_Team_ID'] },
    { name: 'Away_Team_ID', type: TYPES.Int, value: values['Away_Team_ID'] },
    { name: 'Day', type: TYPES.NVarChar, value: values['Day'] },
    { name: 'Date', type: TYPES.DateTime, value: new Date(values['Date']) },
    { name: 'Start_Time', type: TYPES.Time, value: new Date(values['Start_Time']) },
    { name: 'Location', type: TYPES.NVarChar, value: values['Location'] },
    { name: 'Location_ID', type: TYPES.Int, value: values['Location_ID'] },
    { name: 'Referee_ID', type: TYPES.Int, value: values['Referee_ID'] },
    { name: 'Second_Referee_ID', type: TYPES.Int, value: values['Second_Referee_ID'] },
  ];
  return params;
}

// delete:
export const deleteGameQuery = `DELETE FROM Games WHERE Game_ID = @Game_ID;`;
export async function getDeleteGameParams(values) {
  const params = [
    { name: 'Game_ID', type: TYPES.Int, value: values['Game_ID'] },
  ];
  return params;
}

// update:
export const updateGameQuery = `UPDATE Games SET League_ID = @League_ID, Home_Team_ID = @Home_Team_ID, Away_Team_ID = @Away_Team_ID, Day = @Day, Date = @Date, Start_Time = @Start_Time, Location = @Location, Location_ID = @Location_ID, Referee_ID = @Referee_ID, Second_Referee_ID = @Second_Referee_ID WHERE Game_ID = @Game_ID`;
export async function getUpdateGameParams(values) {
  const params = [
    { name: 'Game_ID', type: TYPES.Int, value: values['Game_ID'] },
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] },
    { name: 'Home_Team_ID', type: TYPES.Int, value: values['Home_Team_ID'] },
    { name: 'Away_Team_ID', type: TYPES.Int, value: values['Away_Team_ID'] },
    { name: 'Day', type: TYPES.NVarChar, value: values['Day'] },
    { name: 'Date', type: TYPES.DateTime, value: new Date(values['Date']) },
    { name: 'Start_Time', type: TYPES.Time, value: new Date(values['Start_Time']) },
    { name: 'Location', type: TYPES.NVarChar, value: values['Location'] },
    { name: 'Location_ID', type: TYPES.Int, value: values['Location_ID'] },
    { name: 'Referee_ID', type: TYPES.Int, value: values['Referee_ID'] },
    { name: 'Second_Referee_ID', type: TYPES.Int, value: values['Second_Referee_ID'] },
  ];
  return params;
}


// Table Users:
// insert:
export const query_get_users_ids = `SELECT User_ID from Games;`;
export const addUserQuery = `INSERT INTO Users (User_ID, Full_Name, Date_of_Birth, Phone, Email)
  VALUES (@User_ID, @Full_Name, @Date_of_Birth, @Phone, @Email`;

export async function getAddUserParams(values) {
  const gamesIds = await fetchIds(query_get_users_ids);
  const lastUserId = gamesIds[gamesIds.length -1]['User_ID']
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: lastUserId + 1 },
    { name: 'Full_Name', type: TYPES.NVarChar, value: values['Full_Name'] },
    { name: 'Date_of_Birth', type: TYPES.DateTime, value: new Date(values['Date_of_Birth']) },
    { name: 'Phone', type: TYPES.NVarChar, value: values['Phone'] },
    { name: 'Email', type: TYPES.VarChar, value: values['Email'] }
  ];
  return params;
}

// delete:
export const deleteUsersQuery = `DELETE FROM Users WHERE User_ID = @User_ID;`;
export async function getDeleteUsersParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
  ];
  return params;
}

// update:
export const updateUserQuery = `UPDATE Users SET Full_Name = @Full_Name, Date_of_Birth = @Date_of_Birth, Phone = @Phone, Email = @Email WHERE User_ID = @User_ID`;
export async function getUpdateUserParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Full_Name', type: TYPES.NVarChar, value: values['Full_Name'] },
    { name: 'Date_of_Birth', type: TYPES.DateTime, value: new Date(values['Date_of_Birth']) },
    { name: 'Phone', type: TYPES.NVarChar, value: values['Phone'] },
    { name: 'Email', type: TYPES.VarChar, value: values['Email'] }
  ];
  return params;
}


// Table UsersReferees:
// insert:
export const addUserRefereeQuery = `INSERT INTO UsersReferees (User_ID, Date_Created, Experience)
  VALUES (@User_ID, @Date_Created, @Experience`;

export async function getAddUsersRefereesParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values['Date_Created']) },
    { name: 'Experience', type: TYPES.NVarChar, value: values['Experience'] }
  ];
  return params;
}

// delete:
export const deleteUsersRefereesQuery = `DELETE FROM UsersReferees WHERE User_ID = @User_ID;`;
export async function getDeleteUsersRefereesParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
  ];
  return params;
}

// update:
export const updateUserRefereesQuery = `UPDATE UsersReferees SET Date_Created = @Date_Created, Experience = @Experience WHERE User_ID = @User_ID`;
export async function getUpdateUserRefereesParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values['Date_Created']) },
    { name: 'Experience', type: TYPES.NVarChar, value: values['Experience'] }
  ];
  return params;
}


// Table UsersPlayers:
// insert:
export const addUserPlayersQuery = `INSERT INTO UsersPlayers (User_ID, Date_Created, Experience, Residence)
  VALUES (@User_ID, @Date_Created, @Experience, @Residence`;

export async function getAddUsersPlayersParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values['Date_Created']) },
    { name: 'Experience', type: TYPES.NVarChar, value: values['Experience'] },
    { name: 'Residence', type: TYPES.NVarChar, value: values['Residence'] }
  ];
  return params;
}

// delete:
export const deleteUsersPlayersQuery = `DELETE FROM UsersPlayers WHERE User_ID = @User_ID;`;
export async function getDeleteUsersPlayersParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
  ];
  return params;
}

// update:
export const updateUsersPlayersQuery = `UPDATE UsersPlayers SET Date_Created = @Date_Created, Experience = @Experience AND Residence = @Residence WHERE User_ID = @User_ID`;
export async function getUpdateUserPlayersParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values['Date_Created']) },
    { name: 'Experience', type: TYPES.NVarChar, value: values['Experience'] },
    { name: 'Residence', type: TYPES.NVarChar, value: values['Residence'] }
  ];
  return params;
}


// Table UsersFans:
// insert:
export const addUserFansQuery = `INSERT INTO UsersFans (User_ID, Email, Full_Name, Date_Created, Date_of_Birth)
  VALUES (@User_ID, @Email, @Full_Name, @Date_Created, @Date_of_Birth`;

export async function getAddUsersFansParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Email', type: TYPES.VarChar, value: values['Email'] },
    { name: 'Full_Name', type: TYPES.NVarChar, value: values['Full_Name'] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values['Date_Created']) },
     {name: 'Date_of_Birth', type: TYPES.DateTime, value: new Date(values['Date_of_Birth']) },
  ];
  return params;
}

// delete:
export const deleteUsersFansQuery = `DELETE FROM UsersFans WHERE User_ID = @User_ID;`;
export async function getDeleteUsersFansParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
  ];
  return params;
}

// update:
export const updateUsersFansQuery = `UPDATE UsersFans SET Email = @Email, Full_Name = @Full_Name AND Date_Created = @Date_Created AND Date_of_Birth = @Date_of_Birth WHERE User_ID = @User_ID`;
export async function getUpdateUserFansParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Email', type: TYPES.VarChar, value: values['Email'] },
    { name: 'Full_Name', type: TYPES.NVarChar, value: values['Full_Name'] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values['Date_Created']) },
     {name: 'Date_of_Birth', type: TYPES.DateTime, value: new Date(values['Date_of_Birth']) },
  ];
  return params;
}


// Table UsersCoaches:
// insert:
export const addUserCoachesQuery = `INSERT INTO UsersCoaches (User_ID, Date_Created, Role, Experience)
  VALUES (@User_ID, @Date_Created, @Role, @Experience`;

export async function getAddUsersCoachesParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values['Date_Created']) },
    { name: 'Role', type: TYPES.NVarChar, value: values['Role'] },
    { name: 'Experience', type: TYPES.NVarChar, value: values['Experience'] },
  ];
  return params;
}

// delete:
export const deleteUsersCoachesQuery = `DELETE FROM UsersCoaches WHERE User_ID = @User_ID;`;
export async function getDeleteUsersCoachesParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
  ];
  return params;
}

// update:
export const updateUsersCoachesQuery = `UPDATE UsersCoaches SET Date_Created = @Date_Created, Role = @Role, Experience = @Experience WHERE User_ID = @User_ID`;
export async function getUpdateUserCoachesParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Date_Created', type: TYPES.DateTime, value: new Date(values['Date_Created']) },
    { name: 'Role', type: TYPES.NVarChar, value: values['Role'] },
    { name: 'Experience', type: TYPES.NVarChar, value: values['Experience'] },
  ];
  return params;
}


// Table PlayersInTeams
// insert
export const addPlayersInTeamsQuery = `INSERT INTO PlayersInTeams (User_ID, Team_ID, Position, Shirt_Number)
  VALUES (@User_ID, @Team_ID, @Position, @Shirt_Number)`;

export async function getAddPlayersInTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
    { name: 'Position', type: TYPES.NVarChar, value: values['Position'] },
    { name: 'Shirt_Number', type: TYPES.Int, value: values['Shirt_Number'] }
  ];
  return params;
}

// delete
export const deletePlayersInTeamsQuery = `DELETE FROM PlayersInTeams WHERE User_ID = @User_ID AND Team_ID = @Team_ID;`;
export async function getDeletePlayersInTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] }
  ];
  return params;
}

// update
export const updatePlayersInTeamsQuery = `UPDATE PlayersInTeams SET Team_ID = @Team_ID, Position = @Position, Shirt_Number = @Shirt_Number WHERE User_ID = @User_ID`;
export async function getUpdatePlayersInTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
    { name: 'Position', type: TYPES.NVarChar, value: values['Position'] },
    { name: 'Shirt_Number', type: TYPES.Int, value: values['Shirt_Number'] }
  ];
  return params;
}


// Table FansOfTeams
// insert
export const addFansOfTeamsQuery = `INSERT INTO FansOfTeams (User_ID, Team_ID)
  VALUES (@User_ID, @Team_ID)`;

export async function getAddFansOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
  ];
  return params;
}

//delete
export const deleteFansOfTeamsQuery = `DELETE FROM FansOfTeams WHERE User_ID = @User_ID AND Team_ID = @Team_ID;`;
export async function getDeleteFansOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
  ];
  return params;
}

// update
export const updateFansOfTeamsQuery = `UPDATE FansOfInTeams SET Team_ID = @Team_ID WHERE User_ID = @User_ID`;
export async function getUpdateFansOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
  ];
  return params;
}

// Table CoachesOfInTeams
// insert
export const addCoachesOfTeamsQuery = `INSERT INTO CoachesOfTeams (User_ID, Team_ID)
  VALUES (@User_ID, @Team_ID)`;

export async function getAddCoachesOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
  ];
  return params;
}

// delete
export const deleteCoachesOfTeamsQuery = `DELETE FROM CoachesOfTeams WHERE User_ID = @User_ID AND Team_ID = @Team_ID;`;
export async function getDeleteCoachesOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
  ];
  return params;
}

// update
export const updateCoachesOfTeamsQuery = `UPDATE CoachesOfInTeams SET Team_ID = @Team_ID WHERE User_ID = @User_ID`;
export async function getUpdateCoachesOfTeamsParams(values) {
  const params = [
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
  ];
  return params;
}

// Table League
// insert
export const addLeagueQuery = `INSERT INTO League (League_ID, League_Name, League_Type)
  VALUES (@League_ID, @League_Name, @League_Type)`;

export const query_get_leagues_ids = `SELECT League_ID from League;`;
export async function getAddLeagueParams(values) {
  const leagueIds = await fetchIds(query_get_leagues_ids);
  const lastLeagueId = leagueIds[leagueIds.length -1]['League_ID']
  const params = [
    { name: 'League_ID', type: TYPES.Int, value: lastLeagueId + 1 },
    { name: 'League_Name', type: TYPES.NVarChar, value: values['League_Name'] },
    { name: 'League_Type', type: TYPES.NVarChar, value: values['League_Type'] }
  ];
  return params;
}

// delete
export const deleteLeagueQuery = `DELETE FROM League WHERE League_ID = @League_ID;`;
export async function getDeleteLeagueParams(values) {
  const params = [
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] }
  ];
  return params;
}

// update
export const updateLeagueQuery = `UPDATE League SET League_Name = @League_Name AND League_Type = @League_Type WHERE League_ID = @League_ID`;
export async function getUpdateLeagueParams(values) {
  const params = [
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] },
    { name: 'League_Name', type: TYPES.NVarChar, value: values['League_Name'] },
    { name: 'League_Type', type: TYPES.NVarChar, value: values['League_Type'] }
  ];
  return params;
}


// Table Penalties
// insert
export const addPenaltyQuery = `INSERT INTO Penalties (Penalty_ID, Game_ID, User_ID, Time_Stamp, Team_ID)
  VALUES (@Penalty_ID, @Game_ID, @User_ID, @Time_Stamp, @Team_ID)`;

export const query_get_penalties_ids = `SELECT League_ID from League;`;
export async function getAddPenaltyParams(values) {
  const penaltiesIds = await fetchIds(query_get_penalties_ids);
  let lastPenaltyId = 0;
  if (penaltiesIds.length > 0) {
    lastPenaltyId = penaltiesIds[penaltiesIds.length -1]['Penalty_ID']
  };
  const params = [
    { name: 'Penalty_ID', type: TYPES.Int, value: lastPenaltyId + 1 },
    { name: 'Game_ID', type: TYPES.Int, value: values['Game_ID'] },
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Time_Stamp', type: TYPES.Time, value: values['Time_Stamp'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
  ];
  return params;
}

// delete
export const deletePenaltyQuery = `DELETE FROM Penalties WHERE Penalty_ID = @Penalty_ID`;
export async function getDeletePenaltyParams(values) {
  const params = [
    { name: 'Penalty_ID', type: TYPES.Int, value: values['Penalty_ID'] }
  ];
  return params;
}

// update
export const updatePenaltyQuery = `UPDATE Penalties SET Game_ID = @Game_ID AND User_ID = @User_ID AND Time_Stamp = @Time_Stamp AND Team_ID = @Team_ID WHERE Penalty_ID = @Penalty_ID`;
export async function getUpdatePenaltyParams(values) {
  const params = [
    { name: 'Penalty_ID', type: TYPES.Int, value: values['Penalty_ID'] },
    { name: 'Game_ID', type: TYPES.Int, value: values['Game_ID'] },
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Time_Stamp', type: TYPES.Time, value: values['Time_Stamp'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
  ];
  return params;
}


// Table Teams
// insert
export const addTeamQuery = `INSERT INTO Teams (Team_ID, Team_Name, Rank, Location_ID, League_ID)
  VALUES (@Team_ID, @Team_Name, @Rank, @Location_ID, @League_ID)`;

export const query_get_team_ids = `SELECT Team_ID from Teams;`;
export async function getAddTeamParams(values) {
  const teamsIds = await fetchIds(query_get_team_ids);
  const lastTeamId = teamsIds[teamsIds.length -1]['Team_ID']
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: lastTeamId + 1 },
    { name: 'Team_Name', type: TYPES.NVarChar, value: values['Team_Name'] },
    { name: 'Rank', type: TYPES.Int, value: values['Rank'] },
    { name: 'Location_ID', type: TYPES.Int, value: values['Location_ID'] },
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] },
  ];
  return params;
}

// delete
export const deleteTeamQuery = `DELETE FROM Teams WHERE Team_ID = @Team_ID`;
export async function getDeleteTeamParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] }
  ];
  return params;
}

// update
export const updateTeamQuery = `UPDATE Teams SET Team_Name = @Team_Name AND Rank = @Rank AND Location_ID = @Location_ID AND League_ID = @League_ID WHERE Team_ID = @Team_ID`;
export async function getUpdateTeamParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
    { name: 'Team_Name', type: TYPES.NVarChar, value: values['Team_Name'] },
    { name: 'Rank', type: TYPES.Int, value: values['Rank'] },
    { name: 'Location_ID', type: TYPES.Int, value: values['Location_ID'] },
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] },
  ];
  return params;
}


// Table TeamsInLeagues
// insert
export const addTeamsInLeaguesQuery = `INSERT INTO TeamsInLeagues (Team_ID, League_ID)
  VALUES (@Team_ID, @League_ID)`;

export const query_get_team_in_league_ids = `SELECT Team_ID from TeamsInLeagues;`;
export async function getAddTeamInLeaguesParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] },
  ];
  return params;
}

// delete
export const deleteTeamInLeaguesQuery = `DELETE FROM TeamsInLeagues WHERE Team_ID = @Team_ID`;
export async function getDeleteTeamInLeaguesParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] },
  ];
  return params;
}

// update
export const updateTeamInLeaguesQuery = `UPDATE TeamsInLeagues SET League_ID = @League_ID WHERE Team_ID = @Team_ID`;
export async function getUpdateTeamInLeaguesParams(values) {
  const params = [
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
    { name: 'League_ID', type: TYPES.Int, value: values['League_ID'] },
  ];
  return params;
}


// Table Goals:
// insert:
export const query_get_goals_ids = `SELECT Goal_ID from Goals;`;
export const addGoalQuery = `INSERT INTO Goals (Goal_ID, Game_ID, User_ID, Team_ID, Time_Stamp)
  VALUES (@Goal_ID, @Game_ID, @User_ID, @Team_ID, @Time_Stamp)`;

export async function getAddGoalParams(values) {
  const goalsIds = await fetchIds(query_get_goals_ids);
  let lastGoalId = 0;
  if (goalsIds.length > 0){
    lastGoalId = goalsIds[goalsIds.length -1]['Goal_ID'];
  }
  const params = [
    { name: 'Goal_ID', type: TYPES.Int, value: lastGoalId + 1 },
    { name: 'Game_ID', type: TYPES.Int, value: values['Game_ID'] },
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
    { name: 'Time_Stamp', type: TYPES.DateTime, value: new Date(values['Time_Stamp']) }
  ];
  return params;
}
// delete:
export const deleteGoalQuery = `DELETE FROM Goals WHERE Goal_ID = @Goal_ID;`;
export async function getDeleteGoalParams(values) {
  const params = [
    { name: 'Goal_ID', type: TYPES.Int, value: values['Goal_ID'] },
  ];
  return params;
}
// update:
export const updateGoalQuery = `UPDATE Goals SET Game_ID = @Game_ID, User_ID = @User_ID, Team_ID = @Team_ID, Time_Stamp = @Time_Stamp WHERE Goal_ID = @Goal_ID`;
export async function getUpdateGoalParams(values) {
  const params = [
    { name: 'Goal_ID', type: TYPES.Int, value: values['Goal_ID'] },
    { name: 'Game_ID', type: TYPES.Int, value: values['Game_ID'] },
    { name: 'User_ID', type: TYPES.Int, value: values['User_ID'] },
    { name: 'Team_ID', type: TYPES.Int, value: values['Team_ID'] },
    { name: 'Time_Stamp', type: TYPES.DateTime, value: new Date(values['Time_Stamp']) }
  ];
  return params;
}


// Table Locations
// insert
export const addLocationQuery = `INSERT INTO Locations (Location_ID, Location_Name)
  VALUES (@Location_ID, @Location_Name)`;

export const query_get_location_ids = `SELECT Location_ID from Locations;`;
export async function getAddLocationParams(values) {
  const locationsIds = await fetchIds(query_get_location_ids);
  const lastLocationId = locationsIds[locationsIds.length -1]['Location_ID']
  const params = [
    { name: 'Location_ID', type: TYPES.Int, value: lastLocationId + 1 },
    { name: 'Location_Name', type: TYPES.NVarChar, value: values['Location_Name'] }
  ];
  return params;
}

// delete
export const deleteLocationQuery = `DELETE FROM Location WHERE Location_ID = @Location_ID`;
export async function getDeleteLocationParams(values) {
  const params = [
    { name: 'Location_ID', type: TYPES.Int, value: values['Location_Name'] }
  ];
  return params;
}

// update
export const updateLocationQuery = `UPDATE Location SET Location_Name = @Location_Name WHERE Location_ID = @Location_ID`;
export async function getUpdateLocationParams(values) {
  const params = [
    { name: 'Location_ID', type: TYPES.Int, value: values['Location_ID'] },
    { name: 'Location_Name', type: TYPES.NVarChar, value: values['Location_Name'] }
  ];
  return params;
}