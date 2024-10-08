import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./index.css";

// Hardcoded questions for simplicity
const questionsData = [
  {
    question:
      "What is the real name of the Shinigami who drops the Death Note into the human world?",
    correctAnswer: "Ryuk",
    incorrectAnswers: ["Rem", "Sidoh", "Armonia Justin"],
  },
  {
    question:
      "What is the name of Light Yagami's alias when using the Death Note?",
    correctAnswer: "Kira",
    incorrectAnswers: ["L", "X-Kira", "Beyond Birthday"],
  },
  // Add more questions here...
];

const Home = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [topScorers, setTopScorers] = useState([]);
  const [previousScores, setPreviousScores] = useState([]);

  // Current question data
  const currentQuestion = questionsData[currentQuestionIndex];

  // Handle player answer submission
  const handleAnswerSubmit = (answer) => {
    setPlayerAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setFeedbackMessage(`Correct! Well done, ${currentPlayer}.`);
      setScore(score + 1); // Increase score on correct answer
    } else {
      setFeedbackMessage(
        `Incorrect. The correct answer is ${currentQuestion.correctAnswer}.`
      );
      setScore(score); // No increase in score on incorrect answer
    }

    setTimeout(() => {
      if (currentQuestionIndex < questionsData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        endGame(); // End the game when all questions are answered
      }
      setPlayerAnswer("");
      setFeedbackMessage(""); // Reset feedback
    }, 2000);
  };

  // End the game and show the final score
  const endGame = () => {
    setFeedbackMessage("Quiz Complete! Well done!");
    setShowScore(true); // Show final score
    const newScore = { player: currentPlayer, score };
    const updatedScores = [...previousScores, newScore];

    localStorage.setItem("scores", JSON.stringify(updatedScores));
    setTopScorers(updatedScores.sort((a, b) => b.score - a.score));
  };

  // Handle player joining
  const handlePlayerJoin = (playerName) => {
    if (playerName.trim()) {
      setPlayers([...players, playerName]);
      setCurrentPlayer(playerName);
    }
  };

  // Load previous scores from local storage
  useEffect(() => {
    const storedScores = localStorage.getItem("scores");
    if (storedScores) {
      setPreviousScores(JSON.parse(storedScores));
    }
  }, []);

  return (
    <div className="death-question-card">
      {/* Display current question and answer options once player has joined */}
      {currentPlayer ? (
        <>
          {/* Display players */}
          <div className="players-card">
            <h2 className="player-names">Players</h2>
            <ul className="player">
              {players.map((player, index) => (
                <li className="player-text" key={index}>
                  {player}
                </li>
              ))}
            </ul>
          </div>

          {/* Display current question */}
          {!showScore && (
            <div className="death-question">
              <h2>Question {currentQuestionIndex + 1}</h2>
              <p>{currentQuestion.question}</p>

              {/* Display answer options */}
              <div className="mcq">
                {[
                  ...currentQuestion.incorrectAnswers,
                  currentQuestion.correctAnswer,
                ]
                  .sort(() => Math.random() - 0.5) // Shuffle options
                  .map((option, index) => (
                    <button
                      className="death-choice"
                      key={index}
                      onClick={() => handleAnswerSubmit(option)}
                      disabled={playerAnswer !== ""} // Disable after answer
                    >
                      {option}
                    </button>
                  ))}
              </div>

              {/* Display feedback message */}
              {feedbackMessage && <p>{feedbackMessage}</p>}
            </div>
          )}

          {/* Display final score when the game is complete */}
          {showScore && (
            <div className="death-complete">
              <h2>Quiz Complete!</h2>
              <p>
                {currentPlayer}, your final score is: {score}
              </p>

              {/* Display top scorers */}
              <h3>Top Scorers:</h3>
              <ul className="death-score">
                {topScorers.map((scorer, index) => (
                  <li key={index} className="score-player">
                    {scorer.player}: {scorer.score} points
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        // Display QR code and join option for new players
        <div>
          <h1>Death Game</h1>
          <div
            style={{
              padding: "15px",
              background: "white",
              borderRadius: "15PX",
            }}
          >
            <QRCodeSVG value={window.location.hostname} />
          </div>

          {/* Player join input */}
          <div className="join-game">
            <h2>Enter Your Name to Join</h2>
            <input
              className="enter"
              type="text"
              placeholder="Your name"
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePlayerJoin(e.target.value);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
