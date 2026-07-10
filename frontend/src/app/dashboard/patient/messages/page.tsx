"use client"
import React, { useEffect, useState } from 'react'

const PatientMessages = () => {
    const [profile,setProfile]=useState<any>(null);
    const [conversations,setConversations]=useState<any[]>([]);
    const [selectedConversation,setSelectedConversation]=useState<any>(null);
    const [messages,setMessages]=useState<any[]>([]);
    const [content,setContent]=useState<string>("");

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

  return (
    <div className='bg-gray-100 flex'>
        <aside className='hidden lg:block bg-white min-h-screen w-64 shadow-md p-6'>
            <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
            <p className='text-xl font-semibold mb-4'>Conversations</p>
            <div className='space-y-2'>
                {conversations.map((conversation)=>(
                    <div key={conversation.id} 
                    onClick={()=>{setSelectedConversation(conversation);fetchMessages(conversation.id)}}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedConversation?.id===conversation.id?"bg-green-200":"hover:bg-green-100"
                    }`}>
                        <p className='font-semibold'>{conversation.name}</p>
                    </div>
                ))}
            </div>
        </aside>
        <main className='flex-1 p-8 min-h-screen flex flex-col'>
            {/*Chat Header */}
            <div className='border-b border-gray-300 p-4'>
                <h2 className='text-xl font-bold'>Select a conversation</h2>
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
                                <div className={`max-w-xs px-4 py-2 rounded-lg ${isMine?"bg-green-600 text-white":"bg-white text-black"}`}>
                                    <p>{message.content}</p>
                                    <p className='text-xs mt-2 opacity-70'>{new Date(message.sentat).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
            {/*Input */}
            <div className='border-t border-gray-300 p-4 flex gap-3'>
                <input type="text" placeholder='Type your message here...' className='flex-1 border rounded-lg px-4 py-2 bg-white'/>
                <button className='bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 cursor-pointer'>Send</button>
            </div>
        </main>
    </div>
  )
}

export default PatientMessages