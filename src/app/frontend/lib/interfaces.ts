export interface IApiResponse<T> {
  success: boolean
  data: {
    dataConnection: T
    status: number
  }
}
