import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const initialUserPromise = (async () => {
  await setPersistence(auth, browserLocalPersistence);
  return new Promise((resolve, reject) => {
    let unsubscribe = () => {};
    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
})();

function progressDocument(userId, scope) {
  return doc(database, "users", userId, "progress", scope);
}

function validItems(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.length > 0);
}

export async function setupAuthControls() {
  const button = document.querySelector("#auth-button");
  if (!button) return;

  try {
    const user = await initialUserPromise;
    button.textContent = user ? "Sign out" : "Sign in with Google";
    button.title = user?.email ? `Signed in as ${user.email}` : "Sign in to sync progress across devices";
    button.dataset.signedIn = String(Boolean(user));
  } catch (error) {
    button.textContent = "Sign in unavailable";
    button.disabled = true;
    console.error(error);
    return;
  }

  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      if (auth.currentUser) {
        await signOut(auth);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
      location.reload();
    } catch (error) {
      button.disabled = false;
      const store = new ProgressStore("auth");
      store.setStatus("error", "Google sign-in did not complete");
      console.error(error);
    }
  });
}

export class ProgressStore {
  constructor(scope, legacyStorageKey = "") {
    this.scope = scope;
    this.legacyStorageKey = legacyStorageKey;
    this.saveQueue = Promise.resolve();
  }

  async load() {
    const user = await initialUserPromise;
    const legacyItems = this.readLegacyItems();

    if (!user) {
      this.setStatus("local", "Sign in to sync progress");
      return legacyItems;
    }

    const snapshot = await getDoc(progressDocument(user.uid, this.scope));
    const cloudItems = validItems(snapshot.data()?.items);
    const mergedItems = [...new Set([...cloudItems, ...legacyItems])];

    if (legacyItems.length) {
      await this.replaceImmediately(mergedItems, user);
      this.removeLegacyItems();
      this.setStatus("saved", "Local progress moved to Firebase");
    } else {
      this.setStatus("saved", "Progress synced with Firebase");
    }
    return mergedItems;
  }

  replace(items) {
    const snapshot = [...new Set(items)];
    this.setStatus("saving", "Saving progress…");
    const operation = this.saveQueue
      .catch(() => undefined)
      .then(() => this.replaceImmediately(snapshot))
      .catch((error) => {
        this.setStatus("error", "Progress was not saved — please retry");
        throw error;
      });
    this.saveQueue = operation;
    return operation;
  }

  async replaceImmediately(items, knownUser = null) {
    const user = knownUser || await initialUserPromise;
    if (!user) {
      this.writeLegacyItems(items);
      this.setStatus("local", "Saved locally — sign in to sync");
      return { scope: this.scope, items };
    }

    await setDoc(progressDocument(user.uid, this.scope), {
      items,
      updatedAt: serverTimestamp()
    });
    this.setStatus("saved", "Progress synced with Firebase");
    return { scope: this.scope, items };
  }

  readLegacyItems() {
    if (!this.legacyStorageKey) return [];
    try {
      return validItems(JSON.parse(localStorage.getItem(this.legacyStorageKey) || "[]"));
    } catch {
      return [];
    }
  }

  writeLegacyItems(items) {
    if (!this.legacyStorageKey) {
      throw new Error("Sign in is required to save progress");
    }
    localStorage.setItem(this.legacyStorageKey, JSON.stringify(items));
  }

  removeLegacyItems() {
    if (!this.legacyStorageKey) return;
    try {
      localStorage.removeItem(this.legacyStorageKey);
    } catch {
      // Firebase persistence succeeded; inability to clean legacy storage is non-fatal.
    }
  }

  setStatus(state, message) {
    document.documentElement.dataset.progressState = state;
    const element = document.querySelector("#progress-status");
    if (!element) return;
    element.dataset.state = state;
    const text = element.querySelector("[data-progress-message]");
    if (text) text.textContent = message;
  }
}
