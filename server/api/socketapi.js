const options = {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
}
const io = require('socket.io')(options);
const socketapi = {
    io
};

const formatMessage = require('../utils/messages')


const serverMessage = (socket, type, user) => {
    const botName = 'iChat Bot'
    let message = type === 'welcome' ? 'Welcome to iChat!' : 'join' ? 'A user has joined the chat' : 'disconnect' ? `${user ? user : 'A user'} has left the chat` : null;
    switch (type) {
        case 'join':
            socket.broadcast.emit('message', formatMessage(botName, message));
            break;
        case 'welcome':
            socket.emit('message', formatMessage(botName, message));
            break;
        case 'disconnect':
            socket.emit('message', formatMessage(botName, message))
        default:
            break;
    }
}

const userMessage = (socket, msg) => {
    socket.emit('message', formatMessage('USER', msg))
}



io.on('connection', socket => {
    // Welcome message
    serverMessage(socket, 'welcome');

    // Broadcast when a user connects
    serverMessage(socket, 'join');

    // Runs when client disconnects
    socket.on('disconnect', () => {
        serverMessage(io, 'disconnect')
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        userMessage(io, msg)
    })
})





module.exports = socketapi;