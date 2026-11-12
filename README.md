# Taskboard

A small task management app for organizing tasks across workspaces, built with React and Vite.

## Features

- Two workspaces: Personal and Work
- Create, edit and delete tasks with a title, description, priority, status and due date
- Board with To Do, In Progress and Done columns, with drag and drop between them
- Live search by title or description
- Filter by status and priority together, and sort by due date
- Activity panel showing the last 5 actions
- Data saved in localStorage, so it stays after a refresh
- Form validation: required fields, title length limit, no past due dates
- Works on desktop and mobile

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start the dev server         |
| `npm run build`      | Build for production         |
| `npm run preview`    | Preview the production build |

## Project structure

```
src/
  App.jsx              main layout and app state
  constants.js         workspaces, statuses, priorities
  components/          UI components (board, card, form, sidebar, toolbar)
  hooks/               useTasks and useLocalStorage
  store/reducer.js     task actions and activity log
  utils/               filtering, sorting, validation and date helpers
  styles/app.css       all styles
```

## Notes

- When editing an existing task, its current due date is allowed even if it has already passed, so overdue tasks can still be updated.
- On touch devices, drag and drop isn't supported by the browser, so each card also has a status dropdown.
