const app = require("./app");
const http = require("http");

const {Server} = require("socket.io");


const resgisterRoomSocket = require("./sockets/roomSocket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server,{
    cors : {
        origin : "*"
    }
});


io.on("connection",(socket)=>{
    console.log("new connection :--- ",socket.id);
});

resgisterRoomSocket(io);

server.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`);
});

module.exports = io;
