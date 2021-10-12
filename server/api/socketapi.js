const io = require('socket.io');
const socketapi = {
    io
};


const serverMessage = (socket, type, user) => {
    let message = type === 'welcome' ? '' : 'join' ? '' : 'disconnect' ? '' : null;
    switch (type) {
        case 'join':
            socket.broadcast.emit('message', message);
            break;
        case 'welcome':
            socket.emit('message', 'Welcome to iChat!');
            break;
        case 'disconnect':
            socket.emit('message', `${user ? user : 'A user'} has left the chat`)
        default:
            break;
    }
}

const userMessage = (socket, msg) => {
    socket.emit('message', msg)
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