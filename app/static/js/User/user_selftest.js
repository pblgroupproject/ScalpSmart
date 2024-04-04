document.getElementById('uploadCard').addEventListener('mouseover',function(){
    document.getElementById('uploadImageSVG').setAttribute('fill','#FFFFFF')
})

document.getElementById('uploadCard').addEventListener('mouseleave',function(){
    document.getElementById('uploadImageSVG').setAttribute('fill','#9747FF')
})

document.getElementById('webcamCard').addEventListener('mouseover',function(){
    document.getElementById('webcamRing').setAttribute('fill','#FFFFFF')
    document.getElementById('webcamLens').setAttribute('fill','#ADD8E6')

})

document.getElementById('webcamCard').addEventListener('mouseleave',function(){
    document.getElementById('webcamRing').setAttribute('fill','#90CAF9')
    document.getElementById('webcamLens').setAttribute('fill','#42A5F5')

})

document.getElementById('webcamCard').addEventListener('click',function(){
    window.location.href = '/user/self-test/capture';
})

document.getElementById('uploadCard').addEventListener('click',function(){
    window.location.href = '/user/self-test/upload';
})