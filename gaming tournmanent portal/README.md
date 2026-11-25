# ELITE ARENA — Gaming Tournament Portal

ELITE ARENA is a responsive esports tournament portal built with React and Vite. Players can discover and join competitions, follow match schedules and standings, and manage their profile. Administrators and organizers can manage tournaments, teams, registrations, match results, and announcements.

> **Academic demo only:** Authentication and application data are stored in browser Local Storage. Passwords are not hashed, and Local Storage can be read or changed by the browser user. Do not use this authentication or these demo accounts for real users or production data.

## Technology

- React 18, JSX, Vite 6, JavaScript
- React Router DOM 7
- Lucide React icons
- HTML5, CSS3, responsive layouts
- Browser Local Storage for demo accounts, sessions, and portal data
- Vercel SPA rewrite configuration

## Modules and features

- **Competitor:** sign up, role-specific sign in/out, profile management, tournament discovery and registration, team directory and join requests, schedules, standings, announcements, and dashboard.
- **Administrator:** demo-only administrator login, user activation/suspension, tournament and team management, team join requests, registration review, match scheduling and results, leaderboard adjustment/recalculation, community moderation, report resolution, announcements, and operational analytics.
- **Organizer:** create and update tournaments, approve registrations, schedule matches, and report results.
- Public player directory and community feed with search/filtering, likes, and signed-in post creation.
- Responsive navigation, page refresh-safe React Router routes, search/filter controls, Local Storage persistence, and validation on forms.

## Project structure

```text
gaming tournmanent portal/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json
├── README.md
├── public/
│   └── assets/
│       ├── download.jpg
│       └── evelyn.3840x2160.mp4
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── Announcements.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── MatchSchedule.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── TeamList.jsx
│   │   ├── ToastProvider.jsx
│   │   ├── TournamentDetails.jsx
│   │   └── TournamentList.jsx
│   ├── context/
│   │   ├── ArenaContext.jsx
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AnnouncementsPage.jsx
│   │   ├── Home.jsx
│   │   ├── LeaderboardPage.jsx
│   │   ├── Login.jsx
│   │   ├── Matches.jsx
│   │   ├── OrganizerDashboard.jsx
│   │   ├── Players.jsx
│   │   ├── Profile.jsx
│   │   ├── Signup.jsx
│   │   ├── CommunityPage.jsx
│   │   ├── Teams.jsx
│   │   ├── Tournaments.jsx
│   │   └── UserDashboard.jsx
│   ├── services/
│   │   ├── arenaData.js
│   │   ├── authService.js
│   │   └── storageService.js
│   └── styles/
│       ├── auth.css
│       └── global.css
├── css/                    # Original ELITE ARENA styles; retained and reused
├── js/                     # Original modular app; retained for reference
├── login.html               # Original standalone page; retained
├── profile.html             # Original standalone page; retained
└── download.jpg and evelyn.3840x2160.mp4 # Original root media retained
```

The Vite application is the root `index.html` entry point, replacing the former monolithic HTML entry page. The original CSS and JavaScript modules and standalone login/profile pages remain in the project; they are not used as the React app entry point. The poster and video are copied into `public/assets/` for production asset URLs, while their original root files remain untouched.

## Admin demo login

- **Email:** `admin@arenaelite.gg`
- **Password:** `Admin@123`

Use the **Fill demo credentials** button on the sign-in page to populate these values. The demo administrator is predefined; ordinary accounts are created through Signup and are not hardcoded.

## Create and use a competitor account

1. Start the app using the instructions below.
2. Select **Sign in → Create an account** (or open `/signup`).
3. Enter full name, a unique email address, a password of at least 8 characters, and confirm the password.
4. Choose Competitor or Tournament organizer. Admin is not an available signup role.
5. After signup, the account is signed in automatically. Use the dashboard and navigation to explore its role-specific features.
6. Log out from the navigation bar. On the sign-in page, choose the matching role (User or Organizer), then sign in with the same email and password. The Admin option is reserved for the predefined demo account.

Portal data is saved in this browser profile. Clearing the browser's Local Storage removes the demo users and saved data.

## Install and run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). To verify the production bundle:

```bash
npm run build
npm run preview
```

## GitHub upload

From this project directory, create or select a GitHub repository, then stage and push the project:

```bash
git add .
git commit -m "Build Elite Arena React tournament portal"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repository>.git
git push -u origin main
```

If a remote is already configured, skip `git remote add origin`. Review `git status` before committing so unrelated files are not included.

## Deploy to Vercel

1. Run `npm install`.
2. Run `npm run dev` and open the local Vite URL.
3. Test signup/login/logout, each role dashboard, tournament registration, teams, schedules, standings, announcements, and admin/organizer actions.
4. Run `npm run build` and confirm the production build succeeds.
5. Upload the project to GitHub using the instructions above.
6. In Vercel, choose **Add New → Project** and import the GitHub repository.
7. Set **Root Directory** to `gaming tournmanent portal` when needed, use Build Command `npm run build` and Output Directory `dist`, then deploy.
8. Open the live Vercel URL and verify page refresh/deep links on `/login`, `/tournaments`, `/admin`, and the other app routes. `vercel.json` sends app routes to the SPA entry point.

## Validation checklist

- [x] React + Vite application with reusable JSX components and React Router routes.
- [x] Role-based signup, protected dashboards, session restore, login, and logout.
- [x] Local Storage persistence for accounts and tournament demo data.
- [x] Separate User, Admin, and Organizer sign-in roles with role/account matching and an admin-only protected route.
- [x] Tournament registration, team join requests, organizer workflows, match scoring, and standings updates.
- [x] Search/filter controls, profile management, responsive navigation and layouts.
- [x] Original assets, visual tokens, CSS, and vanilla source files retained.
- [x] Vercel SPA configuration and deployment instructions.
- [x] Production build (`npm run build`).
