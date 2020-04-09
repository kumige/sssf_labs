'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.join("Room 1")
  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
  });

  socket.on('chat message', (msg, room) => {
    console.log('message: ', msg);
    io.to(room).emit('chat message', msg)
  });

  socket.on('room change', (room) => {
    console.log('changing room to: ', room);
    socket.join(room)
  });
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});
