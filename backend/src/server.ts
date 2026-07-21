import app from './app.js'
import pool from './db/connection.js'
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createMessage } from './models/message.model.js';

const PORT=process.env.PORT || 5000;

const httpServer=createServer(app);

//creating the socket.io server
const io=new Server(httpServer,{
    cors:{
        origin:process.env.FRONTEND_URL!,
        credentials:true
    },
})

//Listen for connections
io.on("connection",(socket)=>{
    console.log("Client connected:",socket.id);
    socket.on("join-room",(userId:string)=>{
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    })

    socket.on("send-message",async(data)=>{
        try{
            const message=await createMessage(
            data.senderId,
            data.receiverId,
            data.content
        );
        io.to(data.receiverId).emit("receive-message",message);
        console.log(`Message sent to room ${data.receiverId}`);
        }catch(err){
            console.error(err);
        }
    })

    socket.on("disconnect",()=>{
        console.log("Client disconnected:",socket.id);
    })
})

async function startServer(){
    try{
        await pool.query("SELECT 1");
        console.log("Postgres Connected");

        httpServer.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`);
        })

    }catch(err){
        console.error("❌ Database connection failed");
        console.error(err);

        process.exit(1);
    }
}

startServer();

export {io};