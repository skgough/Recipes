let overlay = document.createElement('div');
    overlay.classList.add('overlay','underneath');

let ingredients = document.createElement('div');
    ingredients.classList.add('ingredients');
let tableSrc = document.querySelector('table.ingredients');
let table = tableSrc.cloneNode(true);
    ingredients.appendChild(table);
let dropDown = document.createElement('button');
    dropDown.classList.add('drop-down');
    dropDown.addEventListener('click', function() {
        this.parentElement.classList.toggle('reveal');
    })
dropDown.innerHTML = `<span>Ingredients</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                        </svg>`;
ingredients.appendChild(dropDown);

let slider = document.createElement('div');
    slider.classList.add('slider');
let slidesSrc = document.querySelector('ol');
let slides = slidesSrc.cloneNode(true);
slider.appendChild(slides);

let indicator = document.createElement('div');
    indicator.classList.add('indicator');
let numSteps = slides.querySelectorAll('li').length;
for (i=0;i<numSteps;i++) {
    let button = document.createElement('button');
        button.setAttribute('onclick',`steps.slide(${i})`);
        button.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="50"/>
                            </svg>`;
    indicator.appendChild(button);
}
indicator.querySelectorAll('button')[0].classList.add('active');

overlay.appendChild(slider);
overlay.appendChild(indicator);
overlay.appendChild(ingredients);

document.body.appendChild(overlay);

steps = new Swipe(slider, {
    startSlide: 0,
    draggable: true,
    autoRestart: false,
    continuous: false,
    disableScroll: true,
    stopPropagation: true,
    callback: function(index) {
        document.querySelector('.indicator button.active').classList.remove('active');
        document.querySelectorAll('.indicator button')[index].classList.add('active');
    }
});

function stepMode() {
    document.body.classList.add('overlaid');
    document.querySelector('.overlay').classList.remove('underneath');
}