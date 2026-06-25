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

export const deleteRepository = async (id: number): Promise<void> => {
  await api.delete(`/repositories/${id}`)
}

export const bulkDeleteRepositories = async (ids: number[]): Promise<{ deleted_count: number }> => {
  const response = await api.post('/repositories/bulk-delete', { repository_ids: ids })
  return response.data
}