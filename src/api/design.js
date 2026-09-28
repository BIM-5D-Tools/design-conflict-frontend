import { useApi } from '@/services/api'
import { DESIGN } from '@/constant/apiSetting'
import { objectToQueryParams } from '~/utils/format'

const request = useApi()

export const getConflicts = async (data) => {
  const res = await request.get(`${DESIGN.GET_DESIGN_CONFLICT}?${objectToQueryParams(data)}`)
  return res
}

export const addConflict = async (data) => {
  const res = await request.post(DESIGN.GET_DESIGN_CONFLICT, data)
  return res
}

export const editConflict = async (id, data) => {
  const res = await request.patch(`${DESIGN.GET_DESIGN_CONFLICT}${id}/`, data)
  return res
}

export const deleteConflict = async (id) => {
  const res = await request.delete(`${DESIGN.GET_DESIGN_CONFLICT}${id}/`)
  return res
}

export const exportConflict = async (data) => {
  const res = await request.get(`${DESIGN.EXPORT_DESIGN_CONFLICT}?${objectToQueryParams(data)}`, {
    responseType: 'blob'
  })
  return res
}
