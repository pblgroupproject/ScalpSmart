console.log("Authentication/authentication.js")

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


const signUpWindow = `
<div class="container">
    <div id="formInfo">
        <header>Scalp Smart</header>
        <section>
            <h3>Sign Up</h3>
            <div class="authDiv">
                <form id="signupForm">
                    <div class="mb-3">
                        <label for="signupName" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="signupName" name="name" autocomplete="off">
                    </div>
                    <div class="mb-3">
                        <label for="signupEmail" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="signupEmail" name="email" autocomplete="off">
                    </div>
                    <div class="mb-3">
                        <label for="signupPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="signupPassword" name="password" autocomplete="off">
                    </div>
                    <button type="submit" class="btn btn-primary">Sign Up</button>
                    <button id="proceedToLogin" class="btn btn-secondary">Click Here to Login</button>
                </form>
            </div>
        </section>
    </div>
    <div id="imageTab">
        <div class="image">
            <img src="https://img.freepik.com/premium-vector/female-doctor-reads-medical-analysis_258386-6.jpg">
        </div>
        <div class="loginText">
            <span>Are You A Doctor?</span>
            <button id="loginForDoctor" class="btn btn-success ms-4">Click Here</button>
        </div>
        
    </div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,96L26.7,117.3C53.3,139,107,181,160,181.3C213.3,181,267,139,320,128C373.3,117,427,139,480,128C533.3,117,587,75,640,58.7C693.3,43,747,53,800,48C853.3,43,907,21,960,26.7C1013.3,32,1067,64,1120,64C1173.3,64,1227,32,1280,48C1333.3,64,1387,128,1413,160L1440,192L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path></svg>
`

const loginWindow = `
<div class="container">
<div id="imageTab">
    <div class="image">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/student-progress-tracking-3862328-3213880.png'">
    </div>
    <div class="loginText">
        <span>Are You A Doctor?</span>
        <button id="loginForDoctor" class="btn btn-success ms-4">Click Here</button>
    </div>
    
</div>
<div id="formInfo">
    <header>Scalp Smart</header>
    <section>
        <h3>Login</h3>
        <div class="authDiv">
            <form id="loginForm">
                <div class="mb-3">
                    <label for="loginEmail" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="loginEmail" name="email" autocomplete="off">
                </div>
                <div class="mb-3">
                    <label for="loginPassword" class="form-label">Password</label>
                    <input type="password" class="form-control" id="loginPassword" name="password" autocomplete="off">
                </div>
                <button type="submit" class="btn btn-primary">Log In</button>
                <button id="proceedToSignUp" class="btn btn-secondary">Click Here to Sign Up</button>                
                <div class="loginText forMobile">
                    <span>Are You A Doctor?</span>
                    <button id="loginForDoctor" class="btn btn-success ms-4">Click Here</button>
                </div>
            </form>

        </div>
    </section>
</div>
</div>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,96L26.7,117.3C53.3,139,107,181,160,181.3C213.3,181,267,139,320,128C373.3,117,427,139,480,128C533.3,117,587,75,640,58.7C693.3,43,747,53,800,48C853.3,43,907,21,960,26.7C1013.3,32,1067,64,1120,64C1173.3,64,1227,32,1280,48C1333.3,64,1387,128,1413,160L1440,192L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path></svg>
`

const doctorWindow = `
<div class="container">
    <div id="formInfo">
        <header>Scalp Smart</header>
        <section>
            <h3>Apply For Doctor</h3>
            <div class="authDiv">
                <form id="doctorForm">
                    <div class="mb-3">
                        <label for="doctorName" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="doctorName" autocomplete="off" placeholder="Enter Full Name">
                    </div>
                    <div class="mb-3">
                        <label for="doctorQualification" class="form-label">Qualification</label>
                        <input type="text" class="form-control" id="doctorQualification" autocomplete="off" placeholder="Enter Degree Details">
                    </div>
                    <div class="mb-3">
                        <label for="doctorExperience" class="form-label">Experience</label>
                        <input type="text" class="form-control" id="doctorExperience" autocomplete="off" placeholder="Eg. 3-5 years">
                    </div>
                    <div class="mb-3">
                        <label for="doctorLocation" class="form-label">Location</label>
                        <input type="text" class="form-control" id="doctorLocation" autocomplete="off">
                    </div>
                    <button type="submit" class="btn btn-primary">Send Request</button>
                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Instructions
                    </button>
                </form>
            </div>
        </section>
    </div>
    <div id="imageTab">
        <div class="image">
            <img src="https://t4.ftcdn.net/jpg/03/30/33/29/360_F_330332917_MO0x1tcYedbGxUM4wgATwyOkU7xY5wEI.jpg">
        </div>
        <div class="loginText">
            <span>Are You A Patient?</span>
            <button id="proceedToSignUp" class="btn btn-success ms-4">Click Here</button>
        </div>
        
    </div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,96L26.7,117.3C53.3,139,107,181,160,181.3C213.3,181,267,139,320,128C373.3,117,427,139,480,128C533.3,117,587,75,640,58.7C693.3,43,747,53,800,48C853.3,43,907,21,960,26.7C1013.3,32,1067,64,1120,64C1173.3,64,1227,32,1280,48C1333.3,64,1387,128,1413,160L1440,192L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path></svg>

`

document.getElementById('root').innerHTML = signUpWindow;

document.getElementById('root').addEventListener('click', function(e){
    if(e.target && e.target.id == 'proceedToLogin') {
        e.preventDefault();
        document.getElementById('root').innerHTML = loginWindow; 
    }
});

// Add event listener for "proceedToSignUp" button
document.getElementById('root').addEventListener('click', function(e){
    if(e.target && e.target.id == 'proceedToSignUp') {
        e.preventDefault();
        document.getElementById('root').innerHTML = signUpWindow; 
    }
});

document.getElementById('root').addEventListener('click', function(e){
    if(e.target && e.target.id == 'loginForDoctor') {
        e.preventDefault();
        document.getElementById('root').innerHTML = doctorWindow; 
    }
});
// Prevent form submission for loginForm
document.getElementById('root').addEventListener('submit', function(e){
    if(e.target && e.target.id == 'loginForm') {
        e.preventDefault();
        const loginForm = e.target;
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        signInWithEmailAndPassword(auth,email,password)
            .then((cred) => {
                console.log("User Created : ", cred.user);
                console.log("User ID", cred.user.uid);

                // Query to get user_type from Firebase

                let sessionJSON = {
                    "user_id": cred.user.uid,
                    "user_type": "user"
                }

                loginForm.reset();

                return fetch('/update_session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sessionJSON)
                });
            })
            .then(response => {
                if(response.ok){
                    return response.json();
                }
                else{
                    console.log("Failed to update user session")
                    throw new Error('Failed to update user session');
                }
            })
            .then(data => {
                console.log("Response from server:");
                console.log(data);
                alert("Logged In Successfully!");
                location.reload();
            })
            .catch(err => {
                console.log(`Error Code : ${err.code}`);
                console.log(`Error Message : ${err.message}`);
                alert(`Error Message : ${err.message}`)
                loginForm.reset();
            })
    }
});

// Prevent form submission for signupForm
document.getElementById('root').addEventListener('submit', function(e){
    if(e.target && e.target.id == 'signupForm') {
        e.preventDefault();
        const signupForm = e.target;
        const name = signupForm.name.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        createUserWithEmailAndPassword(auth,email,password)
            .then((cred) => {
                console.log("User Created : ", cred.user);
                console.log("User ID", cred.user.uid);
                
                // Put a query here to set the name of the person

                let sessionJSON = {
                    "user_id": cred.user.uid,
                    "user_type": "user"
                }

                signupForm.reset();

                return fetch('/update_session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sessionJSON)
                });
            })
            .then(response => {
                if(response.ok){
                    return response.json();
                }
                else{
                    console.log("Failed to update user session")
                    throw new Error('Failed to update user session');
                }
            })
            .then(data => {
                console.log("Response from server:");
                console.log(data);
                alert("Sign Up Successful!");
                location.reload();
            })
            .catch(err => {
                console.log(`Error Code : ${err.code}`);
                console.log(`Error Message : ${err.message}`);
                alert(`Error Message : ${err.message}`)
                signupForm.reset();
            })
    }
});

document.getElementById('root').addEventListener('submit', function(e){
    if(e.target && e.target.id == 'doctorForm') {
        e.preventDefault();
    }
});

// document.getElementById('authForm').addEventListener('submit',function(event){
//     event.preventDefault();
//     let sessionJSON = {
//         "user_id": document.getElementById('user_id').value,
//         "user_type": document.getElementById('user_type').value
//     }

//     console.log(sessionJSON)

//     fetch('/update_session', {
//         method : 'POST',
//         headers : {
//             'Content-Type':'application/json'
//         },
//         body: JSON.stringify(sessionJSON)
//     })
//     .then(response => {
//         if(response.ok){
//             return response.json();
//         }
//         else{
//             console.log("Failed to update user session")
//             throw new Error('Failed to update user session');
//         }
//     })
//     .then(data => {
//         console.log("Response from server:");
//         console.log(data);
//         alert("Logged In Successfully!")
//         location.reload();
//     })
//     .catch(e=>{
//         console.error('Error', e)
//     })

// })