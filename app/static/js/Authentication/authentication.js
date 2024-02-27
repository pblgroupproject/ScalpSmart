console.log("Authentication/authentication.js")

document.getElementById('authForm').addEventListener('submit',function(event){
    event.preventDefault();
    let sessionJSON = {
        "user_id": document.getElementById('user_id').value,
        "user_type": document.getElementById('user_type').value
    }

    console.log(sessionJSON)

    fetch('/update_session', {
        method : 'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(sessionJSON)
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
        alert("Logged In Successfully!")
        location.reload();
    })
    .catch(e=>{
        console.error('Error', e)
    })

})