import api from './axios'
import type { SavedResponse } from '../types'

export const saveResponse = async (
  messageId: number, content: string, conversationTitle?: string
): Promise<SavedResponse> => {
  const response = await api.post('/saved/', {
    message_id: messageId,
    content,
    conversation_title: conversationTitle
  })
  return response.data
}

export const getSavedResponses = async (): Promise<SavedResponse[]> => {
  const response = await api.get('/saved/')
  return response.data
}

export const deleteSavedResponse = async (id: number): Promise<void> => {
  await api.delete(`/saved/${id}`)
}