const rooms = require("./roomStore");

const updatePlayState = (roomId,isPlaying) =>{
    const room = rooms.get(roomId);

    if(!room){
        throw new Error("room not found");
    }

    room.musicState.isPlaying = isPlaying;
    room.musicState.lastUpdated = Date.now();
    return room.musicState;

}

module.exports =  {updatePlayState} ;
