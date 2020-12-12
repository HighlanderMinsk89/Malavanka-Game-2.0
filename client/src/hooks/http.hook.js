import { useState, useCallback } from 'react'
import axios from 'axios'

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(
    async (url, method = 'get', body = {}, headers = {}) => {
      setLoading(true)
      try {
        const { data } = await axios({
          method,
          url,
          data: body,
        })
        setTimeout(() => {
          setLoading(false)
        }, 700)
        return data
      } catch (error) {
        setLoading(false)
        setError(error.response.data.message)
      }
    },
    []
  )

  const clearError = useCallback(() => setError(null), [])

  return { request, loading, error, clearError }
}
