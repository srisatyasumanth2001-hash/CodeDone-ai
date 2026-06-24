import { useState, useCallback, useRef } from "react";
import type { Message, Conversation, StreamMetadata } from "../types";   
import { getConversation, getConversations } from "../api/chat";    

export function useChat(){
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null)
    const [activeConversationTitle, setActiveConversationTitle] = useState<string>("")
    const [isStreaming, setIsStreaming] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = useCallback(()=>{
        messagesEndRef.current?.scrollIntoView({behavior:'smooth'})
    },[])

    const loadConversations = useCallback(async ()=>{
        try{
            const data = await getConversations()
            setConversations(data)
        }catch(error){
            console.error('Failed to load conversation:', error)
        }
    },[])

    const openConversation = useCallback(async (conversationId : number)=>{
        setIsLoading(true)
        try{
            const data = await getConversation(conversationId)
            setActiveConversationId(data.id)
            setActiveConversationTitle(data.title)
            setMessages(data.messages)
            setTimeout(scrollToBottom,100)
        }catch(error){
            console.error('Failed to load conversation: ', error)
        }finally {
            setIsLoading(false)
        }
    },[scrollToBottom])

    const startNewConversation = useCallback(()=>{
        setActiveConversationId(null)
        setActiveConversationTitle('New Conversation')
        setMessages([])
    },[])

    const deleteConversationById = useCallback(async (conversationId: number) => {
    // remove from sidebar immediately
    setConversations(prev => prev.filter(c => c.id !== conversationId))

    // if it was the active conversation, clear the chat panel
    if (activeConversationId === conversationId) {
        setActiveConversationId(null)
        setActiveConversationTitle('')
        setMessages([])
    }
    }, [activeConversationId])

    const sendMessage = useCallback(async(userMessage: string)=>{
        if(!userMessage.trim() || isStreaming) return

        const userMsg : Message ={
            id: Date.now(),
            role: 'user',
            content: userMessage
        }
        setMessages(prev=>[...prev, userMsg])
        setTimeout(scrollToBottom,50)

        const aiPlaceholder: Message = {
            id: Date.now() + 1,
            role: 'assistant',
            content: ''
        }
        setMessages(prev=>[...prev, aiPlaceholder])
        setIsStreaming(true)

        try{
            const token = localStorage.getItem('access_token')

            const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
                method : 'post',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({
                    conversation_id : activeConversationId,
                    message: userMessage
                })
            })
            if(!response.ok){
                throw new Error('stream request failed');
            }
            const reader = response.body!.getReader()
            const decoder = new TextDecoder()
            let buffer =''

            while(true){
                const {done, value} =  await reader?.read()

                if(done) break
                buffer += decoder.decode(value, {stream:true})
                const lines = buffer.split("\n\n")
                buffer = lines.pop() || ""
                for(const line of lines){
                    if (!line.trim()) continue
                    const dataStr =line.replace(/^data:\s*/, '').trim()

                    if(dataStr === '[DONE]'){
                        setIsStreaming(false)
                        await loadConversations()
                        break
                    }
                    try{
                        const event = JSON.parse(dataStr)
                       if (event.type === 'metadata') {
                            const metadata = event.data as StreamMetadata
                            setActiveConversationId(metadata.conversation_id)

                            // patch the user message's fake id with the real one
                            if (metadata.user_message_id) {
                                setMessages(prev => {
                                    const updated = [...prev]
                                    const userIndex = updated.length - 2   // AI placeholder is last, user msg before it
                                    if (userIndex >= 0 && updated[userIndex].role === 'user') {
                                        updated[userIndex] = { ...updated[userIndex], id: metadata.user_message_id! }
                                    }
                                    return updated
                                })
                            }
                        }

                            else if (event.type === 'assistant_message_id') {
                                // patch the AI message's fake id with the real one
                                setMessages(prev => {
                                    const updated = [...prev]
                                    const lastMessage = updated[updated.length - 1]
                                    if (lastMessage.role === 'assistant') {
                                        return [
                                            ...updated.slice(0, -1),
                                            { ...lastMessage, id: event.data }
                                        ]
                                    }
                                    return updated
                                })
                            }
                        else if(event.type === 'token'){
                            setMessages(prev => {
                                const updated =[...prev]
                                const lastMessage = updated[updated.length -1]
                                if (lastMessage.role ==='assistant'){
                                    return[
                                        ...updated.slice(0,-1),
                                        {...lastMessage, content: lastMessage.content+ event.data}
                                    ]
                                }
                                return updated
                            })
                            scrollToBottom()
                        }
                        else if(event.type === 'title'){
                            console.log("Title Event Hit")
                            setActiveConversationTitle(event.data)
                            await loadConversations()
                        }
                    }catch{

                    }
                }

            }
        }catch(error){
            console.error('Streaming error:', error)
            setMessages(prev=>prev.filter(m=>m.content!==''))
        }finally{
            setIsStreaming(false)
        }
    },[activeConversationId, isStreaming, loadConversations, scrollToBottom])
    return {
    conversations,
    messages,
    activeConversationId,
    activeConversationTitle,
    isStreaming,
    isLoading,
    messagesEndRef,
    loadConversations,
    openConversation,
    startNewConversation,
    sendMessage,
    deleteConversationById
  }

}