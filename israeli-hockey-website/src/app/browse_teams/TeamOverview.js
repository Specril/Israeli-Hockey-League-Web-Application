"use client";
import { Carousel, List, Row, Col, Card } from "antd";
import React, { useState, useMemo, useEffect } from "react";
import PremierLeagueTable from "../MainCard";

export default function TeamOverview({ details, players, statistics = [], league }) {
  // Memoize filtered team details to avoid recalculating on every render
  const filteredTeamDetails = useMemo(
    () => details.filter((team) => team["League ID"] === league),
    [details, league]
  );

  const [selectedTeamId, setSelectedTeamId] = useState(
    filteredTeamDetails.length > 0 ? filteredTeamDetails[0]["Team ID"] : null
  );

  useEffect(() => {
    if (filteredTeamDetails.length > 0) {
      setSelectedTeamId(filteredTeamDetails[0]["Team ID"]);
    }
  }, [filteredTeamDetails]);

  const handleCarouselChange = (current) => {
    setSelectedTeamId(filteredTeamDetails[current]["Team ID"]);
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

  const selectedTeamStatistics = useMemo(
    () => statistics.find((stat) => stat.Team_ID === selectedTeamId) || {},
    [statistics, selectedTeamId]
  );

  //console.log('Selected Team Statistics:', JSON.stringify(selectedTeamStatistics)); // Log selected team statistics

  return (
    <Row align="center" justify="center" style={{ padding: "20px" }}>
      <Col span={24}>
        <Carousel
          afterChange={handleCarouselChange}
          arrows
          style={{ marginBottom: "20px", backgroundColor: "#002244" }}
        >
          {filteredTeamDetails.map((team) => (
            <div key={team["Team ID"]} className="carousel-slide">
              <div className="carousel-content">
                <img
                  className="carousel-image"
                  src={team["Team Logo"]}
                  alt={team["Team Name"]}
                />
              <Col span={4}>
        <Card hoverable title="סטטיסטיקות קבוצה" bordered={false} style={{ width: "100%", textAlign: "center" }}>
          <p>משחקים: {selectedTeamStatistics.Games || 0}</p>
          <p>נקודות: {selectedTeamStatistics.Points || 0}</p>
          <p>הפרש שערים: {selectedTeamStatistics.Goal_Difference || 0}</p>
        </Card>
      </Col>
              </div>
            </div>
          ))}
        </Carousel>
      </Col>
      <Col span={12}>
        {selectedTeamDetails && (
          <div style={{ marginBottom: "20px", textAlign: "center", alignSelf: "center" }}>
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
      </Col>
      
      <style jsx>{`
        .carousel-content {
          text-align: center;
          padding: 20px;
        }
        .carousel-image {
          width: 400px;
          height: 400px;
          object-fit: cover;
          margin: 0 auto;
        }
        .carousel-slide {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Row>
  );
}
