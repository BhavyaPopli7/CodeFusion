const express = require('express')
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const ACTIONS = require('./Actions');
const server = http.createServer(app);
const io = new Server(server);

//ye memory ke andar store krra h agar server restart hua toh ye data udd jayega
const userSocketMap = {};

function getAllConnectedClients(roomid){
    //Map
   return Array.from(io.sockets.adapter.rooms.get(roomid) || []).map((socketId) =>{
    return{
        socketId,
        username:userSocketMap[socketId],
    }
   });
}

io.on('connection', (socket) =>{
    console.log('socket connected', socket.id);

   socket.on(ACTIONS.JOIN, ({roomid,username}) => {
       userSocketMap[socket.id] = username;
       socket.join(roomid);

       const clients = getAllConnectedClients(roomid);
       console.log(clients);
       clients.forEach(({socketId}) =>{
        io.to(socketId).emit(ACTIONS.JOINED,{
            clients,
            username,
            socketId: socket.id,
        });
       });
   });

   
   socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
     socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
});

socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
});

   socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
            socketId: socket.id,
            username: userSocketMap[socket.id],
        });
    });
    delete userSocketMap[socket.id];
    socket.leave();
});
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));  