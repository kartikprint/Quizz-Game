import React, { useState, useEffect } from "react";

import { io } from "socket.io-client";
import "./index.css";

const socket = io(); // Connect to the server

const Home = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [playerAnswer, setPlayerAnswer] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    // Listen for the current question from the server
    socket.on("currentQuestion", (data) => {
      setCurrentQuestion(data.question);
      setOptions(data.options);
    });

    // Listen for feedback after an answer is submitted
    socket.on("feedback", (data) => {
      setFeedbackMessage(data.feedback);
    });

    return () => {
      // Cleanup the socket connection when the component unmounts
      socket.off("currentQuestion");
      socket.off("feedback");
    };
  }, []);

  // Submit answer to the server
  const handleAnswerSubmit = (answer) => {
    setPlayerAnswer(answer);
    socket.emit("answer", { answer });
  };

  return (
    <div className="quiz-container">
      {currentQuestion && (
        <div>
          <h2>{currentQuestion}</h2>
          <div className="options">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSubmit(option)}
                disabled={playerAnswer !== ""}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {feedbackMessage && <p>{feedbackMessage}</p>}
    </div>
  );
};

export default Home;
