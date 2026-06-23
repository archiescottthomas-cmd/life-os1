# Life OS

Single-file PWA, no build step. Edit `life-os.html` directly, push to `main`,
GitHub Pages picks it up automatically at:
https://archiescottthomas-cmd.github.io/life-os1/life-os.html

The service worker now fetches the app shell network-first, so a refresh on
your phone (no reinstall needed) gets the latest version after every push.

## Source code style

The app is written with [htm](https://github.com/developit/htm) (JSX-like
tagged template literals) + React, both loaded from CDN — no Babel, no
bundler. Just edit the `<script>` block in `life-os.html` and reload.

## Cross-device sync (optional)

The app works fully offline/local-only with no setup. To sync data across
devices (e.g. phone + laptop), set up a free Firebase project once:

1. Go to https://console.firebase.google.com → **Add project** (free Spark plan).
2. **Build → Firestore Database → Create database** (any region, production mode is fine).
3. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**
4. In Firestore, go to **Rules** and replace with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /synced/{syncId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   Publish the rules.
5. Project settings (gear icon, top left) → **General** → scroll to **Your apps** → **Add app → Web (`</>`)** → register (no hosting setup needed) → copy the `firebaseConfig` object shown.
6. Paste those values into `firebase-config.js` in this repo, commit, push.

The `syncId` in `firebase-config.js` is already a random pre-generated value —
leave it as is unless you want to start a fresh sync state. Data is gated by
that opaque id, not a real login, so this is "good enough for a personal habit
tracker," not bank-grade — don't put anything sensitive in the Finance tab
that you wouldn't want exposed if the syncId ever leaked.
