const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const questionsData = [{
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
}];

let currentQuestionIndex = 0;

// Serve static files from the React app (client)
app.use(express.static("client/build"));

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send the current question to the newly connected client
  socket.emit("currentQuestion", {
    question: questionsData[currentQuestionIndex].question,
    options: shuffleOptions([
      ...questionsData[currentQuestionIndex].incorrectAnswers,
      questionsData[currentQuestionIndex].correctAnswer,
    ]),
  });

  // Listen for player answers and send the next question
  socket.on("answer", (data) => {
    const { answer } = data;
    const correctAnswer = questionsData[currentQuestionIndex].correctAnswer;
    const feedback =
      answer === correctAnswer
        ? "Correct!"
        : `Incorrect. The correct answer is ${correctAnswer}.`;

    // Send feedback to all clients
    io.emit("feedback", { feedback });

    // Move to the next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < questionsData.length - 1) {
        currentQuestionIndex++;
      } else {
        currentQuestionIndex = 0; // Restart the quiz when finished
      }

      // Broadcast the next question to all clients
      io.emit("currentQuestion", {
        question: questionsData[currentQuestionIndex].question,
        options: shuffleOptions([
          ...questionsData[currentQuestionIndex].incorrectAnswers,
          questionsData[currentQuestionIndex].correctAnswer,
        ]),
      });
    }, 2000);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Shuffle answer options
function shuffleOptions(options) {
  return options.sort(() => Math.random() - 0.5);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
