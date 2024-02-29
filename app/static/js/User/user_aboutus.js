console.log('User/aboutus.js');

function hideMobileAbove600() {
    var mobileElements = document.querySelectorAll('.mobile');

    var viewportWidth = window.innerWidth;

    // If viewport width is above 600px, hide the elements
    if (viewportWidth > 600) {
        mobileElements.forEach(function(element) {
            element.style.display = 'none';
        });
    }
}
hideMobileAbove600();
window.addEventListener('resize', hideMobileAbove600);
