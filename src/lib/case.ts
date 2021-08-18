/* eslint-disable @typescript-eslint/no-explicit-any */
import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'

export const snakeCaseToCamelCase = (data: any): any => {
  if (Array.isArray(data)) return data.map(snakeCaseToCamelCase)

  if (!data || data.constructor?.name !== 'Object') return data

  return Object.keys(data).reduce((result, key) => {
    const value = snakeCaseToCamelCase(data[key])
    const keyValue = camelCase(key)
    return { ...result, [keyValue]: value }
  }, {})
}

export const camelCaseToSnakeCase = (data: any): any => {
  if (Array.isArray(data)) return data.map(camelCaseToSnakeCase)

  if (!data || data.constructor?.name !== 'Object') return data

  return Object.keys(data).reduce((result, key) => {
    const value = camelCaseToSnakeCase(data[key])
    return { ...result, [snakeCase(key)]: value }
  }, {})
}