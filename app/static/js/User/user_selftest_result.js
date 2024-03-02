import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged,

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"



document.addEventListener("DOMContentLoaded", function() {

    document.getElementById('loading-wrapper').style.display = 'block';
    
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
    .then(user_id => {
        const databaseURL = '/api/images/' + encodeURIComponent(user_id) + '/recent?api_key=' + encodeURIComponent(api_key)
        return fetch(databaseURL)
    })
    .then(response => response.json())
    .then(data =>{
        if(data['images'].length == 0){
            throw new Error('Empty data.images');
        }
        const base64Image = data['images'][0]['image_data'];
        const dateandtime = data['images'][0]['upload_time'];
        const stage = data['images'][0]['stage'];

        const decodedBytes = atob(base64Image);
        const arrayBuffer = new ArrayBuffer(decodedBytes.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < decodedBytes.length; i++) {
            uint8Array[i] = decodedBytes.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        document.getElementById('loading-wrapper').style.display = 'none';
        const resultImage = document.getElementById('resultImage')
        resultImage.src = imageUrl;
        document.getElementById('stage').innerText = stage;
        console.log(dateandtime);


    })
    .catch(err => {
        console.log('Error', err);
        alert(`Error: {err}`);
        window.location.href = '/user/self-test';
    })


});

