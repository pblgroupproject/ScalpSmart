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
        let formattedDate = formatDate(dateandtime);

        document.getElementById('resultDescription').innerText = 'Your hairloss stage is : ' + stage
        document.getElementById('showDate').innerText = 'Date and Time: '+ formattedDate;

        let resultInfo = ''
        if (stage == 'normal'){
            resultInfo = normalStageText;
        }
        else if (stage == 'stage 1'){
            resultInfo = stageOneText;
        }
        else if (stage == 'stage 2'){
            resultInfo = stageTwoText; 
        }
        else if (stage == 'stage 3'){
            resultInfo = stageThreeText;
        }
        else{
            resultInfo = stageBaldText;
        }

        document.getElementById('resultInfo').innerHTML = resultInfo;

    })
    .catch(err => {
        console.log('Error', err);
        alert(`Error: ${err}`);
        window.location.href = '/user/self-test';
    })


});


document.getElementById('retestBtn').addEventListener('click',function(){
    window.location.href = '/user/self-test';
})
document.getElementById('historyBtn').addEventListener('click',function(){
    window.location.href = '/user/self-test/history';
})
document.getElementById('productsBtn').addEventListener('click',function(){
    window.location.href = '/user/marketplace';
})
document.getElementById('consultBtn').addEventListener('click',function(){
    window.location.href = '/user/chat';
})

function formatDate(inputDate) {
    // Parse the input date string
    const date = new Date(inputDate);

    // Define arrays for ordinal suffixes and months
    const ordinalSuffix = ['th', 'st', 'nd', 'rd'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Get the day, month, year, hours, and minutes
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine the ordinal suffix for the day
    const daySuffix = (day >= 11 && day <= 13) ? 'th' : ordinalSuffix[day % 10];

    // Convert hours to 12-hour format and determine AM/PM
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;

    // Construct the formatted date string
    const formattedDate = `${day}${daySuffix} ${months[month]} ${year}, ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    return formattedDate;
}

const normalStageText = `
<h2>Normal Stage</h2>
<strong>Description : </strong>
<div id="text">In the normal stage, individuals have a full head of hair without any signs of balding or hair loss</div>
<strong>Recommendations:</strong>
<div id="text">
    <ul>
        <li>Maintain good hair care practices such as regular washing with a mild shampoo and conditioning.</li>
        <li>Avoid excessive use of heat styling tools and harsh chemical treatments.</li>
        <li>Eat a balanced diet rich in vitamins and minerals that support hair health, such as biotin, zinc, and vitamins A, C, and E.</li>
        <li>Consider using a wide-tooth comb to minimize hair breakage.</li>
        <li>Protect the scalp from sun damage by wearing a hat or applying sunscreen when exposed to direct sunlight for prolonged periods.</li>
    </ul>
</div>

`

const stageOneText = `
<h2>Stage 1</h2>
<strong>Description : </strong>
<div id="text">
Stage 1 typically involves minimal hair loss, often characterized by a slight recession of the hairline or thinning at the temples
</div>
<strong>Recommendations:</strong>
<div id="text">
    <ul>
        <li>
            Consult with a dermatologist or trichologist for an accurate diagnosis and personalized treatment plan
        </li>
        <li>
            Incorporate hair-strengthening and growth-promoting ingredients into your hair care routine, such as minoxidil or finasteride (under medical supervision).
        </li>
        <li>
            Explore non-invasive treatments like low-level laser therapy (LLLT) or platelet-rich plasma (PRP) therapy to stimulate hair follicle activity.
        </li>
        <li>
            Practice stress management techniques as stress can contribute to hair loss.
        </li>
        <li>
            Consider styling techniques to camouflage thinning areas, such as strategic haircuts or using volumizing products.
        </li>
    </ul>
</div>
`

const stageTwoText = `
<h2>Stage 2</h2>
<strong>Description : </strong>
<div id="text">
Stage 2 involves further progression of hair loss, with noticeable thinning or receding at the temples and possibly the crown area.
</div>
<strong>Recommendations:</strong>
<div id="text">
    <ul>
        <li>
            Discuss advanced treatment options with a specialist, including oral medications, topical solutions, or hair transplantation.
        </li>
        <li>
            Explore lifestyle changes that promote overall health, such as regular exercise and a balanced diet.
        </li>
        <li>
            Explore non-invasive treatments like low-level laser therapy (LLLT) or platelet-rich plasma (PRP) therapy to stimulate hair follicle activity.
        </li>
        <li>
            Use styling techniques to create the illusion of thicker hair, such as using hair fibers or hair-thickening sprays.
        </li>
        <li>
            Consider wearing hats or headscarves if self-conscious about hair loss.
        </li>
    </ul>
</div>
`

const stageThreeText = `
<h2>Stage 3</h2>
<strong>Description : </strong>
<div id="text">
Stage 3 is characterized by significant hair loss, with more extensive thinning or balding areas on the scalp.
</div>
<strong>Recommendations:</strong>
<div id="text">
    <ul>
        <li>
            Seek professional advice from a dermatologist or hair restoration expert to discuss treatment options tailored to your specific needs.
        </li>
        <li>
            Evaluate the potential benefits and risks of surgical interventions, such as hair transplantation or scalp reduction surgery.
        </li>
        <li>
            Experiment with hairstyles that embrace your natural hair texture or consider shaving your head for a bold, confident look.
        </li>
        <li>
            Prioritize self-care and emotional well-being by seeking support from friends, family, or support groups for individuals experiencing hair loss
        </li>
        <li>
            Explore alternative hair restoration options, such as wigs or hairpieces, to restore confidence and self-esteem.
        </li>
    </ul>
</div>
`

const stageBaldText = `
<h2>Stage Bald</h2>
<strong>Description : </strong>
<div id="text">
In the bald stage, individuals have significant or complete hair loss across large areas of the scalp.
</div>
<strong>Recommendations:</strong>
<div id="text">
    <ul>
        <li>
            Embrace baldness as a natural part of your appearance and identity.
        </li>
        <li>
            Consider maintaining a clean-shaven look for a polished and confident appearance.            
        </li>
        <li>
            Explore cosmetic options like scalp micropigmentation (SMP) to create the appearance of a closely shaved scalp or to add the illusion of density to thinning areas.
        </li>
        <li>
            Remember that baldness does not define your worth or attractiveness, and confidence and self-assurance are key to embracing your baldness with pride.
        </li>
    </ul>
</div>
`