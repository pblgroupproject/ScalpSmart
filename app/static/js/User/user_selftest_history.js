import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged,

} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"



console.log("User/user_selftest_history.js")


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('loading-wrapper').style.display = 'block'
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
      
        const databaseURL = '/api/images/' + encodeURIComponent(user_id) + '/all?api_key=' + encodeURIComponent(api_key);
        return fetch(databaseURL)
    })
    .then(response => response.json())
    .then(data => {
        let i = 0;
        let xValues = [];
        let yValues = [];
        const yLabels = ["Normal", "Stage 1", "Stage 2", "Stage 3", "Bald"];

        for(i=0; i<data['images'].length; i++){
            xValues.unshift(i);
            if(data['images'][i]['stage'] == 'normal'){
                yValues.unshift(0);
            }
            else if(data['images'][i]['stage'] == 'stage 1'){
                yValues.unshift(1);
            }
            else if(data['images'][i]['stage'] == 'stage 2'){
                yValues.unshift(2);
            }
            else if(data['images'][i]['stage'] == 'stage 3'){
                yValues.unshift(3);
            }
            else{
                yValues.unshift(4);
            }
            let dateandtime = data['images'][i]['upload_time'];
            console.log(dateandtime);
            let formattedDate = formatDate(dateandtime);
            let stage = data['images'][i]['stage']
            const base64Image = data['images'][i]['image_data'];
            const decodedBytes = atob(base64Image);
            const arrayBuffer = new ArrayBuffer(decodedBytes.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < decodedBytes.length; i++) {
                uint8Array[i] = decodedBytes.charCodeAt(i);
            }
            const blob = new Blob([uint8Array], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            
            
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('imageDiv');
            const img = document.createElement('img');
            img.src = imageUrl;
            imageDiv.appendChild(img);

            const textDiv = document.createElement('div');
            textDiv.classList.add('textDiv');
            const h4DateTime = document.createElement('h4');
            h4DateTime.textContent = 'Date & Time';
            const pDateTime = document.createElement('p');
            pDateTime.textContent = formattedDate;
            const h4Stage = document.createElement('h4');
            h4Stage.textContent = 'Stage';
            const pStage = document.createElement('p');
            pStage.textContent = stage;
            textDiv.appendChild(h4DateTime);
            textDiv.appendChild(pDateTime);
            textDiv.appendChild(h4Stage);
            textDiv.appendChild(pStage);

            const card = document.createElement('div');
            card.classList.add('card');
            card.appendChild(imageDiv);
            card.appendChild(textDiv);  

            document.getElementById('cardContainer').appendChild(card);

            new Chart("myChart", {
                type: "line",
                data: {
                    labels: xValues,
                    datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.1)",
                    data: yValues
                    }]
                },
                options: {
                    legend: {display: false},
                    scales: {
                    yAxes: [{
                        ticks: {
                        min: 0,
                        max: 4,
                        stepSize: 1,
                        callback: function(value, index, values) {
                            return yLabels[value];
                        }
                        }
                    }]
                    }
                }
            });
            


        }
        document.getElementById('loading-wrapper').style.display = 'none';  


    })
    .catch(err => {
        console.error(err);;
        alert(`Error: ${err}`)
        window.location.href = '/user/self-test';
    })



});


function formatDate(inputDate) {
    // Parse the input date string

    const datePart = inputDate.split('+')[0].trim();
    console.log(datePart)
    const date = new Date(datePart);
    console.log(date)

    // Define arrays for ordinal suffixes and months
    const ordinalSuffix = ['th', 'st', 'nd', 'rd'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Get the day, month, year, hours, and minutes
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert hours to 12-hour format and determine AM/PM
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;

    // Construct the formatted date string
    const formattedDate = `${day} ${months[month]} ${year}, ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    return formattedDate;
}
