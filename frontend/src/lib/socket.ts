import { io } from "socket.io-client";

const socket=io(process.env.NEXT_PUBLIC_API_URL!,{
    withCredentials:true,
});

//Temporary code- for testing only
(window as any).socket=socket;

export default socket;