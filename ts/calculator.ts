let display = document.getElementById('result');

let operDisplay = document.getElementById('operScreen');

let buttons = Array.from(document.getElementsByTagName('button'));
let imgs = Array.from(document.querySelectorAll('.scIcons'));


type calcHandler = {
    operator: string;
    lastNumber: string;
    operatorFlag: boolean;
    firstNumber: string;
    secondOperator: boolean;
    fixedOp: any;
    rootFlag: boolean;
    rootCalc: number;
}

let calcState: calcHandler = {
    operator: null,
    lastNumber: '',
    operatorFlag: false,
    firstNumber: '',
    secondOperator: false,
    fixedOp: null,
    rootFlag: false,
    rootCalc: 0
}

function numberHandling(element: HTMLElement) {
    if (calcState.operator) {                       
        calcState.lastNumber += element.innerText;
    } else if (!calcState.operatorFlag) {
        calcState.firstNumber += element.innerText;
    }

    
    if (display.innerText[display.innerText.length - 1] === ')') {
        display.innerText += '*';
    }
   
    display.innerText += element.innerText;
    calcState.operatorFlag = false;
}

const remoteCalc = async () => {
    let response = await fetch("https://api.mathjs.org/v4/?expr=" + encodeURIComponent(display.innerText));
    let data = await response.text();
    return data;
}

function operLog () {
    operDisplay.innerText = operDisplay.innerText + 
                            display.innerText + "\n" + "=" + " " +
                            eval(display.innerText) + "\n";
}

function operatorHandling(element: HTMLElement) {
    calcState.operator = element.innerText;
    if (element.id === 'times') {
        calcState.operator = '*';
    }
    if (element.id === 'divide') {
        calcState.operator = '/';
    }
    if(checkUndefined()) {
        if (calcState.operator !== '-') {
            errDisplay();
            return;
        }
    }
    display.innerText +=calcState.operator;
    calcState.operatorFlag = true;
}

function postEval() {
    calcState.firstNumber = display.innerText;
    calcState.lastNumber = '';
}

function checkIfLastElementIsOperator() {
    if (display.innerText[display.innerText.length - 1] === '*' ||
            display.innerText[display.innerText.length - 1] === '/' ||
            display.innerText[display.innerText.length - 1] === '+' ||
            display.innerText[display.innerText.length - 1] === '%' ||
            display.innerText[display.innerText.length - 1] === '-') {
                return true;
        } else {
            return false;
        }
}

function errDisplay() {
    setTimeout(() => { 
        display.innerText = 'Error, Clear in 2 seconds';
        setTimeout(() => {
            display.innerText = '';
        }, 2000);
    }, 0);
}

function checkUndefined() {
    if (display.innerText === 'undefined') {
        display.innerText = '';
        return true;
    } else {
        return false;
    }
}

function powerBy2() {
    if (checkIfLastElementIsOperator() || !display.innerText) {
        errDisplay();
        return;
    }
    display.innerText = display.innerText + '**2';
}

function powery () {
    if (checkIfLastElementIsOperator() || !display.innerText) {
        errDisplay();
        return;
    }
    display.innerText = display.innerText + '**';
}

function root (){
    if (checkIfLastElementIsOperator() || !display.innerText) {
        errDisplay();
        return;
    }
    display.innerText = display.innerText + '**0.5';
}

function pi () {
    if (checkIfLastElementIsOperator() || !display.innerText) {
        errDisplay();
        return;
    }
    display.innerText = display.innerText + '3.141';
}

function rooty() {
    if (checkIfLastElementIsOperator() || !display.innerText) {
        errDisplay();
        return;
    }
    display.innerText = display.innerText + '**(1/';
}

function mod() {
    if (checkIfLastElementIsOperator() || !display.innerText) {
        errDisplay();
        return;
    }
    display.innerText = display.innerText + '%';
}

function closeRoot() {
    display.innerText += ')';
    calcState.rootFlag = false;
    calcState.rootCalc = 0;
}



function operatorScientific(element: HTMLElement) {

    if (!display.innerText) {
            if (element.innerText !== '-') {
                errDisplay();
                return;
            }
        }

    if(calcState.secondOperator) {
        operLog();
        if (remoteFlag) {
            remoteCalc().then((data) => {
                display.innerText = data;
            });
        } else {
            display.innerText = eval(display.innerText);
        }
        postEval();
        calcState.secondOperator = false;
    } else if (calcState.operator) {
        if (calcState.operator === '*' || calcState.operator === '/') {
            operLog();
            if (remoteFlag) {
                remoteCalc().then((data) => {
                    display.innerText = data;
                });
            } else {
                display.innerText = eval(display.innerText);
            }
            postEval();
            calcState.secondOperator = false;
        } else {
            calcState.secondOperator = true;
            operatorHandling(element);
            calcState.fixedOp = element;
            return;
        }   
    }

    operatorHandling(element);
}


function operatorSimple(element: HTMLElement) {
    if (calcState.operator) {
        if (calcState.fixedOp.className === 'operator') {
        } else {
            operLog();
        }}
    display.innerText = eval(display.innerText);
    postEval();
    operatorHandling(element);
}


buttons.map(button => {
    button.addEventListener('click', (e) => {
        let element = e.target as HTMLElement;

        if (calcState.rootCalc > 1) {
            closeRoot();
        }


        switch(element.className) {
            case 'number':
                numberHandling(element);
                break;

            case 'operator':
                if (checkIfLastElementIsOperator()) {
                    display.innerText = display.innerText.slice(0, -1);
                    calcState.operatorFlag = false;
                    operatorHandling(element);
                    break;
                }

                if (scientificFlag) {
                    operatorScientific(element);
                } else {
                    operatorSimple(element);
                }
                
                break;

            case 'equal-sign':
                if (checkIfLastElementIsOperator()) {
                    display.innerText = display.innerText.slice(0, -1);
                    calcState.operatorFlag = false;
                }
                operLog();
                display.innerText = eval(display.innerText);
                break;


            case 'decimal':
                if (calcState.operator) {
                    if (calcState.lastNumber.indexOf('.') === -1) {
                        calcState.lastNumber += '.';
                        display.innerText += '.';
                    } else {
                        errDisplay();
                }
                } else {
                    if (calcState.firstNumber.indexOf('.') === -1) {
                        calcState.firstNumber += '.';
                        display.innerText += '.';
                    } else {
                        errDisplay();
                    }
                }
                break;

            case 'scBtn':
                console.log('scientific');
                if (element.id === 'power2') {
                    powerBy2();
                    
                }

                if (element.id === 'rootn') {
                    root();
                }

                if (element.id === 'pi') {
                    pi();
                }

                if (element.id === 'powery') {
                    powery();
                }

                if (element.id === 'rooty') {
                    calcState.rootFlag = true;
                    rooty();
                }

                if(element.id === 'mod') {
                    mod();
                }

                break;
                
            }
            calcState.fixedOp = element;
            if (calcState.rootFlag === true) {
                calcState.rootCalc++;
            }
            
    });
});

imgs.map(img => {
    img.addEventListener('click', (e) => {
        let element = e.target as HTMLElement;

        switch (element.id) {
            case 'power2':
                powerBy2();
                break;
            
            case 'rootn':
                root();
                break;   

            case 'powery':
                powery();
                break;

            case 'rooty':
                calcState.rootFlag = true;
                rooty();
                break;
            
            }

    });
});