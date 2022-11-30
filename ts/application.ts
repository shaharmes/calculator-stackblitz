let button = document.getElementById("info");
const old = button.style.backgroundColor;
let element = document.getElementById("cloud");
const oldB = button.style.backgroundColor;
let scientificFlag = false;
let popupFlag = false;
let remoteFlag = false;

function popupInfo() {
    let element = document.getElementById("popup");
    let version = '1.0.0';
    const text = '<p>' +
                    'Name: Shahar Meshulam<br>Version:' + version + '<br>Information: Scientific calculator<br><u>Click the icon again to close the popup!</u>' +
                 '</p>'
    if (!popupFlag){
        element.style.display = "block";
        element.insertAdjacentHTML('beforeend', text);
        popupFlag = true;
        button.style.background = '#FFDAB9';
    } else {
        element.style.display = "none";
        element.innerHTML = '';
        popupFlag = false;
        button.style.background = old;
    }
}

function remoteMode() {
    if (!remoteFlag) {
        element.style.background = '#FFDAB9';
        remoteFlag = true;
    } else {
        element.style.background = oldB;
        remoteFlag = false;
    }
}

function darkMode() {
    let element = document.body;
    element.classList.toggle("dark-mode");
}

function lightBulb() {
    let element = document.body;
    element.classList.toggle("light-mode");
 }

function scientificMode() {
    let element = document.body;
    element.classList.toggle('scientific-mode');
    if (scientificFlag) {
        scientificFlag = false;
    } else {
        scientificFlag = true;
    }
    allClear();
}

function allClear() {
    calcState.operator = null;
    calcState.lastNumber = '';
    calcState.operatorFlag = false;
    calcState.firstNumber = '';
    calcState.secondOperator = false;
    display.innerText = '';
    operDisplay.innerText = '';
    calcState.fixedOp = null;
    calcState.rootCalc = 0;
    calcState.rootFlag = false;
}


function historyMode() {
    let element = document.body;
    element.classList.toggle('history-mode');
}

function displayButtonInfo (button) {
    if (button.value === 'info') {
        return popupInfo();
    }
    if (button.value === 'light') {
        return lightBulb();
    }

    if (button.value === 'all-clear') {
        return allClear();
    }

    if (button.value === 'nthRoot') {
        return scientificMode();
    }

    if (button.value === "history") {
        return historyMode();
    }

    if (button.value === 'cloud') {
        return remoteMode();
    }

    if (button.value === 'back'){
        if (checkIfLastElementIsOperator()) {
            calcState.operatorFlag = false;
        }
        display.innerText = display.innerText.slice(0, -1);
        return;
    }

 }


let buttons_app = document.getElementsByTagName('button');
for (let i = 0, len = buttons_app.length; i < len; i++) {
    buttons_app[i].onclick = function (){
        displayButtonInfo (this);
    }
}

function changeSettings(){
    if (window.location.search){
        const params = new URLSearchParams(window.location.search);
        let screenMode = params.get('mode');
        let backgroundColor = params.get('color');
        let fontFamily = params.get('font');
        if (screenMode === 'dark') {
            darkMode();
        }
        if (backgroundColor) {
            document.body.style.backgroundColor = backgroundColor;
        }
        if (fontFamily) {
            document.body.style.fontFamily = fontFamily;
        }
    }
  }
  addEventListener('DOMContentLoaded',() => {
    changeSettings();
    allClear();
  });

