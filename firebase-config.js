// Cross-device sync config. Safe to commit — Firestore security rules (not this
// file) are what actually gate access. See README.md for the 5-minute setup.
//
// Until firebaseConfig.apiKey is filled in, the app runs localStorage-only —
// fully functional on one device, just no cross-device sync.
window.__LIFE_OS_SYNC__ = {
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },
  // Pre-generated opaque id for the Firestore doc path (synced/<syncId>).
  // Only change this if you want to start a fresh sync state.
  syncId: "fcd82d636022ff83cf6f3f0326513f0c"
};
