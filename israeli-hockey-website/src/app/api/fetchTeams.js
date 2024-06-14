const { Connection, Request } = require("tedious");

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

// Function to fetch teams data
function fetchTeams() {
  return new Promise((resolve, reject) => {
    // Create connection instance
    const connection = new Connection(config);

    // Array to hold fetched teams
    const teams = [];

    // Attempt to connect
    connection.on("connect", (err) => {
      if (err) {
        console.error("Connection failed:", err);
        reject(err);
      } else {
        console.log("Connected to database");
        executeStatement();
      }
    });

    // Attempt to execute the query
    function executeStatement() {
      const request = new Request("SELECT * FROM Teams", (err, rowCount) => {
        if (err) {
          console.error("Query execution failed:", err);
          reject(err);
        } else {
          console.log(
            `Query executed successfully. Rows affected: ${rowCount}`
          );
          resolve(teams);
        }
        connection.close();
      });

      // Handle rows from the query result
      request.on("row", (columns) => {
        let team = {};
        columns.forEach((column) => {
          team[column.metadata.colName] = column.value;
        });
        teams.push(team);
      });

      // Execute the request
      connection.execSql(request);
    }

    // Connect to the database
    connection.connect();
  });
}

module.exports = fetchTeams;
