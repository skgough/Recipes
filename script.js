let slider = document.querySelector('.slider');
var steps;

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

function toggleSteps() {
    document.body.classList.toggle('overlaid');
    document.querySelector('.overlay').classList.toggle('underneath');
}

function toggleIngredients() {
    let ingredients = document.querySelector('.overlay .ingredients');
    ingredients.classList.toggle('reveal');
}