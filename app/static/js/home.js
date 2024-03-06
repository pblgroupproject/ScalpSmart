console.log('home.js')
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged,

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"


const api_key = '5ANbyQ87c4SgfALjn3eSYj6zjbgoTj5A';
fetch(`/api/env/firebaseConfig?api_key=${api_key}`,{
    headers:{
        'Referer':`https://${window.location.hostname}`
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to fetch Firebase configuration');
    }
    return response.json();
})
.then(firebaseConfig => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User Signed In :", user);
                console.log("User ID: ", user.uid);
                resolve(user.uid);
            } else {
                console.log("No User Logged In: ", user);
                reject(new Error('Firebase: No User Logged In'));
            }
        });
    });
})
.catch(err=>{
    console.log('Error',err);
})