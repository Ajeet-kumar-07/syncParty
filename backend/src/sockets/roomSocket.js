const socketUsers =
    require("../services/socketStore");

const rooms = require("../services/roomStore");

// const song ={
//     id:"song123",
//     title : "hello",
//     duration : 102
// };


function broadcastUsers(io,roomId){
    const room = rooms.get(roomId);

    if(!room) return ; 

    io.to(roomId).emit("users-updated" ,{
        users : room.users,
        hostId : room.hostId
    });
}

function getActualPosition(musicState) {

    if (
        !musicState.isPlaying ||
        !musicState.startedAt
    ) {
        return musicState.currentTime;
    }

    return (
        musicState.currentTime +
        (Date.now() - musicState.startedAt) / 1000
    );
}

function isHost(room,user){
    return (
        user&&
        room &&
        user.userId === room.hostId
    );
}

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log(`Connected: ${socket.id}`);

        socket.on(
            "join-room",
            ({ roomId, username ,userId}) => {

                socket.join(roomId);

                socketUsers.set(
                    socket.id,
                    {
                        roomId,
                        username,
                        userId
                    }
                );

                console.log(
                    `${username} joined ${roomId}`
                );

                io.to(roomId).emit(
                    "user-joined" ,
                    {
                        username
                    }
                );

                broadcastUsers(io,roomId);

            }
        );

        

        socket.on(
            "play",
            ({roomId}) => {
                const room = rooms.get(roomId);
                if(!room) return ;
                
                const user = socketUsers.get(socket.id);
                if(!isHost(room,user)) return;
                room.musicState.isPlaying = true ;
                room.musicState.startedAt = Date.now();
                room.musicState.updatedAt = Date.now();
                // room.musicState.lastUpdated = Date.now();
                io.to(roomId).emit(
                    "play",{
                        currentSong: room.musicState.currentSong
                    }
                );
            }
        );

        socket.on(
            "set-song",
            ({roomId,song})=>{
                const room = rooms.get(roomId);

                if(!room) return;

                const user = socketUsers.get(socket.id);

                if(!isHost(room,user)) return;


                room.musicState.currentSong = song;

                room.musicState.currentTime = 0 ;

                room.musicState.isPlaying = false;

                room.musicState.startedAt = null ;

                room.musicState.updatedAt = Date.now();

                io.to(roomId).emit(
                    "song-changed",
                    song
                );
            }
        );

        socket.on(
            "pause" , ({roomId}) => {
                const room = rooms.get(roomId);
                if(!room) return;

                const user = socketUsers.get(socket.id);

                if(!isHost(room,user)) return;

                const currentPosition = getActualPosition(room.musicState);

                room.musicState.currentTime = currentPosition;

                room.musicState.isPlaying = false;

                room.musicState.updatedAt = Date.now();

                io.to(roomId).emit(
                    "pause",
                    {
                        currentTime : currentPosition
                    }
                );
            }
        );

        socket.on(
            "sync-request",
            ({roomId}) => {
                const room = rooms.get(roomId);
                if(!room) return;

                const actualPosition = getActualPosition(room.musicState);

                socket.emit(
                    "sync-state",
                    {
                        ...room.musicState,
                        currentTime:actualPosition
                    }
                );
            }
        );

        socket.on(
            "add-song",
            ({roomId,song})=>{
                const room = rooms.get(roomId);
                if(!room) return;

                const user = socketUsers.get(socket.id);

if(!isHost(room,user)) return;

                if(!room.queue){
                    room.queue = [];
                }


                room.queue.push(song);
                io.to(roomId).emit(
                    "queue-updated",
                    room.queue
                );
            }
        );

        socket.on(
            "remove-song",
            ({roomId,songId})=>{

                const room = rooms.get(roomId);

                if(!room)return;

                const user = socketUsers.get(socket.id);

                if(!isHost(room,user)) return;
                room.queue = room.queue.filter(s=>s.id !== songId);

                io.to(roomId).emit(
                    "queue-updated",
                    room.queue
                );

            }
        );



        socket.on(
            "seek" , 
            ({roomId,position}) => {
                const room = rooms.get(roomId);

                if(!room) return;

                const user = socketUsers.get(socket.id);

                if(!isHost(room,user)) return;

                room.musicState.currentTime = position ; 

                if(room.musicState.isPlaying){
                    room.musicState.startedAt = Date.now();
                }

                // room.musicState.startedAt = Date.now();
                room.musicState.updatedAt = Date.now();
                io.to(roomId).emit(
                    "seek",
                    {
                        position
                    }
                );
            }
        )
        socket.on(
            "disconnect",
            () => {

                const user =
                    socketUsers.get(
                        socket.id
                    );

                if (!user) return;

                const room =
                    rooms.get(
                        user.roomId
                    );

                if (room) {

                    room.users =
                        room.users.filter(
                            u =>
                                u.userId !==
                                user.userId
                        );

                    if (
                        room.hostId ===
                        user.userId
                    ) {

                        room.hostId =
                            room.users[0]?.userId ||
                            null;
                    }

                    broadcastUsers(
                        io,
                        user.roomId
                    );
                }

                io.to(
                    user.roomId
                ).emit(
                    "user-left",
                    {
                        username:
                            user.username
                    }
                );

                socketUsers.delete(
                    socket.id
                );

                console.log(
                    `Disconnected: ${socket.id}`
                );
            }
        );

        socket.on(
        "song-ended",
        ({ roomId }) => {

            const room =
                rooms.get(roomId);

            if (!room) return;

            const user =
                socketUsers.get(
                    socket.id
                );

            if (
                !isHost(room,user)
            ) return;

            if (
                room.queue.length === 0
            ) {

                room.musicState.isPlaying =
                    false;

                io.to(roomId).emit(
                    "queue-empty"
                );

                return;
            }

            const nextSong =
                room.queue.shift();

            room.musicState.currentSong =
                nextSong;

            room.musicState.currentTime =
                0;

            room.musicState.startedAt =
                Date.now();

            room.musicState.isPlaying =
                true;

            io.to(roomId).emit(
                "queue-updated",
                room.queue
            );

            io.to(roomId).emit(
                "song-changed",
                nextSong
            );

            io.to(roomId).emit(
                "play",
                {
                    currentSong:
                        nextSong
                }
            );
        }
    );

    socket.on(
        "send-message",({roomId,message})=>{
            const user = socketUsers.get(socket.id);

            if(!user) return;

            io.to(roomId).emit("message-received",{
                username:user.username,
                message,
                timestamp:Date.now()
            });
        }
    );


    });

};