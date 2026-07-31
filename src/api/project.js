import { useApi } from '@/services/api'
import { PROJECTS } from '@/constant/apiSetting'
import { objectToQueryParams } from '~/utils/format'

const request = useApi()

export const getProjects = async (data) => {
  const res = await request.get(`${PROJECTS.GET_PROJECT}?${objectToQueryParams(data)}`)
  return res
}

export const addProject = async (data) => {
  const res = await request.post(PROJECTS.GET_PROJECT, data)
  return res
}

export const editProject = async (id, data) => {
  const res = await request.patch(`${PROJECTS.GET_PROJECT}${id}/`, data)
  return res
}

export const deleteProject = async (id) => {
  const res = await request.delete(`${PROJECTS.GET_PROJECT}${id}/`)
  return res
}
