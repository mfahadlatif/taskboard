import { ACTIVITY_LIMIT } from '../constants'
import { timeAgo } from '../utils/date'

export default function ActivityLog({ entries, workspaces }) {
  if (entries.length === 0) {
    return <p className="muted small">Nothing yet. Your actions will show up here.</p>
  }

  const names = Object.fromEntries(workspaces.map((w) => [w.id, w.name]))

  return (
    <ul className="activity">
      {entries.slice(0, ACTIVITY_LIMIT).map((entry) => (
        <li key={entry.id} className="activity__item">
          <p>{entry.message}</p>
          <span className="muted small">
            {names[entry.workspaceId]} · {timeAgo(entry.at)}
          </span>
        </li>
      ))}
    </ul>
  )
}
