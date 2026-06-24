function generateRoomId(length = 6){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let roomId = "";

    for(let i =0 ;i<length ; i++){
        roomId += chars.charAt(
            Math.floor(Math.random()*chars.length)
        );
    }
    return roomId;
}

module.exports = generateRoomId;