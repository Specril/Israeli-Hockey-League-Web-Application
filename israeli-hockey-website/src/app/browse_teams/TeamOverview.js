"use client";
import { Segmented, List, Flex } from "antd";
import React, { useState, useMemo } from "react";

export default function TeamOverview({ details, players }) {
  // Memoize filtered team details to avoid recalculating on every render
  const filteredTeamDetails = useMemo(
    () => details.filter((team) => team["League ID"] === 1),
    [details]
  );

  // Memoize team options to avoid recalculating on every render
  const teamOptions = useMemo(
    () =>
      filteredTeamDetails.map((team) => ({
        label: (
          <div style={{ padding: 4 }}>
            <h2>{team["Team Name"]}</h2>
          </div>
        ),
        value: team["Team ID"],
        icon: (
          <img
            style={{ width: "100px", height: "100px" }}
            src={team["Team Logo"]}
            alt={team["Team Name"]}
          />
        ),
      })),
    [filteredTeamDetails]
  );

  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const handleSegmentedChange = (value) => {
    setSelectedTeamId(value);
  };

  // Memoize selected team details and players to avoid recalculating on every render
  const selectedTeamDetails = useMemo(
    () =>
      filteredTeamDetails.find((team) => team["Team ID"] === selectedTeamId) ||
      {},
    [filteredTeamDetails, selectedTeamId]
  );

  const selectedTeamPlayers = useMemo(
    () => players.filter((player) => player["Team ID"] === selectedTeamId),
    [players, selectedTeamId]
  );

  return (
    <Flex align="center" justify="center" vertical style={{ padding: "20px" }}>
      <Segmented
        size="large"
        options={teamOptions}
        onChange={handleSegmentedChange}
        style={{ marginBottom: "20px" }}
      />
      {selectedTeamDetails && (
        <div style={{ marginBottom: "20px" }}>
          <h2>{selectedTeamDetails["Team Name"]}</h2>
          <p>
            <strong>מאמן:</strong> {selectedTeamDetails["Team Coach"]}
          </p>
          <p>
            <strong>ליגה:</strong> {selectedTeamDetails["League Name"]}
          </p>
        </div>
      )}
      {selectedTeamPlayers.length > 0 && (
        <List
          header={
            <div>
              <h3>שחקנים</h3>
            </div>
          }
          dataSource={selectedTeamPlayers}
          renderItem={(item) => <List.Item>{item["Player Name"]}</List.Item>}
          style={{ width: "100%" }}
        />
      )}
    </Flex>
  );
}
