class Editable {
    constructor (element) {
        element.addEventListener( 'blur',this.blurHandler.bind(element) );
        element.addEventListener( 'focus',this.focusHandler.bind(element) );
        element.addEventListener( 'input',this.inputHandler.bind(element) );
        this.element = element;
    }
    focusHandler() {
        if ( ! this.edited ) {
            this.previous = this.innerHTML;
            this.classList.add('cefocused');
        }
    }
    blurHandler() {
        this.innerHTML = this.innerText;
        if ( this.innerText === '' ) {
            this.innerHTML = this.previous;
            
            this.edited = false;
        } 
        this.classList.remove('cefocused');
    }
    inputHandler(e) {
        if ( ! this.edited ) {
            this.classList.remove('cefocused');
            if ( isAndroid ) triggerKeyboardEvent( this,48 );
            this.innerHTML = '';
            this.edited = true;
        }
    }
};
class Deletor {
    constructor (element) {
        element.addEventListener( 'click', function () {
            this.parentNode.remove()
        });
        this.element = element;
    }
};
var editables = [];
var deletors = [];

window.onload = function () {
    let editableElements = Array.from(document.querySelectorAll('[contenteditable=true]'))
    for ( i = 0; i < editableElements.length; i++ ) {
        editables[i] = new Editable(editableElements[i]);
    }
    let deletorElements = Array.from(document.querySelectorAll('.delete'));
    for ( i = 0; i < deletorElements.length; i++ ) {
        deletors[i] = new Deletor(deletorElements[i])
    }
    document.querySelector('h1').addEventListener( 'input', function () {
        if (document.title != this.textContent) {
            document.title = this.textContent
        }
    });
    document.querySelector('.filePicker').addEventListener( 'click',function () {
        document.querySelector('input').click();
    });
    document.querySelector('input').addEventListener( 'change',handleFiles.bind(this) );
    document.querySelector('button.cancel').addEventListener( 'click',function() {
        document.querySelector('#addImage').lastChild.remove();
        document.querySelector('#addImage').classList.remove('added');
        document.querySelector('input').value = null;
    });
    document.querySelector('#addNewIngredient').addEventListener( 'click',addNewIngredient.bind(this) );
    document.querySelector('#addNewStep').addEventListener( 'click',addNewStep.bind(this) );
    document.querySelector('button.publish').addEventListener( 'click',publish());
};

function handleFiles() {
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
function addNewIngredient() {
    let newIngredient = document.createElement("li");
    newIngredient.innerHTML = `<span contenteditable='true' class='quantity'>amount</span> \
                               <span contenteditable='true'>ingredient</span> \
                               <button title='delete item' class='delete'>&#10005;</button>`;
    document.querySelector('ul').insertBefore(newIngredient,document.querySelector('#addNewIngredient'));
    editables.push(new Editable(newIngredient.childNodes[0]));
    editables.push(new Editable(newIngredient.childNodes[2]));
     deletors.push(new Deletor (newIngredient.childNodes[4]));
};
function addNewStep() {
    let count = document.querySelector('div.preparation').childElementCount;
    let newStep = document.createElement("p");
    newStep.innerHTML = `<span contenteditable='true'>Do thing ${count}</span> \
                         <button title='delete item' class='delete'>&#10005;</button>`;
    document.querySelector('div.preparation').insertBefore(newStep, document.querySelector('#addNewStep'),newStep);
    editables.push(new Editable(newStep.childNodes[0]));
    deletors.push(new Deletor(newStep.childNodes[2]));
}
function publish() {
    return function() {
        let image = document.querySelector('img');
        if ( image === null ) {
            document.querySelector('#addImage').remove()
        } else {
            document.querySelector('#addImage').replaceWith(image)
        }
        for ( i = 0; i < editables.length; i++ ) {
            editables[i].element.removeAttribute('contenteditable');
            let newNode = editables[i].element.cloneNode(true);
            editables[i].element.parentNode.replaceChild(newNode,editables[i].element)
        }
        for ( i = 0; i < deletors.length; i++ ) {
            deletors[i].element.remove();
        }
        document.querySelector('#addNewStep').remove();
        document.querySelector('#addNewIngredient').remove();
        
        let quants = document.querySelectorAll('.quantity');
        let width = 0;
        for ( i = 0; i < quants.length; i++ ) {
            if ( quants[i].offsetWidth > width ) width = quants[i].offsetWidth;
        }
        for ( i = 0; i < quants.length; i++ ) {
            quants[i].style.width = width + 'px';
            quants[i].parentElement.style.paddingLeft = width + 5 + 'px';
            quants[i].parentElement.style.textIndent = -width - 5 + 'px';
            quants[i].parentElement.innerHTML = quants[i].outerHTML + quants[i].nextElementSibling.innerText;
        }
        document.querySelector('button.publish').remove();
        document.head.querySelector('script').remove();
        document.head.querySelector('[href="template.css"').remove();
      
        window.print();
    }
}
<<<<<<< HEAD
function triggerKeyboardEvent(el, keyCode){
    var keyboardEvent = document.createEvent("KeyboardEvent");
    
    var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
  
  
    keyboardEvent[initMethod](
                       "keydown",
                        true,      // bubbles oOooOOo0
                        true,      // cancelable   
                        window,    // view
                        false,     // ctrlKeyArg
                        false,     // altKeyArg
                        false,     // shiftKeyArg
                        false,     // metaKeyArg
                        keyCode,  
                        0          // charCode   
    );
  
    el.dispatchEvent(keyboardEvent); 
}
function onAndroid() {
    let regex = RegExp('Android' + 'Chrome/[.0-9]* Mobile');
    return regex.test(navigator.userAgent)
}
var isAndroid = onAndroid();
=======
>>>>>>> d6e2a50654db9434d6bc6d582ba9215a99235c61
