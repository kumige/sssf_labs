'use strict';

const socket = io();
let room = "Room 1"

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const inp = document.getElementById('m');
  const user = document.getElementById('u');
  const msg = `${user.value}: ${inp.value}`
  socket.emit('chat message', msg, room);
  inp.value = '';
});

const chooseRoom = (element) => {
  console.log(element.innerHTML)
  room = element.innerHTML
  document.getElementById('rooms_title').innerHTML = `In ${room}`
  socket.emit('room change', room);
}

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.innerHTML = msg;
  document.getElementById('messages').appendChild(item);
});
