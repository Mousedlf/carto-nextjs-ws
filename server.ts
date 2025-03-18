const http = require('http');
const socketIo = require('socket.io');

let users = {};

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('serveur nodejs en fonctionnement');
});

const io = socketIo(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: "http://localhost:3000", // adresse front-end
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté:', socket.id);

    socket.on('sendLocation', (position) => {
        users[socket.id] = position;
        console.log('Position reçue:', position);

        socket.broadcast.emit('receiveLocation', {id: socket.id, position});
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        console.log('Utilisateur déconnecté:', socket.id);
    });
});

server.listen(8080, () => {
    console.log('Serveur WebSocket démarré sur http://localhost:8080');
});
