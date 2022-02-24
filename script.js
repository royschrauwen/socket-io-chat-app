let username = "Test user";

function getUsername() {
  username = window.prompt("Username", "Roy ");
}

window.addEventListener("load", getUsername);

var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

const colorButtons = document.querySelectorAll(".clrButton");

const clientButton = document.querySelectorAll(".rankButton")[0];
const hostButton = document.querySelectorAll(".rankButton")[1];

clientButton.addEventListener("click", joinRoom);
hostButton.addEventListener("click", createRoom);

function createRoom() {
  console.log("New Room: " + generateId(10));
}

function joinRoom() {
  console.log("Trying to join room");
}

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

colorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setBackgroundColor(btn.id);
  });
});

function setBackgroundColor(color) {
  //document.querySelector('body').style.backgroundColor = color;
  socket.emit("bgcolor", color);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", username, input.value);
    socket.emit("status", username, "done");
    input.value = "";
  }
});

input.addEventListener("input", function (e) {
  if (!input.value) {
    socket.emit("status", username, "done");
  } else {
    socket.emit("status", username, "typing");
  }
});

socket.on("chat message", function (username, msg) {
  var item = document.createElement("li");
  item.innerHTML = "<strong>" + username + "</strong>: " + msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("bgcolor", function (color) {
  document.querySelector("body").style.backgroundColor = color;
});

socket.on("status", function (username, msg) {
  var item = document.getElementById("typing");

  if (msg == "done") {
    item.textContent = "";
  } else {
    item.textContent = username + " is " + msg;
  }
});
