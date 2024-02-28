console.log("Authentication/logout.js")
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

document.getElementById('root').addEventListener('submit', function(e){
    if(e.target && e.target.id == 'logoutForm') {
        e.preventDefault();
        signOut(auth)
        .then(() => {
            console.log("Signed Out From Firebase");
            return fetch('/delete_session')
        })
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else{
                console.log("Failed to delete user session")
                throw new Error('Failed to delete user session');
            }
        })
        .then(data => {
            console.log("Response from server:");
            console.log(data);
            alert("Logged Out Successfully!");
            location.reload();
        })
        .catch((err) => {
            console.log(`Error Code: ${err.code}`);
            console.log(`Error Message: ${err.message}`);
            alert(`Error: ${err.message}`)
            location.reload();
        })
    }
});
