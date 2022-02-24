// ============================================== //
//           Definitions and assignments          //
// ============================================== //
// Express en SocketIO setup
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Users are stored in a "dictionary"
let usernameDictionary = {};

// ==================================== //
//           Server en routing          //
// ==================================== //

// Routing
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static("public"));

// Start the server.
server.listen(3000, () => {
  console.log("listening on *:3000");
});

// ======================================== //
//           Socket IO Connections          //
// ======================================== //
io.on("connection", (socket) => {
  addClientToDictionary(socket.id);

  // A user sends a chat message
  socket.on("setUsername", (username) => {
    addClientToDictionary(socket.id, username);
    io.emit("newUser", username);
  });

  // A user disconnects
  socket.on("disconnect", () => {
    removeClientFromDictionary(socket.id);
    io.emit("userLeft", usernameDictionary[socket.id]);
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
  });
});

// ============================ //
//           FUNCTIONS          //
// ============================ //
// When where is a new user or a user changed their username, we should update the "Dictionary"
function addClientToDictionary(newId, newName = "") {
  usernameDictionary[newId] = newName;
  updateConnectedUsers();
  console.log(usernameDictionary);
}

// Here I should remove the ID from the list and update the connected users;
function removeClientFromDictionary(idToRemove) {
  console.log("please remove " + idToRemove + " from connectedusers!");
  deleteFromObject(idToRemove, usernameDictionary);
  updateConnectedUsers();
}

// There has been an update to the userlist, so emit it to all clients
function updateConnectedUsers() {
  io.emit("connectedUsers", usernameDictionary);
}

// A function to remove an item from an object
function deleteFromObject(keyPart, obj) {
  for (var k in obj) {
    // Loop through the object
    if (~k.indexOf(keyPart)) {
      // If the current key contains the string we're looking for
      delete obj[k]; // Delete obj[key];
    }
  }
}
