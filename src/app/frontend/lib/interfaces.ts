export interface IApiResponse<T> {
  success: boolean
  data: {
    data: T
    status: number
  }
}
