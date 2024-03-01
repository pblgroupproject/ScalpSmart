console.log("Authentication/logout.js")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged,

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"

document.addEventListener('DOMContentLoaded', function() {
    firebaseConfig();
});
    

const firebaseConfig = async function(){
    try{
        const database_key = '5ANbyQ87c4SgfALjn3eSYj6zjbgoTj5A'
        const response = await fetch(`/api/env/firebaseConfig?api_key=${database_key}`,{
            headers:{
                'Referer':`https://${window.location.hostname}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch Firebase configuration');
        }
        const firebaseConfig = await response.json();
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
                
        console.log('Firebase initialized successfully');
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


    }
    catch(error){
        console.error('Error initializing Firebase:', error)
    }
}