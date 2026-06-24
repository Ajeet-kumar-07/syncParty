const API_URL =
    "http://localhost:5000";

document
.getElementById("createRoomBtn")
.addEventListener(
    "click",
    async ()=>{

        const username =
            document
            .getElementById(
                "username"
            )
            .value;

        if(!username){
            alert("Enter username");
            return;
        }

        localStorage.setItem(
            "username",
            username
        );

        const response =
            await fetch(
                `${API_URL}/api/rooms`,
                {
                    method:"POST"
                }
            );

        const data =
            await response.json();

        window.location =
            `room.html?room=${data.roomId}`;
    }
);

document
.getElementById("joinRoomBtn")
.addEventListener(
    "click",
    ()=>{

        const username =
            document
            .getElementById(
                "username"
            )
            .value;

        const roomId =
            document
            .getElementById(
                "roomId"
            )
            .value;

        localStorage.setItem(
            "username",
            username
        );

        window.location =
            `room.html?room=${roomId}`;
    }
);