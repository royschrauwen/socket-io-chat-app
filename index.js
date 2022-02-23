const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (username, msg) => {
    io.emit("chat message", username, msg);
    console.log("message: " + msg);
  });
  socket.on("status", (username, msg) => {
    io.emit("status", username, msg);
    console.log("status: " + username + " is " + msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
