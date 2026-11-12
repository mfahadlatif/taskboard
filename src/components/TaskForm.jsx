import { useEffect, useState } from 'react'
import { PRIORITIES, STATUSES } from '../constants'
import { todayISO } from '../utils/date'
import { TITLE_MAX, validateTask } from '../utils/tasks'
import { CloseIcon } from './Icons'

const EMPTY_TASK = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
  dueDate: '',
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}

export default function TaskForm({ task, onSubmit, onClose }) {
  const [values, setValues] = useState(() => {
    if (!task) return EMPTY_TASK
    const { title, description, priority, status, dueDate } = task
    return { title, description, priority, status, dueDate }
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const today = todayISO()
  const minDate = task && task.dueDate < today ? task.dueDate : today

  useEffect(() => {
    const onKeyDown = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function update(field) {
    return (e) => {
      const next = { ...values, [field]: e.target.value }
      setValues(next)
      if (submitted) setErrors(validateTask(next, { originalDueDate: task?.dueDate }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = validateTask(values, { originalDueDate: task?.dueDate })
    setErrors(found)
    setSubmitted(true)

    if (Object.keys(found).length > 0) return

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    })
  }

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal__panel" onSubmit={handleSubmit} noValidate>
        <header className="modal__head">
          <h2>{task ? 'Edit task' : 'New task'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        <Field label="Title" error={errors.title}>
          <input
            className={`input ${errors.title ? 'input--invalid' : ''}`}
            value={values.title}
            onChange={update('title')}
            placeholder={`Up to ${TITLE_MAX} characters`}
            autoFocus
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            className={`input ${errors.description ? 'input--invalid' : ''}`}
            rows={4}
            value={values.description}
            onChange={update('description')}
          />
        </Field>

        <div className="field-row">
          <Field label="Priority" error={errors.priority}>
            <select className="input" value={values.priority} onChange={update('priority')}>
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>

          <Field label="Status" error={errors.status}>
            <select className="input" value={values.status} onChange={update('status')}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Due date" error={errors.dueDate}>
          <input
            type="date"
            className={`input ${errors.dueDate ? 'input--invalid' : ''}`}
            value={values.dueDate}
            min={minDate}
            onChange={update('dueDate')}
            onClick={(e) => e.currentTarget.showPicker?.()}
          />
        </Field>

        <footer className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {task ? 'Save changes' : 'Create task'}
          </button>
        </footer>
      </form>
    </div>
  )
}
