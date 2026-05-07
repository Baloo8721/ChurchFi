import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB03rgYczVFouPoTZYXgWKj7tguHauzufw",
  authDomain: "churchfi-7790b.firebaseapp.com",
  projectId: "churchfi-7790b",
  storageBucket: "churchfi-7790b.firebasestorage.app",
  messagingSenderId: "876984642539",
  appId: "1:876984642539:web:ea6d337c3f443532e8c7ae",
  measurementId: "G-3FRTWWKKCP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS = {
  USERS: "users",
  EVENTS: "events",
  POSTS: "posts",
  MAINTENANCE: "maintenance",
  PROPERTY_MAP: "propertyMap"
};

export async function loadAllData() {
  try {
    const [usersSnap, eventsSnap, postsSnap, maintSnap, mapSnap] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.USERS)),
      getDocs(collection(db, COLLECTIONS.EVENTS)),
      getDocs(collection(db, COLLECTIONS.POSTS)),
      getDocs(collection(db, COLLECTIONS.MAINTENANCE)),
      getDoc(doc(db, COLLECTIONS.PROPERTY_MAP, "data"))
    ]);

    return {
      users: usersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      events: eventsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      posts: postsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      maintenance: maintSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      propertyMap: mapSnap.exists() ? mapSnap.data() : null
    };
  } catch (e) {
    console.error("Error loading data:", e);
    return null;
  }
}

export async function saveUsers(users) {
  try {
    const batch = [];
    for (const user of users) {
      batch.push(setDoc(doc(db, COLLECTIONS.USERS, String(user.id)), user));
    }
    await Promise.all(batch);
    return true;
  } catch (e) {
    console.error("Error saving users:", e);
    return false;
  }
}

export async function saveEvents(events) {
  try {
    const batch = [];
    for (const evt of events) {
      batch.push(setDoc(doc(db, COLLECTIONS.EVENTS, String(evt.id)), evt));
    }
    await Promise.all(batch);
    return true;
  } catch (e) {
    console.error("Error saving events:", e);
    return false;
  }
}

export async function savePosts(posts) {
  try {
    const batch = [];
    for (const post of posts) {
      batch.push(setDoc(doc(db, COLLECTIONS.POSTS, String(post.id)), post));
    }
    await Promise.all(batch);
    return true;
  } catch (e) {
    console.error("Error saving posts:", e);
    return false;
  }
}

export async function saveMaintenance(maint) {
  try {
    const batch = [];
    for (const m of maint) {
      batch.push(setDoc(doc(db, COLLECTIONS.MAINTENANCE, String(m.id)), m));
    }
    await Promise.all(batch);
    return true;
  } catch (e) {
    console.error("Error saving maintenance:", e);
    return false;
  }
}

export async function savePropertyMap(mapData) {
  try {
    await setDoc(doc(db, COLLECTIONS.PROPERTY_MAP, "data"), mapData);
    return true;
  } catch (e) {
    console.error("Error saving property map:", e);
    return false;
  }
}

export { db };