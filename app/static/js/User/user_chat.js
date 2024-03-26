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
    getDoc, updateDoc

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


let app = null;
let auth = null;
let uid = null;
let db = null;


let chatMode = "ClientCommunication"; // ClientCommunication || ChatbotCommunication
let doctorID = null;
var senderEmail = null;
async function sendMessageToFirebase(message){
    if(doctorID!==null&&uid!==null){
        const usersRef = collection(db,'Users')
        const q = query(usersRef, where("uid","==",uid))
        
        const senderEmailPromise = new Promise((resolve,reject)=>{
            getDocs(q)
            .then(snapshot=>{
                snapshot.docs.forEach(doc=>{
                    senderEmail = doc.data().email;
                    console.log(senderEmail);
                    resolve(senderEmail)
                })
            })    
            .catch(err=>{
                reject(new Error(err));
            })
        })
        if(senderEmail===null){
            await senderEmailPromise;
        }
        let chatroom = [uid,doctorID].sort().join('_');
        console.log(chatroom)
        const chatroomRef = collection(db,`chat_rooms/${chatroom}/messages`)
        addDoc(chatroomRef,{
            message:message,
            receiverId:doctorID,
            senderEmail:senderEmail,
            senderId:uid,
            timestamp:serverTimestamp()

        })
    }
    else{
        alert("There was an error sending your message. Please try again or contact the website owners");
    }
}

async function sendMessageToChatbot(message){
    console.log(message);
    let data = {
        prompt: message
    }
    console.log(data);
    const api_key = '5ANbyQ87c4SgfALjn3eSYj6zjbgoTj5A'
    fetch(`/api/chatbot/prompt?api_key=${api_key}`,{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response=>response.json())
    .then(async data=>{
        console.log(data);
        let newData = {
            prompt: message,
            response: data.response,
            timestamp: Timestamp.now()
        }
        
        const userRef = doc(db,'Users',uid);
        let chat_bot_history = [];
        const chatBotHistoryPromise = new Promise((resolve,reject)=>{
            getDoc(userRef)
                .then(snap=>{
                    if(snap.data().hasOwnProperty('chat_bot_history')){
                        chat_bot_history = snap.data()['chat_bot_history'];
                    }
                    console.log(snap.data()['chat_bot_history']);
                    resolve(chat_bot_history)
                })
                .catch(err=>{
                    reject(new Error(err));
                })
        })

        await chatBotHistoryPromise;
        console.log(newData);
        console.log(chat_bot_history);
        chat_bot_history.push(newData);
        let update = {
            chat_bot_history : chat_bot_history
        }
        updateDoc(userRef,update)
        .then(()=>{
            console.log("Database updated successfully")
        })
        .catch((err)=>{
            console.log(err);
        })

    })
    .catch(err=>{
        console.log(err);
    })
}

document.getElementById('messageForm').addEventListener('submit',function(e){
    e.preventDefault();
    const message = document.getElementById('userMessage').value;

    if(chatMode==="ClientCommunication"){
        sendMessageToFirebase(message);
    }
    else if(chatMode==="ChatbotCommunication"){
        sendMessageToChatbot(message);
    }

    
    document.getElementById('userMessage').value = "";

})

document.addEventListener('DOMContentLoaded', async function() {
    [app, db, auth, uid] = await initFirebase();
    loadDoctors();
    
});

async function loadDoctors(){
    const usersRef = collection(db,'Users')
    const q = query(usersRef, where("role","==","Doctor"))
    getDocs(q)
        .then(snapshot=>{
            const contactList = document.getElementById('contactList');
            snapshot.docs.forEach(doc=>{
                let uid = doc.data().uid;
                let img = doc.data().image;
                let name = doc.data().name;
                let experience = doc.data().experience
                let location = doc.data().location
                console.log(doc.data())

                let card = createContactCard(uid, img, name, experience, location);
                contactList.appendChild(card)
            })
        })

}

async function loadChatbotHistory(){
    console.log("Loading Chatbot History", chatMode);
    document.getElementById('chat-profile-pic').src = "https://static.vecteezy.com/system/resources/thumbnails/007/225/199/small/robot-chat-bot-concept-illustration-vector.jpg";
    document.getElementById('chat-name').innerText = "Scalp Smart Chatbot";
    const userRef = doc(db,'Users',uid);
    const message_history = document.getElementById('message-history')
    onSnapshot(userRef, (snapshot)=>{
        message_history.innerHTML = "";
        if(snapshot.data().hasOwnProperty('chat_bot_history')){
            for(let i=0; i<snapshot.data()['chat_bot_history'].length; i++){
                message_history.appendChild(createSenderMessage(snapshot.data()['chat_bot_history'][i].prompt));
                message_history.appendChild(createReceiverMessage(snapshot.data()['chat_bot_history'][i].response));
            }
        }
        document.getElementById('message-history').scrollTop = document.getElementById('message-history').scrollHeight;
    })
     

    
}

async function addUIDtoDoctor(uid,doctor_id){
    console.log(doctor_id);
    const doctorRef = doc(db,'Users',doctor_id)
    let assigned_patients = []
    const getDocPromise = new Promise((resolve,reject)=>{
        getDoc(doctorRef)
        .then(doc=>{
            console.log(doc);
            console.log(doc.data());
            assigned_patients = doc.data()['assigned_patients']
            resolve(assigned_patients);
        })
        .catch(err=>{
            reject(new Error(err));
        })
    })
    await getDocPromise;
    assigned_patients.push(uid);
    let update = {
        assigned_patients:assigned_patients
    }
    const updateDocPromise = new Promise((resolve,reject)=>{
        updateDoc(doctorRef,update)
        .then(()=>{
            console.log("Updated Doctor assigned_patients successfully");
            resolve(true)
        })
        .catch(err=>{
            reject(new Error(err));
        })
    })

    await updateDocPromise;
}

async function loadChatHistory(doctor_id){
    console.log("Loading Chat History", chatMode);
    console.log(doctor_id);
    console.log(uid);

    const usersRef = collection(db,'Users')
    const q1 = query(usersRef, where("uid","==",doctor_id))
    getDocs(q1)
        .then(snapshot=>{
            snapshot.docs.forEach(doc=>{
                let img = doc.data().image;
                let name = doc.data().name;
                document.getElementById('chat-profile-pic').src = img;
                document.getElementById('chat-name').innerText = name;
            })
        })

    let chatroom = [uid,doctor_id].sort().join('_');
    console.log(chatroom)
    const message_history = document.getElementById('message-history')
    const chatroomRef = collection(db,`chat_rooms/${chatroom}/messages`)
    const q = query(chatroomRef, orderBy("timestamp","asc"));

    onSnapshot(q, async (snapshot)=>{
        message_history.innerHTML = "";
        if(snapshot.exists&&snapshot.docs.length==1){
            await addUIDtoDoctor(uid,doctor_id);
        }
        snapshot.docs.forEach(doc => {
            console.log(doc.data().message)
            if(doc.data().senderId==uid){
                message_history.appendChild(createSenderMessage(doc.data().message))
            }else{
                message_history.appendChild(createReceiverMessage(doc.data().message))
            }
        })
        document.getElementById('message-history').scrollTop = document.getElementById('message-history').scrollHeight;
    })
}

document.getElementById('contactList').addEventListener('click',function(e){
    document.getElementById('messageBox').style.display = 'grid';
    document.getElementById('contactList').style.border = 'none';
    let targetId = e.target.closest('[id]').id;
    console.log(targetId);
    if(targetId=='chatbot'){
        chatMode = "ChatbotCommunication";
        loadChatbotHistory()
    } 
    else{
        chatMode = "ClientCommunication";
        doctorID = targetId;
        loadChatHistory(targetId);
    }
})

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


async function getCurrentUserUID() {
    return new Promise((resolve, reject) => {
        const user = firebase.auth().currentUser;
        if (user) {
            resolve(user.uid);
        } else {
            reject(new Error('No user signed in'));
        }
    });
}

function createReceiverMessage(message){
    let div = document.createElement('div');
    div.classList.add('message','receiver');
    let messageBlob = document.createElement('div');
    messageBlob.classList.add('message-blob');
    messageBlob.innerText = message;
    div.appendChild(messageBlob);
    return div;
}

function createSenderMessage(message){
    let div = document.createElement('div');
    div.classList.add('message','sender');
    let messageBlob = document.createElement('div');
    messageBlob.classList.add('message-blob');
    messageBlob.innerText = message;
    div.appendChild(messageBlob);
    return div;
}

function createContactCard(contactId, imageSrc, name, experience, location){
    let div = document.createElement('div');
    div.id = contactId;
    div.classList.add('w-100');
    div.style.minHeight = '70px';
    div.style.display = 'grid';
    div.style.gridTemplateRows = '1fr';
    div.style.boxShadow = '1px 1px 2px rgba(0,0,0,0.5)';
    div.style.cursor = 'pointer';
    div.style.overflow = 'hidden';

    let innerDiv = document.createElement('div');
    innerDiv.style.display = 'grid';
    innerDiv.style.gridTemplateColumns = '2fr 5fr';
    innerDiv.style.overflow = 'hidden';

    let imageDiv = document.createElement('div');
    imageDiv.style.aspectRatio = '1';
    imageDiv.style.position = 'relative';
    imageDiv.style.overflow = 'hidden';

    let iconDiv = document.createElement('div');
    iconDiv.classList.add('iconDiv', 'border', 'border-black', 'w-75', 'h-75', 'rounded-circle');
    iconDiv.style.position = 'absolute';
    iconDiv.style.top = '50%';
    iconDiv.style.left = '50%';
    iconDiv.style.transform = 'translate(-50%,-50%)';
    
    let img = document.createElement('img');
    img.src = imageSrc;
    iconDiv.appendChild(img);
    imageDiv.appendChild(iconDiv);


    let detailsDiv = document.createElement('div');
    detailsDiv.style.position = 'relative';
    detailsDiv.style.overflow = 'hidden';

    let titleDiv = document.createElement('div');
    titleDiv.classList.add('contact-title');
    titleDiv.style.fontSize = '1.2rem';
    titleDiv.style.textAlign = 'start';
    titleDiv.style.overflow = 'hidden';
    titleDiv.textContent = name;

    let infoDiv = document.createElement('div');
    infoDiv.style.fontWeight = '300';
    infoDiv.style.fontSize = '0.7em';
    infoDiv.style.overflow = 'auto';
    infoDiv.innerHTML = `<p style="display: block; overflow: auto;">Experience: ${experience}<br>Location: ${location}</p>`;
  
    titleDiv.appendChild(infoDiv);
    detailsDiv.appendChild(titleDiv);    
    innerDiv.appendChild(imageDiv);
    innerDiv.appendChild(detailsDiv);
    div.appendChild(innerDiv);    
    return div;

}