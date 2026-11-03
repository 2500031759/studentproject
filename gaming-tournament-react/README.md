# Arena Elite

Arena Elite is a React 19 + Vite tournament portal with separate player and administrator modules. It is designed as a review/demo app: accounts, event data, and registrations are saved in the current browser's local storage.

## Run locally

```sh
npm install
npm run dev
```

Create a player account from the home page, or use the administrator demo account:

| Module | Email | Password |
| --- | --- | --- |
| Admin | `admin@arenaelite.gg` | `Admin@123` |

### Player module

- Browse events and submit tournament registrations.
- Track pending, approved, and rejected entries.
- View the season leaderboard and community announcements.

### Admin module

- Review and approve/reject player registrations.
- Create tournaments and advance event status.
- View player accounts and publish/remove announcements.

The demo password is salted and hashed in the browser before storage. This is still **not production authentication**: local storage is controlled by the user, data is limited to one browser, and there is no server-side authorization or multi-device sync. Do not use real credentials or sensitive data.

## Build and preview

```sh
npm run build
npm run preview
```

## Deploy to Vercel

The `vercel.json` config sets the Vite build and output directory. Import the GitHub repository into Vercel and set **Root Directory** to `gaming-tournament-react`, or deploy from this folder using the Vercel CLI. Vercel will build with `npm run build` and serve `dist`.

The GitHub repository root contains other learning projects, so select `gaming-tournament-react` as the Vercel project root.
