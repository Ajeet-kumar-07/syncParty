// const API_URL =
//     "http://localhost:5000";

// const socket =
//     io(API_URL);

// let roomId = "";
// let username = "";
// let userId = "";

// function log(message){

//     const logs =
//         document.getElementById("logs");

//     logs.innerHTML +=
//         `<div>${message}</div>`;

//     logs.scrollTop =
//         logs.scrollHeight;
// }

// function updateState(data){

//     document
//         .getElementById("state")
//         .textContent =
//         JSON.stringify(
//             data,
//             null,
//             2
//         );
// }

// //
// // CREATE ROOM
// //

// document
// .getElementById("createRoomBtn")
// .addEventListener(
//     "click",
//     async ()=>{

//         const response =
//             await fetch(
//                 `${API_URL}/api/rooms`,
//                 {
//                     method:"POST"
//                 }
//             );

//         const data =
//             await response.json();

//         document
//             .getElementById(
//                 "createdRoomId"
//             )
//             .innerText =
//             data.roomId;

//         log(
//             `Room Created: ${data.roomId}`
//         );
//     }
// );

// //
// // JOIN ROOM
// //

// document
// .getElementById("joinBtn")
// .addEventListener(
//     "click",
//     async ()=>{

//         roomId =
//             document
//                 .getElementById(
//                     "roomId"
//                 )
//                 .value;

//         username =
//             document
//                 .getElementById(
//                     "username"
//                 )
//                 .value;

//         const response =
//             await fetch(
//                 `${API_URL}/api/rooms/${roomId}/join`,
//                 {
//                     method:"POST",

//                     headers:{
//                         "Content-Type":
//                         "application/json"
//                     },

//                     body:JSON.stringify({
//                         username
//                     })
//                 }
//             );

//         const data =
//             await response.json();

//         if(!data.success){

//             alert(data.message);

//             return;
//         }

//         userId =
//             data.user.userId;

//         socket.emit(
//             "join-room",
//             {
//                 roomId,
//                 username,
//                 userId
//             }
//         );

//         socket.emit(
//             "sync-request",
//             {
//                 roomId
//             }
//         );

//         log(
//             `${username} joined`
//         );
//     }
// );

// //
// // SET SONG
// //

// document
// .getElementById("setSongBtn")
// .addEventListener(
//     "click",
//     ()=>{

//         const title =
//             document
//             .getElementById(
//                 "songTitle"
//             )
//             .value;

//         socket.emit(
//             "set-song",
//             {
//                 roomId,

//                 song:{
//                     id:
//                     Date.now()
//                     .toString(),

//                     title,

//                     duration:180
//                 }
//             }
//         );
//     }
// );

// //
// // PLAY
// //

// document
// .getElementById("playBtn")
// .addEventListener(
//     "click",
//     ()=>{

//         socket.emit(
//             "play",
//             {
//                 roomId
//             }
//         );
//     }
// );

// //
// // PAUSE
// //

// document
// .getElementById("pauseBtn")
// .addEventListener(
//     "click",
//     ()=>{

//         socket.emit(
//             "pause",
//             {
//                 roomId
//             }
//         );
//     }
// );

// //
// // SEEK
// //

// document
// .getElementById("seekBtn")
// .addEventListener(
//     "click",
//     ()=>{

//         const position =
//             Number(
//                 document
//                 .getElementById(
//                     "seekPosition"
//                 )
//                 .value
//             );

//         socket.emit(
//             "seek",
//             {
//                 roomId,
//                 position
//             }
//         );
//     }
// );

// //
// // ADD SONG
// //

// document
// .getElementById("addSongBtn")
// .addEventListener(
//     "click",
//     ()=>{

//         const title =
//             document
//             .getElementById(
//                 "queueSong"
//             )
//             .value;

//         socket.emit(
//             "add-song",
//             {
//                 roomId,

//                 song:{
//                     id:
//                     Date.now()
//                     .toString(),

//                     title,

//                     duration:200
//                 }
//             }
//         );
//     }
// );

// //
// // SOCKET EVENTS
// //

// socket.on(
//     "connect",
//     ()=>{

//         log(
//             `Connected: ${socket.id}`
//         );
//     }
// );

// socket.on(
//     "user-joined",
//     (data)=>{

//         log(
//             `${data.username} joined`
//         );
//     }
// );

// socket.on(
//     "user-left",
//     (data)=>{

//         log(
//             `${data.username} left`
//         );
//     }
// );

// socket.on(
//     "play",
//     (data)=>{

//         log("PLAY");

//         updateState(data);
//     }
// );

// socket.on(
//     "pause",
//     (data)=>{

//         log("PAUSE");

//         updateState(data);
//     }
// );

// socket.on(
//     "seek",
//     (data)=>{

//         log(
//             `SEEK ${data.position}`
//         );

//         updateState(data);
//     }
// );

// socket.on(
//     "song-changed",
//     (song)=>{

//         log(
//             `SONG: ${song.title}`
//         );

//         updateState(song);
//     }
// );

// socket.on(
//     "queue-updated",
//     (queue)=>{

//         log(
//             `QUEUE UPDATED`
//         );

//         updateState(queue);
//     }
// );

// socket.on(
//     "sync-state",
//     (state)=>{

//         log(
//             "SYNC STATE"
//         );

//         updateState(state);
//     }
// );

// socket.on(
//     "host-changed",
//     (data)=>{

//         log(
//             `NEW HOST: ${data.hostId}`
//         );

//         updateState(data);
//     }
// );