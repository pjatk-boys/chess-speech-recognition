
import axios, { AxiosError } from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

export class ChessMoveValidationError extends Error {
  constructor(options: ErrorOptions) {
    super('Undistinguishable move', options)
  }
}

type PostChessMoveAudioResponse = {
  call: string,
  text: string
}

export const postChessMoveAudio = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post<PostChessMoveAudioResponse>('/model/predict', formData).then(res => res.data).catch((err: AxiosError) => {
    switch(err.status) {
      case 422: throw ChessMoveValidationError;
      default: throw err
    }
  })
}