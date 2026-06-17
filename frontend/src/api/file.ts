import api from './axios'
import type { UploadResponse, UploadedFile } from '../types'

export const uploadFile = async (file: File): Promise<UploadResponse> =>{
    const formData = new FormData()
    formData.append('file', file)

    const response =  await api.post('/files/upload', formData,{
        headers:{
            'Content-Type' : 'multipart/form-data'
        }
    })
    return response.data
}

export const getFiles = async (): Promise<UploadedFile[]> =>{
    const response = await api.get('/files/')
    return response.data
}

export const deleteFile = async(fileId: number): Promise<void>=>{
    await api.delete(`/files/${fileId}`)
}