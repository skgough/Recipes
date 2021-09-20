var template = true
let editables = document.querySelectorAll('[contenteditable="true"]');
for (i = 0; i < editables.length; i++) {
    createEditable(editables[i]);
}

let addImageButton = document.querySelector('.flex > button');
addImageButton.addEventListener('click', function () {
    document.querySelector('input[type="file"]').click();
});

let addIngredientButton = document.querySelector('.ingredients tr:last-child button');
addIngredientButton.addEventListener('click', function () {
    let tr = document.createElement('tr');
    tr.innerHTML = `<td><span contenteditable="true">Quantity</span></td>
                    <td><span contenteditable="true">Ingredient</span></td>
                    <td>
                        <button title="delete" class='delete' onclick='deleteRow(this)'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </td>`;
    let parent = document.querySelector('table.ingredients tbody');
    let reference = parent.querySelector('tr:last-child');
    parent.insertBefore(tr, reference);

    let editables = tr.querySelectorAll('[contenteditable="true"]');
    for (i = 0; i < editables.length; i++) {
        createEditable(editables[i]);
    }
});

let addStepButton = document.querySelector('.preparation li:last-child button');
addStepButton.addEventListener('click', function () {
    let numSteps = document.querySelectorAll('ol.preparation li').length;
    let li = document.createElement('li');
    li.innerHTML = `<span contenteditable="true">Step ${numToString(numSteps)}</span>
                    <button title="Delete" class='delete' onclick='deleteStep(this)'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <defs/>
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>`;
    let parent = document.querySelector('ol.preparation');
    let reference = document.querySelector('ol.preparation li:last-child');
    parent.insertBefore(li, reference);

    let span = li.childNodes[0];
    createEditable(span);
});

let inputElement = document.querySelector('input[type=file]');
inputElement.addEventListener("change", handleFiles, false);
async function handleFiles() {
    let file = this.files[0];
    let figure = document.createElement('figure');
    figure.innerHTML = `<button title="Delete" class='delete' onclick='deleteImage(this)'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <defs/>
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>`
    let img = document.createElement('img');

    img.src = await toBase64(file);
    figure.appendChild(img);
    document.querySelector('.flex > button').replaceWith(figure);
}

function createEditable(node) {
    node.dataset.initialValue = node.innerText;
    node.addEventListener('focus', function () {
        if (this.innerText === this.dataset.initialValue) {
            selectText(this)
        }
    });
    node.addEventListener('blur', function () {
        this.innerHTML = this.innerText.replace(/\r?\n|\r/g, " ");
        if (this.innerText.replace(' ', '') === '') {
            this.innerText = this.dataset.initialValue;
        }
        window.getSelection().removeAllRanges();
    })
}

function selectText(node) {
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}
function deleteRow(node) {
    node.parentElement.parentElement.remove();
}
function deleteStep(node) {
    node.parentElement.remove();
}
function deleteImage(node) {
    document.querySelector('input[type="file"]').value = '';
    let button = document.createElement('button');
    button.innerHTML = `Add<br>image`;
    button.addEventListener('click', function () {
        document.querySelector('input[type="file"]').click();
    });
    node.parentElement.replaceWith(button);
}
function numToString(integer) {
    let digitsToTwenty = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
    let tensPlace = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    if (integer <= 20) {
        return digitsToTwenty[integer]
    }
    if (integer > 20) {
        return tensPlace[Math.floor(integer / 10)] + '-' + digitsToTwenty[integer - Math.floor(integer / 10) * 10]
    }
}
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

async function saveOfflineCopy() {
    await removeTemplateFunctionality();

    let ingrHeader = document.querySelector('.ingredients-header');
    let stepByStep = document.createElement('button');
    stepByStep.setAttribute("onclick", "showSteps()");
    stepByStep.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <defs />
                                <path
                                    d="M209.192 241h-91.34c-4.6 0-8.945 2.11-11.789 5.725s-3.873 8.334-2.79 12.805c8.586 35.465 22.459 71.72 60.249 71.72s51.662-36.255 60.249-71.72c1.083-4.47.054-9.19-2.79-12.805S213.792 241 209.192 241zM163.522 0c-20.128 0-37.859 8.034-51.276 23.233-24.555 27.816-32.7 76.349-24.208 144.251 1.423 11.36 2.75 21.303 4.056 30.398 1.061 7.385 7.387 12.868 14.848 12.868h113.16c7.46 0 13.787-5.483 14.848-12.868 1.311-9.123 2.637-19.066 4.056-30.398v-.002c8.491-67.9.346-116.432-24.208-144.249C201.381 8.034 183.651 0 163.522 0zM394.147 421.75h-91.34c-4.6 0-8.945 2.11-11.789 5.725s-3.873 8.334-2.79 12.805c8.586 35.465 22.459 71.72 60.249 71.72s51.662-36.255 60.249-71.72c1.083-4.47.054-9.19-2.79-12.805s-7.189-5.725-11.789-5.725zM399.753 203.983c-13.417-15.199-31.147-23.233-51.276-23.233s-37.859 8.034-51.276 23.233c-24.555 27.816-32.7 76.349-24.208 144.251 1.419 11.332 2.746 21.276 4.056 30.398 1.061 7.385 7.387 12.868 14.848 12.868h113.16c7.46 0 13.787-5.483 14.848-12.868 1.306-9.095 2.633-19.038 4.056-30.398v-.003c8.492-67.899.347-116.432-24.208-144.248z" />
                            </svg>
                            <span>Step-by-step</span>`;
    ingrHeader.appendChild(stepByStep);

    let printBtn = document.createElement('button');
    printBtn.setAttribute('onclick', 'print()')
    printBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                          </svg><span>Print</span>`
    ingrHeader.appendChild(printBtn);

    // let indicator = document.createElement('div');
    // indicator.classList.add('indicator');
    // let numSteps = slides.querySelectorAll('li').length;
    // for (i = 0; i < numSteps; i++) {
    //     let button = document.createElement('button');
    //     button.setAttribute('onclick', `steps.slide(${i})`);
    //     button.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    //                             <circle cx="50" cy="50" r="50"/>
    //                         </svg>`;
    //     indicator.appendChild(button);
    // }
    // indicator.querySelectorAll('button')[0].classList.add('active');

    // let exit = document.createElement('button');
    //     exit.classList.add('exit-steps');
    // exit.innerHTML = `
    //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    //         <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    //     </svg>`;
    // exit.setAttribute('onclick','showSteps()');

    let script = document.createElement('script');
        script.src= "script.js";
        script.setAttribute('defer',true);
    document.head.appendChild(script);
    
    document.head.querySelector('script[src="template.js"]').remove();

    const htmlContent = [document.documentElement.outerHTML];
    let bl = new Blob(htmlContent, {type: "text/html"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = `${document.title.replace(/[^\w\s]/gi, '')}.html`;
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "Output";
    // a.click();
}

function removeTemplateFunctionality() {
    return new Promise((resolve) => {
        document.querySelector('input').remove();
        document.head.querySelector('link').href = "style.css";

        let ingredients = document.querySelector('table.ingredients');
        ingredients.querySelector('tr:last-child').remove();
        let ingrButtonCells = ingredients.querySelectorAll('td:last-child');
        ingrButtonCells.forEach(cell => cell.remove());


        let title = document.querySelector('h1');
        let span = title.querySelector('span');
        title.innerHTML = `<span>${span.innerText}</span><a href="index.html">Home</a>`;
        document.title = span.innerText;

        let editables = document.querySelectorAll('[contenteditable="true"]');
        editables.forEach(span => span.replaceWith(document.createTextNode(span.innerText)));

        let preparation = document.querySelector('ol.preparation');
        preparation.querySelector('li:last-child').remove();

        let buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.remove());

        resolve();
    });
}