console.log('User/user_home.js')

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


document.getElementById('messageDiv').addEventListener('click', function(){
    window.location.href = '/user/chat'
})

document.getElementById('proceedToSelfTextBtn').addEventListener('click',function(){
    window.location.href = '/user/self-test'
})

document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.serviceContainer .card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            cards.forEach(siblingCard => {
                if (siblingCard !== card) {
                    siblingCard.style.filter = 'blur(2px)';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            cards.forEach(siblingCard => {
                if (siblingCard !== card) {
                    siblingCard.style.filter = '';
                }
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const teamCards = document.querySelectorAll('.teamCard');

    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            const id = card.id;

            let destination = '';
            switch (id) {
                case 'tirthraj':
                    destination = 'user/about/tirthraj';
                    break;
                case 'advait':
                    destination = 'user/about/advait';
                    break;
                case 'amey':
                    destination = 'user/about/amey';
                    break;
                case 'rinit':
                    destination = 'user/about/rinit';
                    break;
                case 'suvrat':
                    destination = 'user/about/rinit';
                    break;
                default:
                    break;
            }
            if (destination) {
                window.location.href = destination;
            }
        });
    });
});

