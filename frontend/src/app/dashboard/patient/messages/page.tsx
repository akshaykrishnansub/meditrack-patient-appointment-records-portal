"use client"
import socket from '@/lib/socket';
import React, { useEffect, useState } from 'react'

const PatientMessages = () => {
    const [profile,setProfile]=useState<any>(null);
    const [conversations,setConversations]=useState<any[]>([]);
    const [selectedConversation,setSelectedConversation]=useState<any>(null);
    const [messages,setMessages]=useState<any[]>([]);
    const [content,setContent]=useState<string>("");
    const [showChat,setShowChat]=useState<boolean>(false);

    const handleSend=()=>{
        if(!content.trim())
            return;
        if(!selectedConversation)
            return;

        socket.emit("send-message",{
            senderId:profile.id,
            receiverId:selectedConversation.id,
            content
        })
        //Immediately update the UI
        setMessages((prev:any[])=>[
            ...prev,{
                id: crypto.randomUUID(),
                senderid:profile.id,
                receiverid:selectedConversation.id,
                content,
                sentat:new Date().toISOString()
            }
        ])
        setContent("");
    }

    const fetchProfile=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/auth/me",{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                alert(data.error);
                return;
            }
            setProfile(data.user);
        }catch(err){
            console.error(err);
            alert("Something went wrong");
        }
    }

    const fetchConversations=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/messages/conversations",{
                credentials:"include"
            })

            const data=await res.json();
            if(!res.ok){
                alert(data.error);
                return;
            }
            console.log(data);
            setConversations(data.conversations);
        }catch(err){
            console.error(err);
            alert("Something went wrong");
        }
    }

    const fetchMessages=async(userId:string)=>{
        try{
            const res=await fetch(`http://localhost:5000/api/messages/${userId}`,{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                alert(data.error);
                return;
            }
            console.log(data);
            setMessages(data.messages);
        }catch(err){
            console.error(err);
            alert("Something went wrong");
        }
    }

    useEffect(()=>{
        fetchProfile();
        fetchConversations();
    },[]);

    useEffect(()=>{
    if(!profile?.id)
      return;

    const joinRoom=()=>{
      socket.emit("join-room",profile.id);
      console.log("Patient Joined the room",profile.id);
    }

    if(socket.connected){
      joinRoom();
    }else{
      socket.once("connect",joinRoom)
    }
    return ()=>{
      socket.off("connect",joinRoom);
    }
  },[profile])

  useEffect(()=>{
    socket.on("receive-message",(message)=>{
      console.log("Real Time message:",message);
      if(selectedConversation && message.senderid === selectedConversation.id){
        setMessages((prev)=>[...prev,message]);
      }
    })

    return ()=>{
      socket.off("receive-message");
    }
  },[selectedConversation]);


  return (
    <div className=' bg-gray-100 flex h-dvh overflow-hidden'>
        <aside className={`${showChat?"hidden":"block"} lg:block h-full bg-white shadow-md w-full lg:w-64 p-6 overflow-y-auto`}>
            <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
            <p className='text-xl font-semibold mb-4'>Conversations</p>
            <div className='space-y-2'>
                {conversations.map((conversation)=>(
                    <div key={conversation.id} 
                    onClick={()=>{setSelectedConversation(conversation);fetchMessages(conversation.id);setShowChat(true)}}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedConversation?.id===conversation.id?"bg-green-200":"hover:bg-green-100"
                    }`}>
                        <p className='font-semibold'>Dr.{" "}{conversation.name}</p>
                    </div>
                ))}
            </div>
        </aside>
        <main className={`flex-1 flex flex-col h-full bg-gray-100 ${showChat ? "block" : "hidden"} lg:flex`}>
            {/*Chat Header */}
            <div className='border-b border-gray-300 p-4'>
                <button onClick={() => setShowChat(false)} className="lg:hidden mb-3 text-green-700 font-semibold">← Back</button>
                <h2 className='text-xl font-bold'>{selectedConversation?selectedConversation.name:"Select a conversation"}</h2>
            </div>
            {/*Messages*/}
            <div className='flex-1 overflow-y-auto p-4'>
                {messages.length===0?(
                    <p className='text-gray-500'>No Messages yet.</p>
                ):(
                    messages.map((message:any)=>{
                        const isMine=message.senderid===profile?.id;
                        return(
                            <div key={message.id} className={`flex mb-3 ${isMine?"justify-end":"justify-start"}`}>
                                <div className={`max-w-[80%] md:max-w-xs px-4 py-2 rounded-lg ${isMine?"bg-green-600 text-white":"bg-white text-black"}`}>
                                    <p>{message.content}</p>
                                    <p className='text-xs mt-2 opacity-70'>{new Date(message.sentat).toLocaleDateString("en",{hour:"2-digit",minute:"2-digit"})}</p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
            {/*Input */}
            <div className='border-t border-gray-300 p-3 flex gap-2 bg-gray-100'>
                <input type="text" value={content} onChange={(e)=>setContent(e.target.value)} placeholder='Type your message here...' className="flex-1 border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"/>
                <button onClick={handleSend} className="bg-green-700 text-white px-5 rounded-lg hover:bg-green-800 transition">Send</button>
            </div>
        </main>
    </div>
  )
}

export default PatientMessages