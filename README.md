# John Symaiah M. Dagooc — Portfolio

Cinematic dark/neon portfolio. React 19 + Vite frontend on **Firebase Hosting**, FastAPI backend on **Render** (no database — JSON file for visitor tracking, SMTP for contact emails), CI/CD via **GitHub Actions**.

---

## Stack

| Layer    | Tech                                          |
| -------- | --------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Lenis |
| Backend  | FastAPI, httpx, smtplib (stdlib)              |
| Storage  | JSON file on Render disk (visitor locations)  |
| Hosting  | Firebase Hosting (frontend)                   |
| API      | Render Web Service (backend)                  |
| CI/CD    | GitHub Actions                                |

---

## Local Development

### Prerequisites
- Node 20+
- Python 3.11+

### 1. Clone
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Fill in SMTP_USER and SMTP_PASS (see .env.example for instructions)
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env.local
# Set VITE_BACKEND_URL=http://localhost:8000 in .env.local
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## Deploy — Step by Step

### A. GitHub
1. Create a new repo on GitHub (e.g. `portfolio`).
2. From the `app/` folder:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

### B. Render (Backend)
1. Go to [dashboard.render.com](https://dashboard.render.com) → **New → Web Service**.
2. Connect your GitHub repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3
4. Add Environment Variables:

   | Key            | Value                                         |
   | -------------- | --------------------------------------------- |
   | `CORS_ORIGINS` | `https://YOUR_FIREBASE_APP.web.app`           |
   | `SMTP_HOST`    | `smtp.gmail.com`                              |
   | `SMTP_PORT`    | `587`                                         |
   | `SMTP_USER`    | `johndagooc2@gmail.com`                       |
   | `SMTP_PASS`    | your 16-char Gmail App Password               |
   | `SMTP_TO_EMAIL`| `johndagooc2@gmail.com`                       |
   | `UPLOAD_PIN`   | `jsd-owner-2026`                              |

5. Deploy — note your service URL (e.g. `https://portfolio-backend.onrender.com`).
6. Copy the **Deploy Hook URL** from Settings → for the GitHub Actions secret below.

> **Gmail App Password**: Google Account → Security → 2-Step Verification → App passwords → generate one for "Mail".

### C. Firebase Hosting (Frontend)
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → create project.
2. Note the **Project ID** and edit `.firebaserc` — replace `YOUR_FIREBASE_PROJECT_ID`.
3. Install Firebase CLI and log in:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
4. Build and deploy manually (first time):
   ```bash
   cd frontend
   npm run build
   cd ..
   firebase deploy --only hosting
   ```
5. Wire up GitHub Actions for automatic deploys:
   ```bash
   firebase init hosting:github
   # Follow prompts — auto-creates FIREBASE_SERVICE_ACCOUNT_xxx GitHub secret
   ```

### D. GitHub Actions Secrets
In your GitHub repo → Settings → Secrets → Actions, add:

| Secret                    | Value                                                       |
| ------------------------- | ----------------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT` | JSON key auto-created by `firebase init hosting:github`   |
| `FIREBASE_PROJECT_ID`     | Your Firebase project ID                                    |
| `VITE_BACKEND_URL`        | `https://your-portfolio-backend.onrender.com`               |
| `RENDER_DEPLOY_HOOK_URL`  | From Render → Settings → Deploy Hook                        |

### E. Push and Watch
```bash
git add .
git commit -m "wire deployment"
git push origin main
```

GitHub Actions will:
1. **CI** — build-check frontend and syntax-check backend on every push/PR.
2. **Firebase Deploy** — rebuild and deploy frontend when `frontend/` changes.
3. **Render Deploy** — trigger Render rebuild when `backend/` changes.

---

## Visitor Globe

The footer shows a tiny rotating globe with gold dots for every country/city a visitor has loaded the site from.

- `App.js` fires `POST /api/visits/ping` on every page load (fire-and-forget).
- Backend resolves IP → lat/lon using [ip-api.com](http://ip-api.com) (free, no key needed).
- Locations are stored in `backend/visitor_locations.json` on Render's disk and served via `GET /api/visits/geo`.
- `FooterGlobe.jsx` fetches that endpoint and draws animated canvas dots on the spinning sphere.

---

## Profile Photo & Resume

Both assets live in `frontend/public/`:
- `profile.jpg` — shown in Hero and used as favicon
- `resume.pdf` — linked from the Resume section

Served as static files by Vite/Firebase at `/profile.jpg` and `/resume.pdf`.

---

## Environment Variables Reference

### Backend (`backend/.env`)
```
CORS_ORIGINS=https://your-app.web.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=johndagooc2@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_TO_EMAIL=johndagooc2@gmail.com
UPLOAD_PIN=jsd-owner-2026
```

### Frontend (`frontend/.env.local`)
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```
