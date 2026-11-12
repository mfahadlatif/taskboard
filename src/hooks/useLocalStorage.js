import { useEffect, useState } from 'react'

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => readStorage(key, fallback))

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
