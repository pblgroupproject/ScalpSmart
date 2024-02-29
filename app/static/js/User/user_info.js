console.log('User/user_info.js')

document.getElementById('sidebar').addEventListener('click',function(e){
    if(e.target.id == 'goToStage_normal'){
        window.location.href = '#stage_normal';
    }
    if(e.target.id == 'goToStage_1'){
        window.location.href = '#stage_1';
    }
    if(e.target.id == 'goToStage_2'){
        window.location.href = '#stage_2';
    }
    if(e.target.id == 'goToStage_3'){
        window.location.href = '#stage_3';
    }
    if(e.target.id == 'goToStage_bald'){
        window.location.href = '#stage_bald';
    }
    
})