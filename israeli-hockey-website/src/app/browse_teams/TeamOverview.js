"use client";
import { Segmented, Avatar, Flex, List } from "antd";
import React, { useState } from "react";

export default function TeamOverview({ details, players }) {
  
    const filteredTeamDetails = details.filter(team => team["League ID"] === 1);
    
    const teamOptions = filteredTeamDetails.map(team => ({
        label: (
            <div
              style={{
                padding: 4,
              }}
            >
              <div><h2>{team["Team Name"]}</h2></div>
            </div>
          ),
        value: team["Team ID"],
        icon: <img style={{width: "100px", height: "100px"}} src={team["Team Logo"]}/>
    }));

    const [selectedTeamId, setSelectedTeamId] = useState(null);

    const handleSegmentedChange = (value) => {
        setSelectedTeamId(value);
    };

    const selectedTeamDetails = filteredTeamDetails.filter(team => team["Team ID"] === selectedTeamId);
    const selectedTeamPlayers = players.filter(player => player["Team ID"] === selectedTeamId);

    return (
    <>
    <Flex align="center" justify="center" vertical>
     <Segmented  size="large" options={teamOptions} onChange={handleSegmentedChange}/>
     <div style={{ marginTop: '20px' }}>
                {selectedTeamDetails.length > 0 && (
                    <div>
                        <h2>{selectedTeamDetails[0]["Team Name"]}</h2>
                        <p><strong>Coach:</strong> {selectedTeamDetails[0]["Team Coach"]}</p>
                        <p><strong>League:</strong> {selectedTeamDetails[0]["League Name"]}</p>
                    </div>
                )}
            </div>
            <div style={{ marginTop: '20px' }}>
                {selectedTeamPlayers.length > 0 && (
                    <List dataSource={selectedTeamPlayers} renderItem={item => (
                        <List.Item>
                            {item["Player Name"]}
                        </List.Item>
                    )}/>
                )}
            </div>
     </Flex>         
    </>
  );
}
