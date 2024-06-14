const fetchTeams = require("./fetchTeams");
async function testFetchTeams() {
  try {
    const teamsData = await fetchTeams();
    console.log("Teams fetched:", teamsData);
    // Optionally, perform assertions to validate the data structure or content
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
}

// Call the test function
testFetchTeams();
