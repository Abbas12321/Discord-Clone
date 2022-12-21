import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCKyrTY6lxp-7fVgsCHFmrDsOBqFdSKrBY",
    authDomain: "discord-clone-live-c3d05.firebaseapp.com",
    projectId: "discord-clone-live-c3d05",
    storageBucket: "discord-clone-live-c3d05.appspot.com",
    messagingSenderId: "195015577265",
    appId: "1:195015577265:web:533e8484a8249fac5adc90"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db