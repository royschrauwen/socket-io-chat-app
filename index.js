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
  console.log("User " + socket.id + " connected");

  // A user disconnects
  socket.on("disconnect", () => {
    console.log("User " + socket.id + " disconnected");
  });

  // A user sends a chat message
  socket.on("chat message", (username, msg) => {
    io.emit("chat message", username, msg);
    console.log("message: " + msg);
  });

  // A user is typing (make more stati in future)
  socket.on("status", (username, msg) => {
    io.emit("status", username, msg);
    //console.log("status: " + username + " is " + msg);
  });

  // A user clicks a bgcolor-button
  socket.on("bgcolor", (color) => {
    io.emit("bgcolor", color);
    //console.log("status: " + username + " is " + msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
