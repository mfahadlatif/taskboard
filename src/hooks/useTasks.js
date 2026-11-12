import { useEffect, useMemo, useReducer } from 'react'
import { initialState, reducer } from '../store/reducer'
import { createId } from '../utils/tasks'
import { readStorage } from './useLocalStorage'

const STORAGE_KEY = 'taskboard:data'

function loadState() {
  return { ...initialState, ...readStorage(STORAGE_KEY, {}) }
}

export function useTasks() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const actions = useMemo(
    () => ({
      addTask: (values) =>
        dispatch({ type: 'add', task: { ...values, id: createId(), createdAt: Date.now() } }),
      updateTask: (id, changes) => dispatch({ type: 'update', id, changes }),
      deleteTask: (id) => dispatch({ type: 'delete', id }),
    }),
    [],
  )

  return { ...state, ...actions }
}
