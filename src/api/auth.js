import api from '@/services/api' 
import { AUTH_API } from '@/constant/apiSetting'

export const login = async (data) => {
    const res = await api.post(AUTH_API.LOGIN, data)
    return res.data
}
    