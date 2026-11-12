import { DEFAULT_FILTERS, PRIORITIES, STATUSES } from '../constants'

export default function Toolbar({ filters, onChange }) {
  const set = (field) => (e) => onChange({ ...filters, [field]: e.target.value })

  const isFiltered =
    filters.query !== '' || filters.status !== 'All' || filters.priority !== 'All'

  return (
    <div className="toolbar">
      <input
        type="search"
        className="input toolbar__search"
        placeholder="Search by title or description"
        value={filters.query}
        onChange={set('query')}
      />

      <select className="input" value={filters.status} onChange={set('status')} aria-label="Status">
        <option value="All">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <select
        className="input"
        value={filters.priority}
        onChange={set('priority')}
        aria-label="Priority"
      >
        <option value="All">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <select className="input" value={filters.sort} onChange={set('sort')} aria-label="Sort">
        <option value="asc">Due date: oldest first</option>
        <option value="desc">Due date: newest first</option>
      </select>

      {isFiltered && (
        <button className="btn btn--ghost" onClick={() => onChange(DEFAULT_FILTERS)}>
          Clear
        </button>
      )}
    </div>
  )
}
