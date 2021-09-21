if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' }).then(function(reg) {
  
      if(reg.installing) {
        console.log('Service worker installing');
      } else if(reg.waiting) {
        console.log('Service worker installed');
      } else if(reg.active) {
        console.log('Service worker active');
      }
  
    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }

function showSteps() {
    const ingredientSrc = document.querySelector('.ingredients')
    const stepSrc = document.querySelectorAll('.preparation li')

    const overlay = document.createElement('div')
    overlay.classList.add('overlay')

    const header = document.createElement('div')
    header.classList.add('header')

    const steps = document.createElement('div')
    steps.classList.add('steps')

    const ingredients = document.createElement('div')
    ingredients.classList.add('ingredients')
    const grabPane = document.createElement('div')
    grabPane.classList.add('grab', 'pane')
    const clearPane = document.createElement('div')
    clearPane.classList.add('clear', 'pane')

    header.innerHTML = document.querySelector('[onclick="showSteps()"]').innerHTML
    header.innerHTML += 
    `<button title="Close" class='close' onclick='closeStepByStep()'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <defs/>
            <path fill="black" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    </button>`

    stepSrc.forEach(src => {
        const step = document.createElement('div')
        step.innerText = src.innerText
        steps.appendChild(step)
    })

    grabPane.innerHTML =
        `<div class='knob'><div></div></div>
      <h2>Ingredients</h2>
      <div class='table-container'>${ingredientSrc.outerHTML}</div>
    `
    ingredients.appendChild(clearPane)
    ingredients.appendChild(grabPane)

    overlay.appendChild(header)
    overlay.appendChild(steps)
    overlay.appendChild(ingredients)

    document.body.appendChild(overlay)
    window.getComputedStyle(overlay).width
    document.body.classList.add('overlaid')
}
function closeStepByStep() {
    const overlay = document.querySelector('.overlay')
    document.body.classList.remove('overlaid')
    setTimeout(() => {overlay.remove()}, 200)
}