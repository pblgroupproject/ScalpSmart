console.log('home.js')
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged,

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"


const firebaseConfig = {
apiKey: "AIzaSyARU2xp7aOI2yGqSLQY2Oe0HAfbeYKn-TE",
authDomain: "practice-33346.firebaseapp.com",
projectId: "practice-33346",
storageBucket: "practice-33346.appspot.com",
messagingSenderId: "537649547722",
appId: "1:537649547722:web:3895e6aed8918b04b22733"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    if(user){
        console.log("User Signed In :", user);
        console.log("User ID: ", user.uid);
    }
    else{
        console.log("No User Logged In: ", user)
    }
})
