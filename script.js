let slider = document.querySelector('.slider');
var steps;

function stepMode() {
    document.body.classList.add('overlaid');
    document.querySelector('.overlay').classList.remove('underneath');
    let ingredients = document.querySelector('.overlay .ingredients');
    let button = ingredients.querySelector('button');
    let indicator = document.querySelector('.indicator');
    let yOffset = ingredients.offsetHeight - button.offsetHeight;
    ingredients.style = `transform: translateY(-${yOffset}px)`;
    let tableView = document.querySelector('.table-view');
    let tableMaxHeight = window.innerHeight - indicator.offsetHeight;
    tableView.style = `max-height: ${tableMaxHeight}px`;
    steps = new Swipe(slider, {
        startSlide: 0,
        draggable: true,
        autoRestart: false,
        continuous: false,
        disableScroll: true,
        stopPropagation: true,
        callback: function (index) {
            document.querySelector('.indicator button.active').classList.remove('active');
            document.querySelectorAll('.indicator button')[index].classList.add('active');
        }
    });
}

function reveal() {
    let ingredients = document.querySelector('.overlay .ingredients');
    ingredients.classList.toggle('reveal');
}

window.addEventListener('resize', function () {
    let ingredients = document.querySelector('.overlay .ingredients');
    let button = ingredients.querySelector('button');
    let yOffset = ingredients.offsetHeight - button.offsetHeight;
    let indicator = document.querySelector('.indicator');
    let tableView = document.querySelector('.table-view');
    let tableMaxHeight = window.offsetHeight - button.offsetHeight - indicator.offsetHeight;
    ingredients.style = `transform: translateY(-${yOffset}px)`;
    tableView.style = `max-height: ${tableMaxHeight}px`;
});