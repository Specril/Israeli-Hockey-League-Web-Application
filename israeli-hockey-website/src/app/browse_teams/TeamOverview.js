"use client";
import { Carousel, List, Row, Col, Card, Spin, Alert } from "antd";
import React, { useState, useEffect } from "react";

export default function TeamOverview({
  details,
  players,
  statistics = [],
  league,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTeamDetails, setFilteredTeamDetails] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  // Update filtered team details whenever `details` or `league` changes
  useEffect(() => {
    const filteredTeams = details.filter(
      (team) => team["League ID"] === league
    );
    setFilteredTeamDetails(filteredTeams);
    if (filteredTeams.length > 0) {
      setSelectedTeamId(filteredTeams[0]["Team ID"]);
    }
  }, [details, league]);

  // Update loading state based on available data
  useEffect(() => {
    if (details.length > 0 && players.length > 0 && statistics.length > 0) {
      setLoading(false);
    } else {
      setError("Failed to load team data");
      setLoading(false);
    }
  }, [details, players, statistics]);

  // Handle carousel change
  const handleCarouselChange = (current) => {
    if (filteredTeamDetails[current]) {
      setSelectedTeamId(filteredTeamDetails[current]["Team ID"]);
    } else {
      console.warn("Selected team is undefined at index:", current);
      setSelectedTeamId(null); // Reset selected team if undefined
    }
  };

  const selectedTeamDetails =
    filteredTeamDetails.find((team) => team["Team ID"] === selectedTeamId) ||
    {};

  const selectedTeamPlayers = players.filter(
    (player) => player["Team ID"] === selectedTeamId
  );

  const selectedTeamStatistics =
    statistics.find((stat) => stat.Team_ID === selectedTeamId) || {};

  if (loading) {
    return <Spin tip="טוען עמוד..." />;
  }

  // Check if the selected team has details, otherwise show a fallback message
  const hasValidTeamDetails = selectedTeamDetails && selectedTeamDetails["Team ID"];

  if (!hasValidTeamDetails) {
    return (
      <Alert
        message="No Details Available"
        description="The selected team does not have available details."
        type="warning"
        showIcon
      />
    );
  }

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
                <Col span={6}>
                  <Card
                    hoverable
                    title="סטטיסטיקות קבוצה"
                    bordered={false}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    <p>משחקים: {selectedTeamStatistics.Games || 0}</p>
                    <p>נקודות: {selectedTeamStatistics.Points || 0}</p>
                    <p>
                      הפרש שערים: {selectedTeamStatistics.Goal_Difference || 0}
                    </p>
                  </Card>
                </Col>
              </div>
            </div>
          ))}
        </Carousel>
      </Col>
      <Col span={12}>
        {selectedTeamDetails && (
          <div
            style={{
              marginBottom: "20px",
              textAlign: "center",
              alignSelf: "center",
            }}
          >
            <h2>
              {selectedTeamDetails["Team Name"] || "Team Name Not Available"}
            </h2>
            <p>
              <strong>מאמן:</strong>{" "}
              {selectedTeamDetails["Team Coach"] || "No Coach Assigned"}
            </p>
            <p>
              <strong>ליגה:</strong>{" "}
              {selectedTeamDetails["League Name"] || "No League Assigned"}
            </p>
          </div>
        )}
        {selectedTeamPlayers.length > 0 && (
          <Card
            title={
              <div
                style={{
                  backgroundColor: "#002244",
                  color: "#fff",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                שחקנים
              </div>
            }
            bordered={false}
            style={{ width: "100%", textAlign: "center" }}
          >
            <List
              dataSource={selectedTeamPlayers}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    transition:
                      "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.2)";
                    e.currentTarget.style.backgroundColor = "#f0f2f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div style={{ width: "100%", textAlign: "center" }}>
                    {item["Player Name"]}
                  </div>
                </List.Item>
              )}
              style={{ width: "100%", textAlign: "center" }}
            />
          </Card>
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
