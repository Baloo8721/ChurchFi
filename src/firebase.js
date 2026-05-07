import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB03rgYczVFouPoTZYXgWKj7tguHauzufw",
  authDomain: "churchfi-7790b.firebaseapp.com",
  databaseURL: "https://churchfi-7790b-default-rtdb.firebaseio.com",
  projectId: "churchfi-7790b",
  storageBucket: "churchfi-7790b.firebasestorage.app",
  messagingSenderId: "876984642539",
  appId: "1:876984642539:web:ea6d337c3f443532e8c7ae"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function loadAllData() {
  try {
    const [usersSnap, eventsSnap, postsSnap, maintSnap, mapSnap] = await Promise.all([
      get(ref(db, "users")),
      get(ref(db, "events")),
      get(ref(db, "posts")),
      get(ref(db, "maintenance")),
      get(ref(db, "propertyMap/data"))
    ]);

    return {
      users: usersSnap.exists() ? Object.entries(usersSnap.val() || {}).map(([id, data]) => ({ id, ...data })) : [],
      events: eventsSnap.exists() ? Object.entries(eventsSnap.val() || {}).map(([id, data]) => ({ id, ...data })) : [],
      posts: postsSnap.exists() ? Object.entries(postsSnap.val() || {}).map(([id, data]) => ({ id, ...data })) : [],
      maintenance: maintSnap.exists() ? Object.entries(maintSnap.val() || {}).map(([id, data]) => ({ id, ...data })) : [],
      propertyMap: mapSnap.exists() ? mapSnap.val() : null
    };
  } catch (e) {
    console.error("Error loading data:", e);
    return null;
  }
}

export async function saveUsers(users) {
  try {
    await set(ref(db, "users"), users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {}));
    return true;
  } catch (e) {
    console.error("Error saving users:", e);
    return false;
  }
}

export async function saveEvents(events) {
  try {
    await set(ref(db, "events"), events.reduce((acc, e) => ({ ...acc, [e.id]: e }), {}));
    return true;
  } catch (e) {
    console.error("Error saving events:", e);
    return false;
  }
}

export async function savePosts(posts) {
  try {
    await set(ref(db, "posts"), posts.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}));
    return true;
  } catch (e) {
    console.error("Error saving posts:", e);
    return false;
  }
}

export async function saveMaintenance(maint) {
  try {
    await set(ref(db, "maintenance"), maint.reduce((acc, m) => ({ ...acc, [m.id]: m }), {}));
    return true;
  } catch (e) {
    console.error("Error saving maintenance:", e);
    return false;
  }
}

export async function savePropertyMap(mapData) {
  try {
    await set(ref(db, "propertyMap/data"), mapData);
    return true;
  } catch (e) {
    console.error("Error saving property map:", e);
    return false;
  }
}

export { db };