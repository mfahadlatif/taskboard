import { useState } from 'react'
import { STATUSES } from '../constants'
import { formatDate } from '../utils/date'
import { EditIcon, TrashIcon } from './Icons'
import { isOverdue } from '../utils/tasks'

export default function TaskCard({ task, onMove, onEdit, onDelete }) {
  const [dragging, setDragging] = useState(false)
  const overdue = isOverdue(task)

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
    setDragging(true)
  }

  return (
    <article
      className={`card ${dragging ? 'card--dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setDragging(false)}
    >
      <div className="card__top">
        <span className={`badge badge--${task.priority.toLowerCase()}`}>{task.priority}</span>
        <div className="card__actions">
          <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task">
            <EditIcon />
          </button>
          <button
            className="icon-btn icon-btn--danger"
            onClick={() => onDelete(task)}
            aria-label="Delete task"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <h3 className={`card__title ${task.status === 'Done' ? 'card__title--done' : ''}`}>
        {task.title}
      </h3>
      <p className="card__desc">{task.description}</p>

      <div className="card__footer">
        <span className={`due ${overdue ? 'due--overdue' : ''}`}>
          {overdue ? 'Overdue · ' : 'Due '}
          {formatDate(task.dueDate)}
        </span>
        <select
          className="card__status"
          value={task.status}
          onChange={(e) => onMove(task.id, e.target.value)}
          aria-label="Change status"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
    </article>
  )
}
