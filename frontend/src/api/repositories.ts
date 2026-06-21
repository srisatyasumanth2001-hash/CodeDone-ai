import api from './axios'
import type { Repository } from '../types'

export const connectRepository = async (repoUrl: string): Promise<Repository> => {
  const response = await api.post('/repositories/connect', { repo_url: repoUrl })
  return response.data
}

export const getRepository = async (id: number): Promise<Repository> => {
  const response = await api.get(`/repositories/${id}`)
  return response.data
}

export const listRepositories = async (): Promise<Repository[]> => {
  const response = await api.get('/repositories/')
  return response.data
}