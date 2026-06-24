const roomService = require("../services/roomService");

const createRoom = (req,res)=>{
    const room = roomService.createRoom();

    return res.status(201).json({
        success : true , 
        roomId : room.roomId
    });
};


const joinRoom = (req,res) => {
    try {
        const {roomId} = req.params;
        const {username} = req.body;

        if(!username || username.trim() === ""){
            return res.status(400).json({
                success:false,
                message : "username is required"
            });
        }

        const result = roomService.joinRoom(roomId,username.trim());

        return res.status(200).json({
            success:true,
            roomId,
            user : result.user ,
            hostId : result.room.hostId
        });
        
    }catch(error){
        return res.status(404).json({
            success:false,
            message : error.message
        });
    }
};

const getRoom = (req,res)=>{
    try{
        const room = roomService.getRoom(req.params.roomId);
        return res.status(200).json({
            success:true,
            room
        });

    }catch(error){
        return res.status(404).json({
            success:false,
            message : error.message
        });
    }
};



module.exports = {createRoom , joinRoom , getRoom};

