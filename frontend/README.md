# Library Frontend (Vite + React)# Library Management Frontend



Single-page application for the Library Management System built with Vite, React 18, and TypeScript.A modern React dashboard for the Library Management System backend. It surfaces real-time metrics, manages students/books, and streamlines borrowing workflows by calling the Flask API that lives in `../backend`.



## Prerequisites## Features



- Node.js 18+- 📊 **Dashboard metrics** for students, books, and staff

- pnpm / npm / yarn (examples use npm)- 👩‍🎓 **Student management**: add, toggle status, and delete

- Go API running locally on `http://localhost:5050` (or configure `VITE_API_BASE_URL`)- 📚 **Book catalog**: add new books, update availability, and remove entries

- 🔄 **Borrowing flow**: create borrow records, mark returns, view current loans

## Getting started- 🧠 **Database metadata**: inspect stored procedures, functions, and triggers

- 🌐 Configurable API base URL via `VITE_API_BASE_URL`

```bash

cd frontend## Getting Started

cp .env.example .env

npm install1. **Install dependencies** (from the `frontend` directory):

npm run dev

```   ```bash

   npm install

The development server starts on [http://localhost:5173](http://localhost:5173). Requests to `/api` are proxied to the Go backend if it runs on port 5050.   ```



## Scripts2. **Run the backend API** (from `../backend`):



| Command        | Description                             |   ```bash

| -------------- | --------------------------------------- |   python run.py

| `npm run dev`  | Start Vite development server           |   ```

| `npm run build`| Type-check and build production bundle  |

| `npm run check`| Type-check without emitting build files |3. **Start the React app** (in a new terminal, still inside `frontend`):

| `npm run preview` | Preview the production build locally |

   ```bash

## Project structure   npm run dev

   ```

```

frontend/   The app opens on [http://localhost:5173](http://localhost:5173) and expects the API at `http://localhost:5000`. Adjust the base URL by creating a `.env` file:

├── public/              # static assets (served as-is)

├── src/   ```bash

│   ├── api/             # API client for Go backend   echo "VITE_API_BASE_URL=http://localhost:5000" > .env

│   ├── components/      # UI components   ```

│   ├── pages/           # Route-based pages

│   ├── types/           # Shared TypeScript interfaces4. **Build for production**:

│   └── styles.css       # global styling

├── .env.example   ```bash

├── index.html   npm run build

├── package.json   ```

└── vite.config.ts

```## Project Structure



## Notes```

frontend/

- The `Students` page lets you add new students via the API.├── index.html

- Update `.env` if the backend runs on a different host/port.├── package.json

- For production, run `npm run build` and serve the resulting `dist/` folder (e.g. with Nginx or `vite preview`).    The app opens on [http://localhost:5173](http://localhost:5173) and expects the API at `http://localhost:5050`. Adjust the base URL by creating a `.env` file:

├── src/
│   ├── App.jsx
    echo "VITE_API_BASE_URL=http://localhost:5050" > .env
│   ├── components/
│   ├── hooks/
 `VITE_API_BASE_URL` – The base URL of the Flask backend. Defaults to `http://localhost:5050` if unset.
│   ├── main.jsx
│   └── styles.css
└── README.md
```

## Environment Variables

- `VITE_API_BASE_URL` – The base URL of the Flask backend. Defaults to `http://localhost:5000` if unset.

## Troubleshooting

- Ensure MySQL and the Flask backend are running before using the frontend.
- CORS must remain enabled in the backend (already configured via `flask-cors`).
- When encountering API errors, check the browser console and backend logs for details.
