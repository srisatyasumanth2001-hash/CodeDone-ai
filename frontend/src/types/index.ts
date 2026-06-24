
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
  is_first_message: boolean,
  user_message_id?: number
}

export interface UploadedFile{
  id : number,
  original_filename : string,
  file_type : string,
  file_size : number,
  created_at : string
}

export interface UploadResponse {
  file_id: number
  filename: string
  file_type: string
  file_size: number
  word_count: number
  message: string
}

export interface ChunkResult {
  chunk_text: string
  similarity: number
  document_id: number
}

export interface SearchResult {
  sources: ChunkResult[]
  answer: string
  query: string
}

export interface Repository {
  id: number
  repo_url: string
  owner: string
  repo_name: string
  status: 'pending' | 'ingesting' | 'completed' | 'failed'
  files_ingested: number
}

export interface DailyActivity{
  date: string
  messages: number
}

export interface DashboardStats {
  total_conversations: number
  total_messages: number
  total_files: number
  uploaded_documents: number
  repository_files: number
  total_repositories: number
  total_embedded_chunks: number
  estimated_tokens_used: number
  daily_activity: DailyActivity[]
}

export interface SavedResponse {
  id: number
  content: string
  conversation_title: string | null
  note: string | null
  created_at: string
}