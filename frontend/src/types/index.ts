
export interface User {
  id: number
  email: string
  full_name: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface SignupData {
  email: string
  password: string
  full_name: string
}

export interface LoginData {
  email: string
  password: string
}

export interface Message{
  id : number,
  role: "user" | "assistant",
  content: string,
  created_at?: string
}

export interface Conversation{
  id: number,
  title: string,
  created_at: string
}

export interface ConversationDetail{
  id: number,
  title: string,
  created_at: string,
  messages: Message[]
}

export interface StreamMetadata{
  conversation_id: number,
  is_first_message: boolean
}