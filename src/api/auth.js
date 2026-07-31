import { useApi } from '@/services/api'
import { AUTH_API } from '@/constant/apiSetting'

const request = useApi()

export const login = async (data) => {
  const res = await request.post(AUTH_API.LOGIN, data)
  return res
}

export const getInfo = async () => {
  const res = await request.get(AUTH_API.GET_USER)
  return res
}
