const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const port = 3001;
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("*", function (req, res) {
  res.sendfile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (user) => {
    socket.join(user);
    console.log(`User with ID: ${socket.id} joined room: ${user}`);
  });

  socket.on("chat", (data) => {
    io.emit("chat", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", (user) => {
    console.log(`User with ID: ${socket.id} left room: ${user}`);
  });
});

server.listen(3001, () => {
  console.log(`Server running http://localhost:${port}`);
});
