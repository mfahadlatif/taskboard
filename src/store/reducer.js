import { ACTIVITY_LIMIT } from '../constants'
import { createId } from '../utils/tasks'

export const initialState = {
  tasks: [],
  activity: [],
}

function withActivity(activity, message, workspaceId) {
  const entry = { id: createId(), message, workspaceId, at: Date.now() }
  return [entry, ...activity].slice(0, ACTIVITY_LIMIT)
}

function describeUpdate(prev, next) {
  const fields = ['title', 'description', 'priority', 'dueDate']
  const onlyStatusChanged =
    prev.status !== next.status && fields.every((field) => prev[field] === next[field])

  if (onlyStatusChanged) return `"${next.title}" marked as ${next.status}`
  return `"${next.title}" updated`
}

export function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { task } = action
      return {
        tasks: [task, ...state.tasks],
        activity: withActivity(state.activity, `"${task.title}" created`, task.workspaceId),
      }
    }

    case 'update': {
      const prev = state.tasks.find((task) => task.id === action.id)
      if (!prev) return state

      const next = { ...prev, ...action.changes }
      return {
        tasks: state.tasks.map((task) => (task.id === action.id ? next : task)),
        activity: withActivity(state.activity, describeUpdate(prev, next), next.workspaceId),
      }
    }

    case 'delete': {
      const target = state.tasks.find((task) => task.id === action.id)
      if (!target) return state

      return {
        tasks: state.tasks.filter((task) => task.id !== action.id),
        activity: withActivity(state.activity, `"${target.title}" deleted`, target.workspaceId),
      }
    }

    default:
      return state
  }
}
