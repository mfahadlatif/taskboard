import { useState } from 'react'
import TaskCard from './TaskCard'

export default function TaskBoard({ tasks, columns, onMove, onEdit, onDelete }) {
  const [dragOver, setDragOver] = useState(null)

  // drag and drop
  function handleDragOver(e, status) {
    e.preventDefault()
    if (dragOver !== status) setDragOver(status)
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null)
  }

  function handleDrop(e, status) {
    e.preventDefault()
    setDragOver(null)

    const task = tasks.find((t) => t.id === e.dataTransfer.getData('text/plain'))
    if (task && task.status !== status) onMove(task.id, status)
  }

  return (
    <div className="board">
      {columns.map((status) => {
        const items = tasks.filter((task) => task.status === status)

        return (
          <section
            key={status}
            className={`column ${dragOver === status ? 'column--over' : ''}`}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
          >
            <header className="column__head">
              <h2>{status}</h2>
              <span className="count">{items.length}</span>
            </header>

            <div className="column__body">
              {items.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onMove={onMove}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              {items.length === 0 && <p className="column__empty">No matching tasks</p>}
            </div>
          </section>
        )
      })}
    </div>
  )
}
