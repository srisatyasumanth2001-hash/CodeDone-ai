import api from './axios'
import type { Conversation, ConversationDetail } from '../types'

export const getConversations = async (): Promise<Conversation[]> =>{
    const response = await api.get('/chat/conversations')
    return response.data
}

export const getConversation = async (id:number): Promise<ConversationDetail>=>{
    const response = await api.get(`/chat/conversations/${id}`)
    return response.data
}

export const createConversation = async (): Promise<Conversation>=>{
    const response = await api.post('/chat/conversations')
    return response.data
}

export const deleteConversation = async (id:number): Promise<void>=>{
    await api.delete(`/chat/conversations/${id}`)
}