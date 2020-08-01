let editables = document.querySelectorAll('[contenteditable="true"]');
for (i = 0; i < editables.length; i++) {
    editables[i].dataset.initialValue = editables[i].innerText;
    editables[i].addEventListener('focus', function () {
        if (this.innerText === this.dataset.initialValue) {
            selectText(this)
        }
    });
    editables[i].addEventListener('blur', function () {
        this.innerHTML = this.innerText.replace(/\r?\n|\r/g, " ");
        if (this.innerText.replace(' ','') === '') {
            this.innerText = this.dataset.initialValue;
        }
        window.getSelection().removeAllRanges();
    })
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
                        <td><button title="delete" class='delete' onclick='deleteRow(this)'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg></button></td>`;
    let parent = document.querySelector('table.ingredients tbody');
    let reference = parent.querySelector('tr:last-child');
    parent.insertBefore(tr, reference);

    let editables = tr.querySelectorAll('[contenteditable="true"]');
    for (i = 0; i < editables.length; i++) {
        editables[i].dataset.initialValue = editables[i].innerText;
        editables[i].addEventListener('focus', function () {
            if (this.innerText === this.dataset.initialValue) {
                selectText(this)
            }
        });
        editables[i].addEventListener('blur', function () {
            this.innerHTML = this.innerText.replace(/\r?\n|\r/g, "");
            if (this.innerText === '') {
                this.innerText = this.dataset.initialValue;
            }
            window.getSelection().removeAllRanges();
        })
    }
});

let addStepButton = document.querySelector('.preparation li:last-child button');
addStepButton.addEventListener('click', function () {
    let numSteps = document.querySelectorAll('ol.preparation li').length;
    let li = document.createElement('li');
    li.innerHTML = `<span contenteditable="true">Step ${numToString(numSteps)}</span><button title="Delete" class='delete' onclick='deleteStep(this)'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs/>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg></button>`;
    let parent = document.querySelector('ol.preparation');
    let reference = document.querySelector('ol.preparation li:last-child');
    parent.insertBefore(li, reference);

    let span = li.childNodes[0];
    span.dataset.initialValue = span.innerText;
    span.addEventListener('focus', function () {
        if (this.innerText === this.dataset.initialValue) {
            selectText(this)
        }
    });
    span.addEventListener('blur', function () {
        this.innerHTML = this.innerText.replace(/\r?\n|\r/g, "");
        if (this.innerText === '') {
            this.innerText = this.dataset.initialValue;
        }
        window.getSelection().removeAllRanges();
    })
});

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
function numToString(integer) {
    let digitsToTwenty = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    let tensPlace = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    if (integer < 20) {
        return digitsToTwenty[integer]
    }
    if (integer >= 20) {
        return tensPlace[Math.floor(integer / 10)] + ' ' + digitsToTwenty[integer - Math.floor(integer / 10) * 10]
    }
}