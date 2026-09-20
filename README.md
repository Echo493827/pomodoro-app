# Cafe Pomodoro

A cozy cafe-themed study timer. Focus to brew, and your lifetime study
minutes unlock cafe recipes one by one. Comes with a focus dashboard,
embedded lofi music, changeable cafe scenes, accounts backed by Supabase,
and it installs to a phone or desktop as an app (PWA).

Built with React + Vite + Supabase.

---

## What's inside

- **Timer** — study / break blocks with presets, a smooth ring, and a
  soft chime when a block ends. Drift-free (it counts against a real
  end time, so background tabs stay accurate).
- **Recipes** — a menu of drinks that unlock as your total focus time
  grows. Each has ingredients and a method; simple ones (espresso) are
  short.
- **Dashboard** — lifetime focus, day streak, sessions this week, and a
  14-day bar chart. Signed-in only.
- **Ambiance** — bottom-right dock to switch cafe scenes and play lofi
  music. Music keeps playing as you move between pages.
- **Accounts** — email/password and Google sign-in via Supabase.
- **Installable** — add it to your home screen or desktop.

---

## 1. Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- A free [Supabase](https://supabase.com) project

## 2. Set up Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor > New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates
   the `profiles` and `sessions` tables, security policies, and a trigger
   that makes a profile automatically when someone signs up.
3. Go to **Authentication > Providers** and make sure **Email** is on.
   To enable Google, turn on **Google** and add your OAuth client ID and
   secret (Google Cloud Console > Credentials). Set the authorized
   redirect URL to the one Supabase shows you.
4. Go to **Project Settings > API** and copy the **Project URL** and the
   **anon public** key.

## 3. Configure the app

Copy the example env file and paste in your keys:

```bash
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The app still runs without these — the timer works and shows a setup
notice — but accounts, saved progress, and the dashboard need them.

## 4. Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## 5. Build for production

```bash
npm run build      # output goes to dist/
npm run preview    # preview the production build locally
```

---

## Deploy

Any static host works. Two easy options:

**Vercel** — import the repo at vercel.com, add the two `VITE_...` env
vars in project settings, and deploy. Framework preset: Vite.

**Netlify** — new site from the repo. Build command `npm run build`,
publish directory `dist`, and add the two env vars.

After deploying, add your live URL to Supabase under
**Authentication > URL Configuration** (Site URL and redirect URLs) so
email confirmation and Google sign-in redirect back correctly.

---

## Making it yours

- **Recipes** — edit [`src/data/recipes.js`](src/data/recipes.js). Copy
  an entry, give it a unique `id`, and set a `minutes` threshold. To add
  pastries later, add a `category` field and filter on the recipes page.
- **Scenes** — edit [`src/data/backgrounds.js`](src/data/backgrounds.js).
  Gradient scenes need no assets. To add a photo, drop a `.jpg` in
  `public/backgrounds/` and add an entry with `type: 'image'`.
- **Music** — edit [`src/data/streams.js`](src/data/streams.js). The
  seeded lofi stations are YouTube live-stream IDs; open each and swap
  any that have gone offline for streams you like.
- **Colors** — the whole palette lives in CSS variables at the top of
  [`src/index.css`](src/index.css).

## Notes

- The lofi streams play through an embedded YouTube player, so the audio
  and its licensing stay on YouTube's side. Confirm the stations in
  `streams.js` are live before you launch.
- `total_study_minutes` on the profile is the single source of truth for
  unlocks: a recipe is unlocked when your total reaches its threshold.
