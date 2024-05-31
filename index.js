const express = require("express");
const { join } = require("path");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://test-websocket-acrf.onrender.com/",
  },
});
app.use(cors());
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
io.on("connection", (socket) => {
  console.log("a user connected with socket id ", socket.id);
  socket.on("chat message", (msg) => {
    io.emit("send_message_to_all_users", msg);
  });
  socket.on("typing", () => {
    socket.broadcast.emit("show_typing_status");
  });
  socket.on("stop_typing", () => {
    socket.broadcast.emit("clear_typing_status");
  });
  socket.on("disconnect", () => {
    console.log("left the chat with socket id " + socket.id);
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
