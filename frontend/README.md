# PointBridge Frontend

React + Vite + TanStack Router website for PointBridge Consulting.

## Tech stack

- **React 19** + **Vite 7**
- **TanStack Router** + React Query
- **Tailwind CSS** + shadcn/ui

## Local development

```bash
npm install
npm run dev
```

Website runs at **http://localhost:5173**

The dev server proxies `/api` to `http://localhost:3000` — run the backend separately.

## Environment variables

Copy `.env.example` to `.env.local` for production preview:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `https://pointbridge-api.onrender.com`) |

Leave empty in local dev to use the Vite proxy.

---

## Step 1 — Push to GitHub (separate repo)

Create a **new empty repo** on GitHub, e.g. `pointbridge-frontend`, then:

```bash
cd Frontend
git init
git add .
git commit -m "Initial commit: PointBridge frontend website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pointbridge-frontend.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo `pointbridge-frontend`
3. Vercel auto-detects **Vite** — keep defaults:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable**:

   ```
   VITE_API_URL=https://pointbridge-api.onrender.com
   ```

   Use your actual Render backend URL (no trailing slash).

5. Click **Deploy**

Your site URL will be like: `https://pointbridge-frontend.vercel.app`

---

## After deployment

1. Copy your **Vercel URL**
2. In **Render** backend settings, set:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   SITE_URL=https://your-app.vercel.app
   ```
3. Redeploy backend if CORS was blocking requests

## Admin panel

- **URL:** `https://your-app.vercel.app/admin/login`
- Use admin credentials from backend `ADMIN_EMAIL` / `ADMIN_PASSWORD`

## Production build

```bash
npm run build
npm run preview
```
