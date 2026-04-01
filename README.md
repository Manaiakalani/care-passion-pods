# Care Activity Pods

A community platform for organizing and joining group activities ("pods"). Built with HTML, CSS, JavaScript, and Firebase Firestore.

## Features

- **Dashboard** — View all active pods with member counts and scheduled dates
- **Pod Proposals** — Browse proposed pods and be the first to join (which activates them)
- **Create a Pod** — Submit a new activity idea with details and requirements
- **Join Pods** — Join any proposed or active pod by providing your name
- **Set Date & Time** — Any visitor can set or update the date/time for an active pod

## How It Works

1. Someone creates a pod via the "Create a Pod" button — it appears on the **Pod Proposals** page
2. When another person clicks "Join" on a proposal, the pod becomes **active** and moves to the main dashboard
3. More people can join active pods from the dashboard
4. Anyone can set/update the date & time for an active pod

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase Firestore (real-time NoSQL database)
- **Hosting**: Can be deployed via Firebase Hosting, GitHub Pages, Netlify, or Vercel

## Running Locally

Open `index.html` in a web browser. The app connects to Firebase Firestore, so all data is shared in real-time across all visitors.

## Deploying

### Firebase Hosting (recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # select public directory as "."
firebase deploy
```

### GitHub Pages
Push to a GitHub repo and enable Pages in Settings → Pages → Source: main branch.
