const { Connection, Request } = require("tedious");

// Database credentials
const DB_USER = "ziv130196";
const DB_PASSWORD = "HockeyIsGood!";
const DB_SERVER = "israeli-hockey-league-israel-db.database.windows.net";
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

function fetchRows(queryCallback) {
  return new Promise((resolve, reject) => {
    // Create connection instance
    const connection = new Connection(config);

    // Array to hold fetched rows
    const rows = [];

    // Attempt to connect
    connection.on("connect", (err) => {
      if (err) {
        console.error("Connection failed:", err);
        reject(err);
      } else {
        console.log("Connected to database");
        const query = queryCallback(); // Call the callback to get the query
        executeStatement(query);
      }
    });

    // Attempt to execute the query
    function executeStatement(query) {
      const request = new Request(query, (err, rowCount) => {
        if (err) {
          console.error("Query execution failed:", err);
          reject(err);
        } else {
          console.log(
            `Query executed successfully. Rows affected: ${rowCount}`
          );
        }
        connection.close(); // Close connection after executing query
      });

      // Handle rows from the query result
      request.on("row", (columns) => {
        let row = {};
        columns.forEach((column) => {
          row[column.metadata.colName] = column.value;
        });
        rows.push(row);
      });

      // After all rows are processed, resolve the promise
      request.on("requestCompleted", () => {
        resolve(rows);
      });

      // Execute the request
      connection.execSql(request);
    }

    // Connect to the database
    connection.connect();
  });
}

module.exports = fetchRows;