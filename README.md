# Coptic Learning Website

This is a code bundle for Coptic Learning Website. The original project is available at https://www.figma.com/design/1q1mIVLVY1zQeLyEr2j5FZ/Coptic-Learning-Website.

## Local setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and fill in your Firebase config values.
3. Start development server:
   `npm run dev`

## Firebase setup

1. Create a Firebase project.
2. Enable `Authentication` -> `Sign-in method` -> `Google`.
3. Create a Firestore database.
4. In `Authentication` -> `Settings` -> `Authorized domains`, add your GitHub Pages domain (`<username>.github.io`).
5. Add your app's web config values into `.env` using the `VITE_FIREBASE_*` keys in `.env.example`.

## Deploying to GitHub Pages

This repo includes a workflow at `.github/workflows/deploy-pages.yml` that deploys the `dist` folder to GitHub Pages on every push to `main`.

In your GitHub repo settings:
1. Go to `Settings` -> `Pages`.
2. Set `Source` to `GitHub Actions`.
3. Add repository secrets for:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

Push to `main` and GitHub will publish your site at your Pages URL.

## Firestore security rules (recommended)

This repository now includes `firestore.rules` with:
- Admin access for `whiteh4tter@gmail.com`
- Organization-scoped leaderboard/profile reads
- Admin-only user reassignment across organizations
- Limited self-updates for user progress and initial org selection

Deploy rules with Firebase CLI:

1. Install CLI (if needed): `npm i -g firebase-tools`
2. Login: `firebase login`
3. Select project: `firebase use <your-project-id>`
4. Deploy rules: `firebase deploy --only firestore:rules`

Previous baseline example:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
