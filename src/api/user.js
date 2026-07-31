import { useApi } from '@/services/api'
import { USERS } from '@/constant/apiSetting'

const request = useApi()

export const getUsers = async () => {
  const res = await request.get(USERS.GET_USER)
  return res
}

export const addUser = async (data) => {
  const res = await request.post(USERS.GET_USER, data)
  return res
}

export const editUser = async (id, data) => {
  const res = await request.patch(`${USERS.GET_USER}${id}/`, data)
  return res
}

export const deleteUser = async (id) => {
  const res = await request.delete(`${USERS.GET_USER}${id}/`)
  return res
}

export const updateAppUser = async (id, data) => {
  const res = await request.post(`${USERS.GET_USER}${id}/update-app-permissions/`, data)
  return res
}

export const getApps = async () => {
  const res = await request.get(USERS.GET_APP)
  return res
}

export const addApp = async (data) => {
  const res = await request.post(USERS.GET_APP, data)
  return res
}

export const editApp = async (id, data) => {
  const res = await request.patch(`${USERS.GET_APP}${id}/`, data)
  return res
}

export const deleteApp = async (id) => {
  const res = await request.delete(`${USERS.GET_APP}${id}/`)
  return res
}
