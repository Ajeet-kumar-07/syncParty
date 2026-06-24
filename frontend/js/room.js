const API_URL =
    "http://localhost:5000";

const socket =
    io(API_URL);

const params =
    new URLSearchParams(
        window.location.search
    );

const roomId =
    params.get("room");

const invitelink = `${window.location.origin}/room.html?room=${roomId}`;

document.getElementById("inviteLink").value = invitelink;


document
.getElementById("copyLinkBtn")
.addEventListener(
    "click",
    async ()=>{

        await navigator.clipboard
        .writeText(
            document
            .getElementById(
                "inviteLink"
            )
            .value
        );

        alert("Copied!");
    }
);
const username =
    localStorage.getItem(
        "username"
    );

if(!username){
    window.location = `index.html?room=${roomId}`;
}

let userId = "";

const player = {

    title: "",

    duration: 180,

    currentTime: 0,

    isPlaying: false,

    interval: null
};

function log(message){

    const logs =
        document.getElementById(
            "logs"
        );

    logs.innerHTML +=
        `<div>${message}</div>`;
}

function formatTime(seconds){

    const mins =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return `${mins}:${String(secs)
        .padStart(2,"0")}`;
}

function renderPlayer(){

    document
        .getElementById(
            "songTitle"
        )
        .innerText =
        player.title || "No Song";

    document
        .getElementById(
            "timer"
        )
        .innerText =
        `${formatTime(
            player.currentTime
        )} / ${formatTime(
            player.duration
        )}`;
        document.getElementById(
        "progressBar"
        ).max =
        player.duration;

        document.getElementById(
        "progressBar"
        ).value =
        player.currentTime;
}

function stopTimer(){

    if(player.interval){

        clearInterval(
            player.interval
        );

        player.interval = null;
    }
}

function startTimer(){

    stopTimer();

    player.interval =
        setInterval(()=>{

            player.currentTime++;

            renderPlayer();

            if(
                player.currentTime >=
                player.duration
            ){

                player.currentTime =
                    player.duration;

                stopTimer();

                renderPlayer();

                if(
                    document
                    .getElementById(
                        "hostStatus"
                    )
                    .innerText ===
                    "HOST"
                ){

                    socket.emit(
                        "song-ended",
                        {
                            roomId
                        }
                    );
                }

                return;
            }

        },1000);
}

async function joinRoom(){

    document
        .getElementById(
            "roomId"
        )
        .innerText =
        roomId;

    document
        .getElementById(
            "username"
        )
        .innerText =
        username;

    const response =
        await fetch(
            `${API_URL}/api/rooms/${roomId}/join`,
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    username
                })
            }
        );

    const data =
        await response.json();

    if(!response.ok){alert(data.message || "join-failed");
        return;
    }

    userId =
        data.user.userId;

    socket.emit(
        "join-room",
        {
            roomId,
            username,
            userId
        }
    );

    localStorage.setItem(
        "username" , username
    );

    if(document.getElementById("hostStatus").innerText === "HOST"){
        socket.emit("song-ended",{roomId});
    }

    socket.emit(
        "sync-request",
        {
            roomId
        }
    );
}

function sendMessage(){
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if(!message)return;

    socket.emit("send-message",
        {roomId,
            message
        }
    );
    input.value = "";
    console.log(
    "MESSAGE SENT"
);
}

socket.on(
    "message-received",
    (data)=>{

        const chat =
            document.getElementById(
                "chatMessages"
            );

        const div =
            document.createElement(
                "div"
            );
        const time =
            new Date(
                data.timestamp
            ).toLocaleTimeString();

        div.innerHTML =
        `
        [${time}]
        <strong>
        ${data.username}
        </strong>:
        ${data.message}
        `;

        console.log(
    "MESSAGE RECEIVED",
    data
    );

        

        chat.appendChild(div);

        chat.scrollTop =
            chat.scrollHeight;
    }
);


joinRoom();

document.getElementById("chatInput").addEventListener("keydown",(event)=>{
    if(event.key === "Enter")sendMessage();
});


document
.getElementById("playBtn")
.onclick = ()=>{

    socket.emit(
        "play",
        { roomId }
    );
};

document
.getElementById("pauseBtn")
.onclick = ()=>{

    socket.emit(
        "pause",
        { roomId }
    );
};

document.getElementById("sendMessageBtn").addEventListener("click",sendMessage);

document
.getElementById("setSongBtn")
.onclick = ()=>{

    const title =
        document
        .getElementById(
            "songInput"
        )
        .value;

    socket.emit(
        "set-song",
        {
            roomId,

            song:{
                id:
                Date.now()
                .toString(),

                title,

                duration:180
            }
        }
    );
};

document
.getElementById("seekBtn")
.onclick = ()=>{

    socket.emit(
        "seek",
        {
            roomId,

            position:Number(
                document
                .getElementById(
                    "seekInput"
                )
                .value
            )
        }
    );
};

document
.getElementById("addSongBtn")
.onclick = ()=>{

    socket.emit(
        "add-song",
        {
            roomId,

            song:{
                id:
                Date.now()
                .toString(),

                title:
                document
                .getElementById(
                    "queueSong"
                )
                .value,

                duration:180
            }
        }
    );
};

socket.on(
    "song-changed",
    (song)=>{

        player.title =
            song.title;

        player.duration =
            song.duration;

        player.currentTime = 0;

        stopTimer();

        renderPlayer();

        log(
            `Song: ${song.title}`
        );
    }
);

socket.on(
    "play",
    ()=>{

        startTimer();

        log("PLAY");
    }
);

socket.on(
    "pause",
    (data)=>{

        player.currentTime =
            Math.floor(
                data.currentTime
            );

        stopTimer();

        renderPlayer();

        log("PAUSE");
    }
);

socket.on(
    "seek",
    (data)=>{

        player.currentTime =
            data.position;

        renderPlayer();

        log(
            `Seek ${data.position}`
        );
    }
);

socket.on(
    "queue-updated",
    (queue)=>{

        const ul =
            document
            .getElementById(
                "queue"
            );

        ul.innerHTML = "";

        queue.forEach(song=>{

            const li =
                document
                .createElement("li");

            li.innerText =
                song.title;

            ul.appendChild(li);
        });
    }
);

socket.on(
    "sync-state",
    (state)=>{

        player.currentTime =
            Math.floor(
                state.currentTime
            );

        player.isPlaying =
            state.isPlaying;

        player.title =
            state.currentSong?.title
            || "";

        player.duration =
            state.currentSong?.duration
            || 180;

        if(state.isPlaying){
            startTimer();
        }

        renderPlayer();
    }
);

socket.on(
    "host-changed",
    (data)=>{

        if(
            data.hostId === userId
        ){

            document
            .getElementById(
                "hostStatus"
            )
            .innerText =
            "HOST";
        }

        log(
            "Host changed"
        );
    }
);

socket.on(
    "users-updated",
    (data)=>{

        const ul =
            document.getElementById(
                "usersList"
            );

        ul.innerHTML = "";

        data.users.forEach(user=>{

            const li =
                document.createElement("li");

            if(data.hostId === userId){

    document
        .getElementById(
            "hostStatus"
        )
        .innerText = "HOST";

    document
        .getElementById(
            "hostControls"
        )
        .style.display = "block";

}else{

    document
        .getElementById(
            "hostStatus"
        )
        .innerText = "LISTENER";

    document
        .getElementById(
            "hostControls"
        )
        .style.display = "none";
}

            ul.appendChild(li);
        });

        if(
            data.hostId === userId
        ){

            document
            .getElementById(
                "hostStatus"
            )
            .innerText =
            "HOST";

        }else{

            document
            .getElementById(
                "hostStatus"
            )
            .innerText =
            "LISTENER";
        }
    }
);