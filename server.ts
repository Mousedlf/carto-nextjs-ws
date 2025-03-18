const http = require('http');
const socketIo = require('socket.io');

let users = [];

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
        console.log('Position reçue:', position);

        const existingUser = users.find(user => user.id === socket.id);

        if (!existingUser) {
            users.push({ id: socket.id, position: position });
            console.log("Liste des utilisateurs:", users);
        } else {
            existingUser.position = position;
            console.log("Liste des utilisateurs:", users);
        }

        socket.broadcast.emit('receiveLocation', {id: socket.id, position});
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.id !== socket.id);
        console.log('Utilisateur déconnecté:', socket.id);
        console.log("Liste des utilisateurs:", users);
        socket.broadcast.emit('removeUser', socket.id);
    });
});

const port = 8081
server.listen(port, () => {
    console.log('Serveur WebSocket démarré sur http://localhost:'+port);
});
