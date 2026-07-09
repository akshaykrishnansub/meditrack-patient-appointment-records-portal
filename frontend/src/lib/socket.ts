import { io } from "socket.io-client";

const socket=io("http://localhost:5000",{
    withCredentials:true,
});

//Temporary code- for testing only
(window as any).socket=socket;

export default socket;