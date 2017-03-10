import socketIo from 'socket.io';
import socketioJwt from 'socketio-jwt';
import config from '../config';

// TODO Authentication
export default () => {
    const io = socketIo();

    // server.set('authorization', socketioJwt.authorize({
    //     secret: config.server.authKey,
    //     handshake: true,
    // }));

    io.sockets
        .on('connection', (socket) => {
            // once a client has connected,
            // we expect to get a ping from them saying what room they want to join
            socket.on('join:room', (room) => {
                socket.join(room);
            });

            socket.on('send', (message) => {
                // socket.broadcast.to(message.room).emit('receive', message.message);
                io.sockets.in(message.room).emit('receive:message', {
                    senderId: socket.id,
                    message: message.message,
                });
                // console.log(message);
            });
        });

    io.listen(config.server.port, () => {
        console.log('listening on http://localhost:9999');
    });
};
