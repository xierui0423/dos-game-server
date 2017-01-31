import io from 'socket.io';

export default () => {
    const socket = io();
    socket.on('connection', (client) => {
        client.emit('test', 'Hello');
    });
    socket.listen(9999);
};
