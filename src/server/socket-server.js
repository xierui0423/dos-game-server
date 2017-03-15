import socketIo from 'socket.io';
import socketioJwt from 'socketio-jwt';
import cookieParser from 'cookie-parser';
import config from '../config';

// TODO Authentication
export default () => {
    const io = socketIo();

    io.use(socketioJwt.authorize({
        secret: config.server.authKey,
        handshake: true,
        extractor: (req) => {
            cookieParser()(req, undefined, () => {});
            return req.cookies && req.cookies.JWT;
        },
    }));

    let id = 0;
    const matches = [];

    io.sockets
        .on('connection', (socket) => {
            socket.user = {
                id: socket.decoded_token.userId,
            };

            // // once a client has connected,
            // // we expect to get a ping from them saying what room they want to join
            // socket.on('join:room', (room) => {
            //     socket.join(room);
            // });

            const currentMatch = matches.find(match => match.userIds.includes(socket.user.id));
            if (currentMatch) {
                socket.join(currentMatch.id);
            }
            socket.emit('fetch:match', currentMatch);

            socket.on('create:match', () => {
                if (currentMatch) {
                    socket.join(currentMatch.id);
                    socket.emit('fetch:match', currentMatch);
                } else {
                    const waitingMatch =
                              matches.find(match => match.userIds.length === 1);

                    if (waitingMatch) {
                        socket.join(waitingMatch.id);
                        waitingMatch.userIds.push(socket.user.id);
                        io.sockets.in(waitingMatch.id)
                            .emit('fetch:match', waitingMatch);
                    } else {
                        const newMatch = {
                            id: id += 1,
                            userIds: [socket.user.id],
                        };

                        matches.push(newMatch);

                        socket.join(newMatch.id);
                        socket.emit('fetch:match', newMatch);
                    }
                }
            });

            socket.on('send', (message) => {
                // socket.broadcast.to(message.room).emit('receive', message.message);
                io.sockets.in(message.room).emit('fetch:record', {
                    senderId: socket.user.id,
                    message: message.message,
                });

                // io.sockets.emit('fetch:record', {
                //     senderId: socket.id,
                //     message: message.message,
                // });
                // console.log(message);
            });
        });

    io.listen(config.server.port, () => {
        console.log('listening on http://localhost:9999');
    });
};
