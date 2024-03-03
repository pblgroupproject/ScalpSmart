import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged,

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"



console.log("User/user_selftest_upload.js")


document.getElementById('inputImage').addEventListener('change',function(event){
   const selectedFile = event.target.files[0];
   if (selectedFile && selectedFile.type.startsWith('image/')) {
        const containerItem = document.getElementById('container-item');
        console.log('Selected file:', selectedFile);
        const imageElement = document.createElement('img');
        imageElement.src = URL.createObjectURL(selectedFile);
        containerItem.innerHTML = ''; 
        containerItem.appendChild(imageElement);
        document.getElementById('submitContainer').style.display = 'block'
        window.scrollBy(0, window.innerHeight * 0.5);
   }
   else{
        alert('Please select an image file.');
        this.value = '';
   }

})




document.getElementById('imageForm').addEventListener('submit',function(event){
    event.preventDefault();
    console.log("Form Submitted")
    const imageInput = document.getElementById('inputImage');
    const file = imageInput.files[0];
    if (!file) {
        console.log("No file selected");
        alert('No image captured')
        location.reload();
        return;
    }

    document.getElementById('loadingScreen').style.display = 'block'

    let timer = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progressText');

    function updateProgressBar(){
        const progress = ((timer/100)*100);
        progressBar.style.width = `${progress}%`

        if (progress > 25){
            progressBar.style.backgroundColor = 'orange';
        }

        if (progress > 70){
            progressBar.style.backgroundColor = 'red';
        }
    }

    const timerInterval = setInterval(() => {
        // console.log(timer)
        timer++;
        updateProgressBar();

        if (timer >= 100) {
            timer = 100;
            clearInterval(timerInterval);
        }
    }, 1000);


    const formData = new FormData();
    formData.append('image', file);

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
        progressText.innerText = 'Connecting to database server..'
        if(timer < 10 ) {timer = 10};
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User Signed In :", user);
                    console.log("User ID: ", user.uid);
                    progressText.innerText = 'Connected..';
                    resolve(user.uid);
                } else {
                    console.log("No User Logged In: ", user);
                    reject(new Error('Firebase: No User Logged In'));
                }
            });
        });
    })
    .then(user_id => {
        progressText.innerText = 'Uploading Image to Server..';
        if(timer < 25 ) {timer = 25};
        const upload_url = '/api/model/upload' + '?api_key=' + encodeURIComponent(api_key)+ '&user_id=' + encodeURIComponent(user_id);
        return fetch(upload_url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            progressText.innerText = 'Analyzing Image..'
            if(timer < 40 ) {timer = 40};
            const predict_url = '/api/model/predict' + '?api_key=' + encodeURIComponent(api_key) + '&user_id=' + encodeURIComponent(user_id);
            return fetch(predict_url);
        })
        .then(response => response.json())
        .then(res => {
            console.log(res);
            if(res['error']){
                throw new Error('User Not Detected');
            }
            progressText.innerText = 'Analysis Completed! Showing Results..'
            if(timer < 100 ) {timer = 100};
            clearInterval(timerInterval);
            updateProgressBar();
            setTimeout(() => {
                window.location.href = '/user/self-test/result'
            }, 1500);
        })
        .catch(error => {
            throw new Error(error);
        });

    })
    .catch(err => {
        console.log('Error', err);
        clearInterval(timerInterval);
        alert(`${err}`);
        location.reload();
    })

})

document.getElementById('analyzeBtn').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('imageForm').dispatchEvent(new Event('submit'));
})