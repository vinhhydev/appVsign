import {io} from 'socket.io-client';
const socket = io.connect('http://192.168.101.102:3000/');
socket.on('disconnect', () => {
  socket.connect();
});

export default socket;
