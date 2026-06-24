const rooms = require("./roomStore");
const generateRoomId = require("../utils/generateRoomID");
const {v4 : uuidv4 } = require("uuid");

const createRoom = ()=>{
    let roomId;
    do{
        roomId = generateRoomId();
    }while(rooms.has(roomId));

    const room = {
        roomId,
        hostId : null , 
        users : [],
        queue : [],
        musicState : {
            currentSong: null,
            currentTime : 0 ,
            isPlaying : false,
            startedAt: null,
            updatedAt: Date.now()

        },
        createdAt : Date.now()
    };

    rooms.set(roomId,room);
    return room;
}

const joinRoom = (roomId,username)=>{
    const room = rooms.get(roomId);
    if(!room){
        throw new Error("room not found");
    }

    const user = {
        userId : uuidv4(),
        username,
        joinedAt : Date.now()
    };

    const existingUser = room.users.find(
        u => u.username === username
    );
    if(existingUser){
        throw new Error("username already exist in room");
    }

    room.users.push(user);

    if(!room.hostId){
        room.hostId = user.userId;
    }

    

    return {room,user};
};

const getRoom = (roomId) =>{
    const room = rooms.get(roomId);
    if(!room){
        throw new Error("room not found buddy :( ");
    }
    return room;
}

module.exports = {createRoom,joinRoom,getRoom};