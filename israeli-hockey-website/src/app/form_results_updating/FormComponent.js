"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Select,
  TimePicker,
  message,
} from "antd";
import "antd/dist/reset.css"; // Import Ant Design styles
import "../style.css";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

export default function UploadGameResultForm({ data }) {
  const initialFormState = {
    selectedGameId: "",
    homeTeamGoals: [],
    awayTeamGoals: [],
    homeTeamPenalties: [],
    awayTeamPenalties: [],
    homeTeamCards: [],
    awayTeamCards: [],
  };

  const fieldLabels = {
    selectedGameId: "בחר משחק",
    homeTeam: "קבוצה א",
    awayTeam: "קבוצה ב",
  };

  // const games = data[0].map(game => ({ key: game.Game_ID, value: [game.Home_Team_Name, game.Away_Team_Name, game.Date] }));
  const games = data[0].map((game) => ({
    key: game.Game_ID,
    value: {
      Age: game.Age,
      Home_Team_ID: game.Home_Team_ID,
      Home_Team_Name: game.Home_Team_Name,
      Away_Team_ID: game.Away_Team_ID,
      Away_Team_Name: game.Away_Team_Name,
      Day: game.Day,
      Date: game.Date,
    },
  }));
  const players = data[1]; // Assuming players are mapped correctly

  const [formData, setFormData] = useState(initialFormState);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem("formGameResult");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("formGameResult", JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));

    if (changedValues.selectedGameId) {
      const game = games.find(
        (game) => game.key === changedValues.selectedGameId
      );
      setSelectedGame(game);
      // alert(`Selected Game Data: ${JSON.stringify(game)}`);
    }
  };

  const handleAddGoal = (team) => {
    const goal = { User_ID: "", Time_Stamp: null };
    setFormData((prevData) => ({
      ...prevData,
      [team]: [...prevData[team], goal],
    }));
  };

  const handleGoalChange = (team, index, key, value) => {
    const newGoals = [...formData[team]];
    newGoals[index][key] = value;
    setFormData((prevData) => ({
      ...prevData,
      [team]: newGoals,
    }));
  };

  const handleAddPenalty = (team) => {
    const penalty = { User_ID: "", Time_Stamp: null };
    setFormData((prevData) => ({
      ...prevData,
      [team]: [...prevData[team], penalty],
    }));
  };

  const handlePenaltyChange = (team, index, key, value) => {
    const newPenalty = [...formData[team]];
    newPenalty[index][key] = value;
    setFormData((prevData) => ({
      ...prevData,
      [team]: newPenalty,
    }));
  };

  const handleCardChange = (team, index, key, value) => {
    const newCard = [...formData[team]];
    newCard[index][key] = value;
    setFormData((prevData) => ({
      ...prevData,
      [team]: newCard,
    }));
  };

  const handleAddCard = (team) => {
    const card = { User_ID: "", Time_Stamp: null };
    setFormData((prevData) => ({
      ...prevData,
      [team]: [...prevData[team], card],
    }));
  };

  const handleTimeChange = (team, index, time, timeString) => {
    const newData = [...formData[team]];
    newData[index].Time_Stamp = timeString;
    setFormData((prevData) => ({
      ...prevData,
      [team]: newData,
    }));
  };



  // const optionsCard = ['blue', 'red']
  const optionsCard =[{key:'blue', value: 'כחול'},
    {key:'red', value:'אדום'}];

  const handleSubmit = async () => {
    const final_data = {
      Game_ID: formData.selectedGameId,
      Goals: [
        ...formData.homeTeamGoals.map((goal) => ({
          User_ID: goal.User_ID,
          Team_ID: selectedGame.value.Home_Team_ID,
          Time_Stamp: goal.Time_Stamp,
        })),
        ...formData.awayTeamGoals.map((goal) => ({
          User_ID: goal.User_ID,
          Team_ID: selectedGame.value.Away_Team_ID,
          Time_Stamp: goal.Time_Stamp,
        })),
      ],
      Penalties: [
        ...formData.homeTeamPenalties.map((penalty) => ({
          User_ID: penalty.User_ID,
          Team_ID: selectedGame.value.Home_Team_ID,
          Time_Stamp: penalty.Time_Stamp,
        })),
        ...formData.awayTeamPenalties.map((penalty) => ({
          User_ID: penalty.User_ID,
          Team_ID: selectedGame.value.Away_Team_ID,
          Time_Stamp: penalty.Time_Stamp,
        })),
      ],
      Cards: [
        ...formData.homeTeamCards.map((card) => ({
          User_ID: card.User_ID,
          Team_ID: selectedGame.value.Home_Team_ID,
          Time_Stamp: card.Time_Stamp,
          Card_Type: card.Card_Type,
        })),
        ...formData.awayTeamCards.map((card) => ({
          User_ID: card.User_ID,
          Team_ID: selectedGame.value.Away_Team_ID,
          Time_Stamp: card.Time_Stamp,
          Card_Type: card.Card_Type,
        })),
      ],
    };

    try {
      const response = await fetch("/api/form_results_updating", {
        // change dir
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(final_data),
      });
    } catch (error) {
      console.error("Error updating data");
    }
    // for resetting the fields once sent
    form.resetFields();
    setFormData(initialFormState);
    setSelectedGame(null);
    message.success("Results updated successfully");
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    setSelectedGame(null);
    if (isClient) {
      localStorage.removeItem("formGameResult");
    }
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const getTeamPlayers = (teamID) => {
    return players.filter((player) => player.Team_ID === teamID);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Title level={2}>טופס העלאת תוצאות למשחק</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={(changedValues, allValues) => handleChange(allValues)}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={fieldLabels.selectedGameId}
              name="selectedGameId"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels.selectedGameId} is required`,
                },
              ]}
            >
              <Select
                showSearch
                placeholder="בחר משחק"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                style={{ width: "100%" }} // Make the Select box take full width
              >
                {games.map((game) => (
                  <Option key={game.key} value={game.key}>
                    {`משחק ${game.key}: ${moment(game.value["Date"]).format(
                      "YYYY-MM-DD"
                    )} - קבוצות ${game.value["Home_Team_Name"]} מול ${
                      game.value["Away_Team_Name"]
                    } ליגת ${game.value["Age"]}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {selectedGame && (
          <Row gutter={16}>
            <Col span={12}>
              <Title
                level={3}
              >{`קבוצה: ${selectedGame.value["Home_Team_Name"]} ${selectedGame.value["Age"]}`}</Title>
              <Title level={5}>{`רישום גולים`}</Title>
              {formData.homeTeamGoals.map((goal, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        placeholder="שחקן"
                        value={goal.User_ID}
                        onChange={(value) =>
                          handleGoalChange(
                            "homeTeamGoals",
                            index,
                            "User_ID",
                            value
                          )
                        }
                        style={{ width: "100%" }} // Make the Input box take full width
                        showSearch
                        optionFilterProp="children"
                      >
                        {getTeamPlayers(selectedGame.value["Home_Team_ID"]).map(
                          (User_ID) => (
                            <Option
                              key={User_ID.user_id}
                              value={User_ID.user_id}
                            >
                              {User_ID.Full_Name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <TimePicker
                        format="HH:mm"
                        value={
                          goal.Time_Stamp
                            ? moment(goal.Time_Stamp, "HH:mm")
                            : null
                        }
                        onChange={(time, timeString) =>
                          handleTimeChange(
                            "homeTeamGoals",
                            index,
                            time,
                            timeString
                          )
                        }
                        style={{ width: "100%" }} // Make the TimePicker take full width
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button onClick={() => handleAddGoal("homeTeamGoals")} block>
                הוסף גול
              </Button>
            </Col>
            <Col span={12}>
              <Title
                level={3}
              >{`קבוצה: ${selectedGame.value["Away_Team_Name"]} ${selectedGame.value["Age"]}`}</Title>
              <Title level={5}>{`רישום גולים`}</Title>
              {formData.awayTeamGoals.map((goal, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        placeholder="שחקן"
                        value={goal.User_ID}
                        onChange={(value) =>
                          handleGoalChange(
                            "awayTeamGoals",
                            index,
                            "User_ID",
                            value
                          )
                        }
                        style={{ width: "100%" }} // Make the Input box take full width
                        showSearch
                        optionFilterProp="children"
                      >
                        {getTeamPlayers(selectedGame.value["Away_Team_ID"]).map(
                          (User_ID) => (
                            <Option
                              key={User_ID.user_id}
                              value={User_ID.user_id}
                            >
                              {User_ID.Full_Name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <TimePicker
                        format="HH:mm"
                        value={
                          goal.Time_Stamp
                            ? moment(goal.Time_Stamp, "HH:mm")
                            : null
                        }
                        onChange={(time, timeString) =>
                          handleTimeChange(
                            "awayTeamGoals",
                            index,
                            time,
                            timeString
                          )
                        }
                        style={{ width: "100%" }} // Make the TimePicker take full width
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button onClick={() => handleAddGoal("awayTeamGoals")} block>
                הוסף גול
              </Button>
            </Col>

            {/* Penalties */}

            <Col span={12}>
              <Title level={5}>רישום עבירות</Title>
              {formData.homeTeamPenalties.map((penalty, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        placeholder="שחקן"
                        value={penalty.User_ID}
                        onChange={(value) =>
                          handlePenaltyChange(
                            "homeTeamPenalties",
                            index,
                            "User_ID",
                            value
                          )
                        }
                        style={{ width: "100%" }} // Make the Input box take full width
                        showSearch
                        optionFilterProp="children"
                      >
                        {getTeamPlayers(selectedGame.value["Home_Team_ID"]).map(
                          (User_ID) => (
                            <Option
                              key={User_ID.user_id}
                              value={User_ID.user_id}
                            >
                              {User_ID.Full_Name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <TimePicker
                        format="HH:mm"
                        value={
                          penalty.Time_Stamp
                            ? moment(penalty.Time_Stamp, "HH:mm")
                            : null
                        }
                        onChange={(time, timeString) =>
                          handleTimeChange(
                            "homeTeamPenalties",
                            index,
                            time,
                            timeString
                          )
                        }
                        style={{ width: "100%" }} // Make the TimePicker take full width
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button
                onClick={() => handleAddPenalty("homeTeamPenalties")}
                block
              >
                הוסף עבירה
              </Button>
            </Col>

            <Col span={12}>
              <Title level={5}>{`רישום עבירות`}</Title>
              {formData.awayTeamPenalties.map((penalty, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        placeholder="שחקן"
                        value={penalty.User_ID}
                        onChange={(value) =>
                          handlePenaltyChange(
                            "awayTeamPenalties",
                            index,
                            "User_ID",
                            value
                          )
                        }
                        style={{ width: "100%" }} // Make the Input box take full width
                        showSearch
                        optionFilterProp="children"
                      >
                        {getTeamPlayers(selectedGame.value["Away_Team_ID"]).map(
                          (User_ID) => (
                            <Option
                              key={User_ID.user_id}
                              value={User_ID.user_id}
                            >
                              {User_ID.Full_Name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <TimePicker
                        format="HH:mm"
                        value={
                          penalty.Time_Stamp
                            ? moment(penalty.Time_Stamp, "HH:mm")
                            : null
                        }
                        onChange={(time, timeString) =>
                          handleTimeChange(
                            "awayTeamPenalties",
                            index,
                            time,
                            timeString
                          )
                        }
                        style={{ width: "100%" }} // Make the TimePicker take full width
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button
                onClick={() => handleAddPenalty("awayTeamPenalties")}
                block
              >
                הוסף עבירה
              </Button>
            </Col>
            {/* Cards */}

            <Col span={12}>
              <Title level={5}>רישום כרטיסים</Title>
              {formData.homeTeamCards.map((card, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        placeholder="שחקן"
                        value={card.User_ID}
                        onChange={(value) =>
                          handleCardChange(
                            "homeTeamCards",
                            index,
                            "User_ID",
                            value
                          )
                        }
                        style={{ width: "100%" }} // Make the Input box take full width
                        showSearch
                        optionFilterProp="children"
                      >
                        {getTeamPlayers(selectedGame.value["Home_Team_ID"]).map(
                          (User_ID) => (
                            <Option
                              key={User_ID.user_id}
                              value={User_ID.user_id}
                            >
                              {User_ID.Full_Name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <TimePicker
                        format="HH:mm"
                        value={
                          card.Time_Stamp
                            ? moment(card.Time_Stamp, "HH:mm")
                            : null
                        }
                        onChange={(time, timeString) =>
                          handleTimeChange(
                            "homeTeamCards",
                            index,
                            time,
                            timeString
                          )
                        }
                        style={{ width: "100%" }} // Make the TimePicker take full width
                      />
                    </Form.Item>

                    <Form.Item>
                      <Select
                        placeholder="סוג כרטיס"
                        value={card.Card_Type}
                        onChange={(value) =>
                          handleCardChange(
                            "homeTeamCards",
                            index,
                            "Card_Type",
                            value
                          )
                        }
                        style={{ width: "100%" }}
                        showSearch
                        optionFilterProp="children"
                      >
                        {optionsCard.map((option) => (
                          <Option key={option.key} value={option.key}>
                            {option.value}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button onClick={() => handleAddCard("homeTeamCards")} block>
                הוסף כרטיס
              </Button>
            </Col>

            <Col span={12}>
              <Title level={5}>{`רישום כרטיסים`}</Title>
              {formData.awayTeamCards.map((card, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        placeholder="שחקן"
                        value={card.User_ID}
                        onChange={(value) =>
                          handleCardChange(
                            "awayTeamCards",
                            index,
                            "User_ID",
                            value
                          )
                        }
                        style={{ width: "100%" }} // Make the Input box take full width
                        showSearch
                        optionFilterProp="children"
                      >
                        {getTeamPlayers(selectedGame.value["Away_Team_ID"]).map(
                          (User_ID) => (
                            <Option
                              key={User_ID.user_id}
                              value={User_ID.user_id}
                            >
                              {User_ID.Full_Name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <TimePicker
                        format="HH:mm"
                        value={
                          card.Time_Stamp
                            ? moment(card.Time_Stamp, "HH:mm")
                            : null
                        }
                        onChange={(time, timeString) =>
                          handleTimeChange(
                            "awayTeamCards",
                            index,
                            time,
                            timeString
                          )
                        }
                        style={{ width: "100%" }} // Make the TimePicker take full width
                      />
                    </Form.Item>

                    <Form.Item>
                      <Select
                        placeholder="סוג כרטיס"
                        value={card.Card_Type}
                        onChange={(value) =>
                          handleCardChange(
                            "awayTeamCards",
                            index,
                            "Card_Type",
                            value
                          )
                        }
                        style={{ width: "100%" }}
                        showSearch
                        optionFilterProp="children"
                      >
                        {optionsCard.map((option) => (
                          <Option key={option.key} value={option.key}>
                            {option.value}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button onClick={() => handleAddCard("awayTeamCards")} block>
                הוסף כרטיס
              </Button>
            </Col>
          </Row>
        )}

        <Row gutter={16} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Button type="primary" htmlType="submit" block>
              Send
            </Button>
          </Col>
          <Col span={12}>
            <Button type="default" onClick={handleClearAll} block>
              Clear All
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
