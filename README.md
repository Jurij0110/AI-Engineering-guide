# AI Engineer Field Guide

A dependency-free learning application designed for GitHub Pages. Roadmap and course-library progress can be synchronized across devices with Firebase Authentication and Cloud Firestore.

## Run locally

Python is only used as a static development server:

```powershell
cd D:\AI-course
python -m http.server 8000
```

Open <http://localhost:8000>. Firebase Authentication must list `localhost` as an authorized domain. Do not open the HTML files directly because Firebase browser modules require an HTTP origin.

## Firebase setup

The public web configuration is stored in `assets/js/firebase-config.js`. It is safe to expose Firebase web configuration in a frontend; access control is enforced by Authentication and Firestore Security Rules. Never commit a service-account JSON file or private key.

Enable Google as a provider in **Firebase Console → Authentication → Sign-in method**, then add these authorized domains:

```text
localhost
jurij0110.github.io
```

Create a Standard Cloud Firestore database and publish these rules:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/progress/{scopeId} {
      allow read: if request.auth != null
                  && request.auth.uid == userId;

      allow create, update: if request.auth != null
                            && request.auth.uid == userId
                            && request.resource.data.keys()
                                 .hasOnly(['items', 'updatedAt'])
                            && request.resource.data.items is list
                            && request.resource.data.items.size() <= 10000;

      allow delete: if request.auth != null
                    && request.auth.uid == userId;
    }
  }
}
```

Progress documents are created automatically at:

```text
users/{firebaseUserId}/progress/{scope}
```

The scope is `roadmap` or `library:<course-id>`. Existing progress from the former browser-only storage is merged into Firestore on the first authenticated load and then removed locally.

## Deploy with GitHub Pages

1. Commit and push the static source to GitHub.
2. Open the repository's **Settings → Pages**.
3. Deploy from the desired branch and root directory.
4. Open <https://jurij0110.github.io/AI-Engineering-guide/>.
5. Sign in with Google, complete one lesson, refresh, and confirm the lesson remains complete.

No Python server or SQLite database is used in production.

## Pages

- `index.html` — AI engineering roadmap and lesson tracker.
- `courses.html` — catalog of configured course libraries.
- `course-library.html?id=...` — repository index and hierarchical progress tracker.
- `ibm-ai-engineering.html` — compatibility redirect for the original IBM URL.

## Source structure

```text
AI-course/
|-- index.html
|-- courses.html
|-- course-library.html
|-- ibm-ai-engineering.html
`-- assets/
    |-- css/
    |-- data/
    |   `-- course-libraries.js
    `-- js/
        |-- firebase-config.js
        |-- progress-store.js
        |-- course-catalog/
        |-- course-library/
        `-- roadmap/
```

## Add another course library

Add one object to `window.COURSE_LIBRARIES` in `assets/data/course-libraries.js`. Its `id` becomes the Firestore scope suffix. `progressStorageKey` is retained only to migrate old browser progress.
