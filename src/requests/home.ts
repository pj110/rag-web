/**
 * 首页卡片汇总统计
 */
export const apiGetConfig = async () => {
  return await requests.get('/api/config')
}

export const apiChat = async (data: { message: string, id: string }) => {
  return await requests.post('/api/chat', data)
}

/**
 * 上传文件
 * @param file
 * @param onProgress
 */
export const uploadFile = async (file: File, onProgress?: (percent: number) => void): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  return await requests.post<string>(
    '/api/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      },
    },
  )
}
