import ActivityLog from './ActivityLog'
import { CloseIcon } from './Icons'

export default function Sidebar({ workspaces, activeId, counts, activity, open, onSelect, onClose }) {
  return (
    <>
      <div className={`backdrop ${open ? 'backdrop--visible' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="logo">T</span>
          Taskboard
          <button className="icon-btn close-btn" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <nav className="sidebar__section">
          <h3 className="sidebar__label">Workspaces</h3>
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              className={`nav-item ${workspace.id === activeId ? 'nav-item--active' : ''}`}
              onClick={() => onSelect(workspace.id)}
            >
              <span>{workspace.name}</span>
              <span className="count">{counts[workspace.id]}</span>
            </button>
          ))}
        </nav>

        <section className="sidebar__section">
          <h3 className="sidebar__label">Recent activity</h3>
          <ActivityLog entries={activity} workspaces={workspaces} />
        </section>
      </aside>
    </>
  )
}
