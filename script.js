const totalClicks = document.querySelector("#total-clicks");
const bpmElement = document.querySelector("#BPM");
const cpsElement = document.querySelector("#CPS");
const urElement = document.querySelector("#UR");
const key1Button = document.querySelector("#key-1");
const key2Button = document.querySelector("#key-2");
const keyRButton = document.querySelector("#key-r");
const keySetPrompt = document.querySelector("#key-set-prompt");
const testButtonTime = document.querySelector("#test-time");
const testButtonTaps = document.querySelector("#test-taps");
const timeSection = document.querySelector("#time-section");
const tapsSection = document.querySelector("#taps-section");
const timeInput = document.querySelector("#time-box");
const tapsInput = document.querySelector("#taps-box");
const progressBar = document.querySelector("#progress-bar");

var clicks = 0;
var BPM = 0;
var CPS = 0.0;
var UR = 0.0;

var key1 = 'z';
var key2 = 'x';
var keyR = 'r';

var key1Flag = false;
var key2Flag = false;
var isFocused = true;
var stopped = false;
var started = false;
var canEdit = true;
var isTimeMode = true;

var timeFactor = 10;
var timeElapsed = 0.0;
var targetTime = 5 * timeFactor;
var targetTaps = 16;
var timer;
var lastTime = null;
var intervals = [];

function reset() {
    key1Flag = false;
    key2Flag = false;
    stopped = false;
    started = false;
    canEdit = true;
    intervals = [];
    timeElapsed = 0;
    clicks = 0;
    lastTime = null;

    clearInterval(timer);

    totalClicks.textContent = clicks;
    bpmElement.textContent = 0;
    cpsElement.textContent = 0;
    urElement.textContent = 0.00;
}

function calculateBPM() {
    var minutes = (timeElapsed/timeFactor) / 60;
    BPM = clicks / (minutes * 4);
    bpmElement.textContent = BPM.toFixed(0);
}

function calculateCPS() {
    CPS = clicks/(timeElapsed/timeFactor);
    cpsElement.textContent = CPS.toFixed(2);
}

function calculateUR() {
    var newArr = intervals.slice(1);
    var std = getArraySTD(scaleArray(newArr, 1000));
    urElement.textContent = (std * 10).toFixed(2);
}

calculateUR();

function getArrayAverage(arr) {
    if (arr.length >= 1) {
        var sum = getArraySum(arr);
        var average = sum/arr.length;
        return average;
    }
    return 0;
}

function getArraySum(arr) {
    var sum = 0.0;
    if (arr.length >= 1) {
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
    }
    return sum;
}

function getArraySTD(arr) {
    var result = 0.0;
    if (arr.length >= 2) {
        var mean = getArrayAverage(arr);
        var sqDeviationSum = 0.0;
        var N = arr.length;
        for (var i = 0; i < N; i++) {
            sqDeviationSum += Math.pow((arr[i] - mean), 2);
        }
        sqDeviationSum /= N;
        result = Math.sqrt(sqDeviationSum);
    }
    return result;
}

function scaleArray(arr, factor) {
    var newArr = []
    for (var i = 0; i < arr.length; i++) {
        newArr.push(arr[i] * factor);
    }
    return newArr;
}

function countTime() {
    if (timeElapsed >= targetTime - 1 && isTimeMode) {
        clearInterval(timer);
        stopped = true;
    }
    timeElapsed += 1;
    calculateUR();
    calculateBPM();
    calculateCPS();
}

function keyTap() { 
    if (!started) {
        start();
    }
    if (!isTimeMode && clicks == targetTaps - 1) {
        clearInterval(timer);
        stopped = true;        
        calculateUR();
        calculateBPM();
        calculateCPS();
    }
    clicks += 1;
    totalClicks.textContent = clicks;
    const currentTime = performance.now();
    if (lastTime !== null) {
        var intr = (currentTime - lastTime)/1000;
        intervals.push(intr);
    }
    lastTime = currentTime;
}

function isNumericInput(input) {
    return /^\d+(\.\d+)?$/.test(input);
}

function start() {
    if (isTimeMode) {
        if (timeInput.value == '' || !isNumericInput(timeInput.value)) {
            targetTime = 5 * timeFactor;
        }
        else {
            targetTime = (parseFloat(timeInput.value)).toFixed(1) * timeFactor;
        }
    }
    else {
        if (tapsInput.value == '' || !isNumericInput(tapsInput.value)) {
            targetTaps = 16;
        }
        else {
            targetTaps = Math.floor(parseFloat(tapsInput.value));
        }
    }
    if (canEdit) {
        canEdit = false;
    }
    started = true;
    timer = setInterval(countTime, 100);
}

function keyButtonClick(e) {
    keySetPrompt.style.display = 'block';
    isFocused = false;
    e.stopPropagation();
}

function checkIncomingInput(e) {
    const allowed = [
        "Backspace", "Tab", "Delete",
        "ArrowLeft", "ArrowRight", "Home", "End"
    ];

    if (e.ctrlKey || e.metaKey) return;

    var isNumber;

    if (isTimeMode) 
        isNumber = ((e.key >= '0' && e.key <= '9') || e.key == '.');
    else
        isNumber = e.key >= '0' && e.key <= '9';

    const isAllowed = allowed.includes(e.key);

    if (!isNumber && !isAllowed) {
        e.preventDefault();
    }
}

document.addEventListener("keydown", (e)=> {
    if (!isFocused) {
        return;
    }
    
    if (e.key == key1 && !key1Flag && !stopped) {
        key1Flag = true;
        keyTap();
    }
    if (e.key == key2 && !key2Flag && !stopped) {
        key2Flag = true;
        keyTap();
    }
    if (e.key == keyR) {
        reset();
    }
});

document.addEventListener("keyup", (e) => {
    if (!isFocused) {
        return;
    }

    if (e.key == key1) {
        key1Flag = false;
    }
    if (e.key == key2) {
        key2Flag = false;
    }
});

document.addEventListener("click", (e) => {
    const elements = [key1Button, key2Button, keyRButton, tapsInput, timeInput]
    if (
        !keySetPrompt.contains(e.target) && 
        !elements.includes(e.target) && 
        !isFocused
    ) {
        keySetPrompt.style.display = 'none';
        isFocused = true;
    }
});

// Keys buttons 
key1Button.addEventListener("click", (e) => {
    keyButtonClick(e);
});

key2Button.addEventListener("click", (e) => {
    keyButtonClick(e);
});

keyRButton.addEventListener("click", (e) => {
    keyButtonClick(e);
});

key1Button.addEventListener("keyup", (e) => {
    if (document.activeElement === key1Button) {
        if (key2 == e.key || keyR == e.key) {
            isFocused = false;
            return;
        }
        if ((e.key >= 'a' && e.key <= 'z') || (e.key >= '0' && e.key <= '9')) {
            key1 = e.key;
            key1Button.textContent = key1.toUpperCase();
            isFocused = true;
            key1Button.blur();
            keySetPrompt.style.display = 'none';
        }
    }
});

key2Button.addEventListener("keyup", (e) => {
    if (document.activeElement === key2Button) {
        if (key1 == e.key || keyR == e.key) {
            isFocused = false;
            return;
        }
        if ((e.key >= 'a' && e.key <= 'z') || (e.key >= '0' && e.key <= '9')) {
            key2Button.blur();
            key2 = e.key;
            key2Button.textContent = key2.toUpperCase();
            isFocused = true;
            keySetPrompt.style.display = 'none';
        }
    }
});

keyRButton.addEventListener("keyup", (e) => {
    if (document.activeElement === keyRButton) {
        if (key1 == e.key || key2 == e.key) {
            isFocused = false;
            return;
        }
    }
    if ((e.key >= 'a' && e.key <= 'z') || (e.key >= '0' && e.key <= '9')) {
        keyRButton.blur();
        keyR = e.key;
        keyRButton.textContent = keyR.toUpperCase();
        isFocused = true;
        keySetPrompt.style.display = 'none';
    }    
});

// Test buttons
testButtonTime.addEventListener("click", () => {
    if (testButtonTime.classList.contains("clicked")) {
        return;
    }
    if (!canEdit) {
        if (!stopped) {
            return;
        }
    }
    isTimeMode = true;
    timeSection.style.display = 'flex';
    tapsSection.style.display = 'none';
    testButtonTime.classList.toggle("clicked");
    testButtonTaps.classList.remove("clicked");
});

testButtonTaps.addEventListener("click", () => {
    if (testButtonTaps.classList.contains("clicked")) {
        return
    }
    if (!canEdit) {
        if (!stopped) {
            return;
        }
    }
    isTimeMode = false;
    timeSection.style.display = 'none';
    tapsSection.style.display = 'flex';
    testButtonTaps.classList.toggle("clicked");
    testButtonTime.classList.remove("clicked");
});

// input boxes
timeInput.addEventListener("click", ()=> {
    isFocused = false;
    console.log(isFocused);
});

tapsInput.addEventListener("click", ()=> {
    isFocused = false;
});

timeInput.addEventListener("keydown", (e) => {
    checkIncomingInput(e);
});

tapsInput.addEventListener("keydown", (e) => {
    checkIncomingInput(e);
});