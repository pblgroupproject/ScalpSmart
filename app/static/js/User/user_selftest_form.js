console.log("Hello World")

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
    getAuth,
    onAuthStateChanged,

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"

import { 
    getFirestore, collection, 
    getDocs, 
    addDoc, 
    doc, deleteDoc, 
    onSnapshot,
    query, where,
    orderBy, limit,
    serverTimestamp, Timestamp,
    getDoc, updateDoc,

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

let app = null;
let auth = null;
let uid = null;
let db = null;

document.addEventListener('DOMContentLoaded', async function() {
    [app, db, auth, uid] = await initFirebase();
    await displayNextQuestion();
});

async function initFirebase(){
    try {
        if(!app){
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
            app = await initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
            uid = null;
            const uidPromise = new Promise((resolve, reject) => {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        uid = user.uid;
                        resolve(uid);
                    } else {
                        reject(new Error("Cannot detect user"));
                    }
                });
            });
            await uidPromise;
        }
        return [app, db, auth, uid];
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        
    }
}

let questionCounter = 1;

let form_data = {
    "dieting":"No",
    "flaking":"No",
    "heredity":"No",
    "iron deficiency":"No",
    "rash":"No",
    "stress":"No",
    "thyroid Deficiency":"No"
}


async function displayNextQuestion(){
    if(app&&auth&&db&&uid){
        
        if(questionCounter>7){
            questionCounter = 1;
            try{
                const updateForm = new Promise((resolve,reject)=>{
                    const userRef = doc(db,'Users',uid);
                    const updateJson = {
                        form_data: form_data
                    }
                    updateDoc(userRef,updateJson)
                    .then(()=>{
                        console.log("Updated Doctor assigned_patients successfully");
                        resolve(true)
                    })
                    .catch(err=>{
                        reject(new Error(err));
                    })
                
                })

                await updateForm;

                alert("Form Updated Successfully!");

                location.href = "/user/self-test";
            }
            catch(error){
                alert(error);
            }
        }

        const q1Card = document.getElementById('Q1');
        const q2Card = document.getElementById('Q2');
        const q3Card = document.getElementById('Q3');
        const q4Card = document.getElementById('Q4');
        const q5Card = document.getElementById('Q5');
        const q6Card = document.getElementById('Q6');
        const q7Card = document.getElementById('Q7');

        switch(questionCounter){
            case 1:
                q1Card.style.display = 'block';
                q2Card.style.display = 'none';
                q3Card.style.display = 'none';
                q4Card.style.display = 'none';
                q5Card.style.display = 'none';
                q6Card.style.display = 'none';
                q7Card.style.display = 'none';
                break;
            case 2:
                q1Card.style.display = 'none';
                q2Card.style.display = 'block';
                q3Card.style.display = 'none';
                q4Card.style.display = 'none';
                q5Card.style.display = 'none';
                q6Card.style.display = 'none';
                q7Card.style.display = 'none';
                break;
            case 3:
                q1Card.style.display = 'none';
                q2Card.style.display = 'none';
                q3Card.style.display = 'block';
                q4Card.style.display = 'none';
                q5Card.style.display = 'none';
                q6Card.style.display = 'none';
                q7Card.style.display = 'none';
                break;
            case 4:
                q1Card.style.display = 'none';
                q2Card.style.display = 'none';
                q3Card.style.display = 'none';
                q4Card.style.display = 'block';
                q5Card.style.display = 'none';
                q6Card.style.display = 'none';
                q7Card.style.display = 'none';
                break;
            case 5:
                q1Card.style.display = 'none';
                q2Card.style.display = 'none';
                q3Card.style.display = 'none';
                q4Card.style.display = 'none';
                q5Card.style.display = 'block';
                q6Card.style.display = 'none';
                q7Card.style.display = 'none';
                break;
            case 6:
                q1Card.style.display = 'none';
                q2Card.style.display = 'none';
                q3Card.style.display = 'none';
                q4Card.style.display = 'none';
                q5Card.style.display = 'none';
                q6Card.style.display = 'block';
                q7Card.style.display = 'none';
                break;
            case 7:
                q1Card.style.display = 'none';
                q2Card.style.display = 'none';
                q3Card.style.display = 'none';
                q4Card.style.display = 'none';
                q5Card.style.display = 'none';
                q6Card.style.display = 'none';
                q7Card.style.display = 'block';
                break;
            default:
                questionCounter = 1;
                await displayNextQuestion();
        }
    }
}

Array.from(document.getElementsByClassName('nextButton')).forEach(btn=>{
    btn.addEventListener('click', async (e) => {
        questionCounter = questionCounter + 1;
        console.log(form_data);
        document.querySelectorAll('.yesButton').forEach(btn => {
            btn.style.backgroundColor = "#FEFFFF";
            btn.classList.add("notSelected");
        });
        document.querySelectorAll('.noButton').forEach(btn => {
            btn.style.backgroundColor = "#FEFFFF";
            btn.classList.add("notSelected");
        });
        await displayNextQuestion();
    });
    
})

const buttons = document.querySelectorAll('.optionButton');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        console.log(form_data);
        buttons.forEach(otherButton => {
            if (otherButton !== button) {
                otherButton.classList.remove('selected');
                otherButton.classList.add('notSelected');
            }
        });

        button.classList.remove('notSelected');
        button.classList.add('selected');
    });
});

document.getElementById('Q1_yesButton').addEventListener('click',()=>{
    form_data["stress"] = "Yes";
})

document.getElementById('Q1_noButton').addEventListener('click',()=>{
    form_data["stress"] = "No";
})

document.getElementById('Q2_yesButton').addEventListener('click',()=>{
    form_data["iron deficiency"] = "Yes";
})

document.getElementById('Q2_noButton').addEventListener('click',()=>{
    form_data["iron deficiency"] = "No";
})

document.getElementById('Q3_yesButton').addEventListener('click',()=>{
    form_data["thyroid Deficiency"] = "Yes";
})

document.getElementById('Q3_noButton').addEventListener('click',()=>{
    form_data["thyroid Deficiency"] = "No";
})

document.getElementById('Q4_yesButton').addEventListener('click',()=>{
    form_data["dieting"] = "Yes";
})

document.getElementById('Q4_noButton').addEventListener('click',()=>{
    form_data["dieting"] = "No";
})

document.getElementById('Q5_yesButton').addEventListener('click',()=>{
    form_data["rash"] = "Yes";
})

document.getElementById('Q5_noButton').addEventListener('click',()=>{
    form_data["rash"] = "No";
})

document.getElementById('Q6_yesButton').addEventListener('click',()=>{
    form_data["flaking"] = "Yes";
})

document.getElementById('Q6_noButton').addEventListener('click',()=>{
    form_data["flaking"] = "No";
})

document.getElementById('Q7_yesButton').addEventListener('click',()=>{
    form_data["heredity"] = "Yes";
})

document.getElementById('Q7_noButton').addEventListener('click',()=>{
    form_data["heredity"] = "No";
})