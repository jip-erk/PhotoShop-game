const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    addimage,
} = require("./users");



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }
});

io.on('connection', (socket) => {
    socket.on('join-room', (room, name, isAdmin) => {
        const user = addUser({ id: socket.id, name, room, isAdmin });

        socket.join(room);
        io.sockets.in(room).emit('connectToRoom', room, getUsersInRoom(room));
    })

    socket.on('start-game', (gameSettings, room) => {
        io.sockets.in(room).emit('start-game', gameSettings);
        startCountdownTimer(gameSettings.duration * 60, room)
    })

    socket.on("disconnecting", (reason) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                //console.log(getUser(socket.id));
                const user = getUser(socket.id);
                if (user.isAdmin) {
                    io.sockets.in(room).emit('adminDisconnect', user.name);
                }
                removeUser(socket.id);
                socket.leave(room);
                io.sockets.in(room).emit('connectToRoom', room, getUsersInRoom(room));
            }
        }
    });

    socket.on('playerImage', (playerImg) => {
        addimage(socket.id, playerImg);
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                io.sockets.in(room).emit('updateRoom', getUsersInRoom(room));
            }
        }

    })

    function startCountdownTimer(duration, room) {

        if (duration != 0) {
            const timer = setInterval(function() {
                duration -= 1;
                io.sockets.in(room).emit('timer-countdown', duration);
                if (duration <= 0) {
                    io.sockets.in(room).emit('timer-end');
                    clearInterval(timer);
                }
            }, 1000, duration);

        }
    }

    socket.on('start-voting', (room) => {
        io.sockets.in(room).emit('start-voting');
    })
});
const port = parseInt(process.env.PORT) || 8080;
server.listen(port, () => {
    console.log('listening on port: ' + port);
});