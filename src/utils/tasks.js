import { PRIORITIES, STATUSES } from '../constants'
import { todayISO } from './date'

export const TITLE_MAX = 80

export function createId() {
  return crypto.randomUUID()
}

// search and filters
export function filterTasks(tasks, { query = '', status = 'All', priority = 'All' }) {
  const q = query.trim().toLowerCase()

  return tasks.filter((task) => {
    if (status !== 'All' && task.status !== status) return false
    if (priority !== 'All' && task.priority !== priority) return false
    if (!q) return true

    return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q)
  })
}

export function sortByDueDate(tasks, order = 'asc') {
  const direction = order === 'asc' ? 1 : -1
  return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate) * direction)
}

export function validateTask(values, { today = todayISO(), originalDueDate } = {}) {
  const errors = {}
  const title = values.title.trim()

  if (!title) errors.title = 'Title is required'
  else if (title.length > TITLE_MAX) errors.title = `Title must be under ${TITLE_MAX} characters`

  if (!values.description.trim()) errors.description = 'Description is required'

  if (!PRIORITIES.includes(values.priority)) errors.priority = 'Select a priority'

  if (!STATUSES.includes(values.status)) errors.status = 'Select a status'

  // existing tasks can keep their old date
  if (!values.dueDate) errors.dueDate = 'Due date is required'
  else if (values.dueDate < today && values.dueDate !== originalDueDate) {
    errors.dueDate = 'Due date cannot be in the past'
  }

  return errors
}

export function isOverdue(task, today = todayISO()) {
  return task.status !== 'Done' && task.dueDate < today
}
