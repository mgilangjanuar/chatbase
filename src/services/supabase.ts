import { createClient } from '@supabase/supabase-js'
import axios, { AxiosResponse } from 'axios'

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL as string
const supabaseKey: string = process.env.REACT_APP_SUPABASE_PUBLIC_KEY as string
export const supabase = createClient(supabaseUrl, supabaseKey)

export async function supabaseUpload(path: string, data: File, onUploadProgress: (progress: number) => void): Promise<AxiosResponse> {
  return await axios.post(`${supabaseUrl}/storage/v1/object/${path}`, data, {
    headers: (supabase as any)._getAuthHeaders(),
    onUploadProgress: (progressEvent) => {
      const progress = progressEvent.loaded / progressEvent.total
      onUploadProgress(progress)
    }
  })
}

export async function supabaseDownload(path: string, onDownloadProgress: (progress: number) => void): Promise<AxiosResponse> {
  return await axios.get(`${supabaseUrl}/storage/v1/object/${path}`, {
    headers: (supabase as any)._getAuthHeaders(),
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      const progress = progressEvent.loaded / progressEvent.total
      onDownloadProgress(progress)
    }
  })
}