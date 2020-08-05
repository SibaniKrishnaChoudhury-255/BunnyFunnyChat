import firebase from "firebase";

class Firebase {
  constructor() {
    this.init();
    // this.observeAuth();
  }


init=()=>{
  firebase.initializeApp({
  apiKey: "AIzaSyDqbpOqwBbf5Z1ZG88iFIee4oXnHZgzKLU",
  authDomain: "bunnyfunnychat.firebaseapp.com",
  databaseURL: "https://bunnyfunnychat.firebaseio.com",
  projectId: "bunnyfunnychat",
  storageBucket: "bunnyfunnychat.appspot.com",
  messagingSenderId: "363934410906",
  appId: "1:363934410906:web:29fce6384848c0e61cd723",
  measurementId: "G-3HBYK5H2XY"
  })
}

// observeAuth=()=>{
//   firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
// }
//
// onAuthStateChanged=(user)=>{
//   if (!user) {
//     try {
//       firebase.auth().signInAnonymously();
//     } catch ({e}) {
//
//     }
//   }
// }
//
// get uid(){
//   return (firebase.auth().currentUser || {}).uid;
// }


}

Firebase.shared= new Firebase()
export default Firebase;
