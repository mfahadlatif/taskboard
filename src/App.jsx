import { useMemo, useState } from 'react'
import { MenuIcon } from './components/Icons'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import TaskBoard from './components/TaskBoard'
import TaskForm from './components/TaskForm'
import { DEFAULT_FILTERS, STATUSES, WORKSPACES } from './constants'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTasks } from './hooks/useTasks'
import { filterTasks, sortByDueDate } from './utils/tasks'

export default function App() {
  const { tasks, activity, addTask, updateTask, deleteTask } = useTasks()
  const [workspaceId, setWorkspaceId] = useLocalStorage('taskboard:workspace', WORKSPACES[0].id)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [form, setForm] = useState({ open: false, task: null })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const workspace = WORKSPACES.find((w) => w.id === workspaceId) ?? WORKSPACES[0]
  const workspaceTasks = useMemo(
    () => tasks.filter((task) => task.workspaceId === workspace.id),
    [tasks, workspace.id],
  )

  const visibleTasks = useMemo(
    () => sortByDueDate(filterTasks(workspaceTasks, filters), filters.sort),
    [workspaceTasks, filters],
  )

  const counts = useMemo(
    () =>
      Object.fromEntries(
        WORKSPACES.map((w) => [w.id, tasks.filter((task) => task.workspaceId === w.id).length]),
      ),
    [tasks],
  )

  const columns = filters.status === 'All' ? STATUSES : [filters.status]

  function selectWorkspace(id) {
    setWorkspaceId(id)
    setFilters(DEFAULT_FILTERS)
    setSidebarOpen(false)
  }

  function handleSubmit(values) {
    if (form.task) updateTask(form.task.id, values)
    else addTask({ ...values, workspaceId: workspace.id })
    closeForm()
  }

  function handleDelete(task) {
    if (window.confirm(`Delete "${task.title}"?`)) deleteTask(task.id)
  }

  function closeForm() {
    setForm({ open: false, task: null })
  }

  return (
    <div className="layout">
      <Sidebar
        workspaces={WORKSPACES}
        activeId={workspace.id}
        counts={counts}
        activity={activity}
        open={sidebarOpen}
        onSelect={selectWorkspace}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main">
        <header className="main__header">
          <button
            className="icon-btn menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div>
            <h1>{workspace.name}</h1>
            <p className="muted">
              {workspaceTasks.length} {workspaceTasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          <button className="btn btn--primary" onClick={() => setForm({ open: true, task: null })}>
            + New task
          </button>
        </header>

        <Toolbar filters={filters} onChange={setFilters} />

        {workspaceTasks.length === 0 ? (
          <div className="empty">
            <p>No tasks in {workspace.name} yet.</p>
            <button className="btn" onClick={() => setForm({ open: true, task: null })}>
              Create your first task
            </button>
          </div>
        ) : (
          <TaskBoard
            tasks={visibleTasks}
            columns={columns}
            onMove={(id, status) => updateTask(id, { status })}
            onEdit={(task) => setForm({ open: true, task })}
            onDelete={handleDelete}
          />
        )}
      </main>

      {form.open && <TaskForm task={form.task} onSubmit={handleSubmit} onClose={closeForm} />}
    </div>
  )
}
