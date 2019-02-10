class Editable {
    // wraps the element passed as argument in a class and attaches event listeners
    constructor(element) {
        let wrapper = this;                                 // bind sets *this* context to the passed element
        element.addEventListener('blur',   wrapper.blurHandler.bind(element, wrapper));
        element.addEventListener('focus', wrapper.focusHandler.bind(element, wrapper));
        element.addEventListener('input', wrapper.inputHandler.bind(element, wrapper));

        // element is available as Editable.element
        this.element = element;
    }

    // if text hasn't been edited, clear out text (perceived behaviour)
    focusHandler(wrapper) {
        // wrapper.edited is set after input
        if (!wrapper.edited) {
            // save the element's current text as wrapper.previous
            wrapper.previous = this.innerText;

            // toggle on cefocused class, which hides text 
            // but does not edit the html
            this.classList.add('cefocused');

            // collect the text nodes of element in a range, 
            // and collapse them to zero length
            let range = document.createRange();
            range.setStart(this.childNodes[0], this.childNodes[0].length);
            range.collapse(true);

            // get current cursor position and clear selected text
            let sel = window.getSelection();
            sel.removeAllRanges();

            /*  
                set range as currently selected text.
                this has the effect of setting the cursor 
                position to the end of the text node.

                this prevents the user from inserting text into
                the middle of the template text which would
                interfere with the inputHandler() function.
            */
            sel.addRange(range);
        }
    }


    inputHandler(wrapper) {
        if (!wrapper.edited) {
            // subtract template text leaving only input
            this.innerHTML = this.textContent.replace(wrapper.previous, '');

            // set cursor to end
            let range = document.createRange();
            range.setStart(this.childNodes[0], this.childNodes[0].length);
            range.collapse(true);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            // remove cefocused so you can see the text
            this.classList.remove('cefocused');
        }
        wrapper.edited = true;
    }

    // on defocus check if left blank and reset to template text
    blurHandler(wrapper) {
        if (this.innerText === '') {
            this.innerText = wrapper.previous;
            wrapper.edited = false;
        }
        this.classList.remove('cefocused');
    }
};

// all button.delete elements delete their parent when clicked.
class Deletor {
    constructor(element) {
        element.addEventListener('click', function () {
            this.parentNode.remove()
        });
        this.element = element;
    }
};

// arrays to contain all class members
// this makes it easy to remove all dynamic content
// during publish() through looping
var editables = [];
var deletors = [];

window.onload = function () {
    // all elements set to editable are collected as class Editable members
    let editableElements = document.querySelectorAll('[contenteditable=true]');
    for (i = 0; i < editableElements.length; i++) {
        editables[i] = new Editable(editableElements[i]);
    }

    // collect delete buttons
    let deletorElements = document.querySelectorAll('.delete');
    for (i = 0; i < deletorElements.length; i++) {
        deletors[i] = new Deletor(deletorElements[i])
    }

    // attach event listener to set doc title to the header text on input
    document.querySelector('h1').addEventListener('input', function () {
        if (document.title != this.textContent) {
            document.title = this.textContent
        }
    });

    // trigger hidden file input element on click.
    // why? more attractive looking than the native file input element
    document.querySelector('.filePicker').addEventListener('click', function () {
        document.querySelector('input').click();
    });

    // loads the input image into the #addImage container
    document.querySelector('input').addEventListener('change', handleFiles);

    // clears selected image from #addImage
    document.querySelector('button.cancel').addEventListener('click', function () {
        document.querySelector('#addImage').lastChild.remove();
        document.querySelector('#addImage').classList.remove('added');
        document.querySelector('input').value = null;
    });

    // creates a new li in the ingredients column and makes it an Editable
    document.querySelector('#addNewIngredient').addEventListener('click', addNewIngredient);

    // creates a new p in the instructions and makes it an Editable
    document.querySelector('#addNewStep').addEventListener('click', addNewStep);

    // removes all scripted content and calls window.print()
    document.querySelector('button.publish').addEventListener('click', publish);
};

// loads the input image into the #addImage container
var handleFiles = function () {
    let file = document.querySelector('input').files[0];
    let reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }
    reader.addEventListener("load", function () {
        let image = document.createElement('img')
        image.src = this.result;
        document.querySelector('#addImage').appendChild(image);
    });
    document.querySelector('#addImage').classList.add('added');
};



// begin helper functions

// creates a new li in the ingredients column and makes it an Editable
var addNewIngredient = function () {
    let newIngredient = document.createElement("li");
    newIngredient.innerHTML = `<span contenteditable='true' class='quantity'>amount</span> \
                               <span contenteditable='true'>ingredient</span> \
                               <button title='delete item' class='delete'>&#10005;</button>`;
    document.querySelector('ul').insertBefore(newIngredient, document.querySelector('#addNewIngredient'));
    editables.push(new Editable(newIngredient.childNodes[0]));
    editables.push(new Editable(newIngredient.childNodes[2]));
    deletors.push(new Deletor(newIngredient.childNodes[4]));
};

// creates a new p in the instructions and makes it an Editable
var addNewStep = function () {
    let count = document.querySelector('div.preparation').childElementCount;
    let newStep = document.createElement("p");
    newStep.innerHTML = `<span contenteditable='true'>Do thing ${count}</span> \
                         <button title='delete item' class='delete'>&#10005;</button>`;
    document.querySelector('div.preparation').insertBefore(newStep, document.querySelector('#addNewStep'), newStep);
    editables.push(new Editable(newStep.childNodes[0]));
    deletors.push(new Deletor(newStep.childNodes[2]));
}

// removes all scripted content and calls window.print()
var publish = function () {
    let image = document.querySelector('img');
    if (image === null) {
        document.querySelector('#addImage').remove()
    } else {
        document.querySelector('#addImage').replaceWith(image)
    }
    for (i = 0; i < editables.length; i++) {
        editables[i].element.removeAttribute('contenteditable');
        let newNode = editables[i].element.cloneNode(true);
        editables[i].element.parentNode.replaceChild(newNode, editables[i].element)
    }
    for (i = 0; i < deletors.length; i++) {
        deletors[i].element.remove();
    }
    document.querySelector('#addNewStep').remove();
    document.querySelector('#addNewIngredient').remove();

    let quants = document.querySelectorAll('.quantity');
    let width = 0;
    for (i = 0; i < quants.length; i++) {
        if (quants[i].offsetWidth > width) width = quants[i].offsetWidth;
    }
    for (i = 0; i < quants.length; i++) {
        quants[i].style.width = width + 'px';
        quants[i].parentElement.style.paddingLeft = width + 5 + 'px';
        quants[i].parentElement.style.textIndent = -width - 5 + 'px';
        quants[i].parentElement.innerHTML = quants[i].outerHTML + quants[i].nextElementSibling.innerText;
    }
    document.querySelector('a.home').remove();
    document.querySelector('button.publish').remove();
    document.head.querySelector('script').remove();
    document.head.querySelector('[href="template.css"').remove();

    window.print();
}