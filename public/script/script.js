// ============================================== //
//           Definitions and assignments          //
// ============================================== //

var socket = io();

let username = "Test user";
let usernameList = [];
let userColor = "#000000"; // Maybe each user get's a username in a (random?) color?

let messages = document.getElementById("messages");
let form = document.getElementById("form");
let input = document.getElementById("input");

// By default we let the user pick a username when the page (re)loads.
window.addEventListener("load", promptUsername);

// ======================================== //
//           Socket IO Connections          //
// ======================================== //

// A new message has been emitted from the server.
// We should display it.
socket.on("chat message", function (username, msg) {
  var item = document.createElement("li");
  item.innerHTML = "<strong>" + username + "</strong>: " + msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// A new user has been emitted from the server
socket.on("newUser", function (name) {
  var item = document.createElement("li");
  item.classList.add("statusMessage");
  item.innerHTML = "User '" + name + "' connected to chat";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// The server lets us know a user left
socket.on("userLeft", function (name) {
  var item = document.createElement("li");
  item.classList.add("statusMessage");
  item.innerHTML = "User '" + name + "' left the chat";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// The server notices us the userlist has been updated
socket.on("connectedUsers", function (usernameDictionary) {
  usernameList = [];
  for (const [key, value] of Object.entries(usernameDictionary)) {
    usernameList.push(value);
  }
  createUsernameList();
});

// The server tells us there is a ststus update from a user
socket.on("status", function (username, msg) {
  var item = document.getElementById("typing");

  if (msg == "done") {
    item.textContent = "-";
  } else {
    item.textContent = username + " is " + msg;
  }
});

// =================================== //
//           Form interaction          //
// =================================== //

// The button of the chat-message-input-form
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", username, input.value);
    socket.emit("status", username, "done");
    input.value = "";
  }
});

// When a user is typing, emit this to the server
input.addEventListener("input", function (e) {
  if (!input.value) {
    socket.emit("status", username, "done");
  } else {
    socket.emit("status", username, "typing");
  }
});

// ============================ //
//           FUNCTIONS          //
// ============================ //

// ---------- USER FUNCTIONS ---------- //

// The user should be able to change it's username.
function promptUsername() {
  username = window.prompt("Username", "Roy ");
  setUsername(username);
}

// We emit the username to the server
function setUsername(username) {
  socket.emit("setUsername", username);
}

// Let's visualise a list of all connected users
// This should be called when the server emits a change regarding users
function createUsernameList() {
  document.getElementById("users").textContent = "";
  for (let i = 0; i < usernameList.length; i++) {
    if (usernameList[i] != "") {
      var user = document.createElement("li");
      // user.classList.add("statusMessage");
      user.textContent = usernameList[i];
      document.getElementById("users").appendChild(user);
    }
  }
}

// ---------- ROOM FUNCTIONS ---------- //

function newRoom() {}

// We can create a new room to chat
function createRoom() {
  console.log("New Room: " + generateId(10));
}

// A user should be able to join a given room
function joinRoom(roomId) {
  console.log("Trying to join room: " + roomId);
}

// We sould create a random roomId
function generateId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
