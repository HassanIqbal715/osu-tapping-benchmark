const totalClicks = document.querySelector("#total-clicks");
const bpmElement = document.querySelector("#BPM");
const cpsElement = document.querySelector("#CPS");
const urElement = document.querySelector("#UR");
const key1Button = document.querySelector("#key-1");
const key2Button = document.querySelector("#key-2");
const keySetPrompt = document.querySelector("#key-set-prompt");
var clicks = 0;

var BPM = 0;
var CPS = 0.0;
var UR = 0.0;

var key1 = 'z';
var key2 = 'x';
var key1Flag = false;
var key2Flag = false;

var isFocused = true;
var stopped = false;
var started = false;

var timeFactor = 5;
var timeElapsed = 0.0;
var targetTime = 5 * timeFactor;
var timer;
var lastTime = null;
var intervals = [];

function reset() {
    key1Flag = false;
    key2Flag = false;
    stopped = false;
    started = false;
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
    var newArr = intervals.slice(2);
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
    if (timeElapsed == targetTime - 1) {
        clearInterval(timer);
        console.log(intervals);
        var avg = getArrayAverage(intervals);
        console.log(avg);
        stopped = true;
    }
    timeElapsed += 1;
    calculateUR();
    calculateBPM();
    calculateCPS();
}

function keyTap() {
    clicks += 1;
    totalClicks.textContent = clicks;
    const currentTime = performance.now();
    if (lastTime !== null) {
        var intr = (currentTime - lastTime)/1000;
        intervals.push(intr);
    }
    lastTime = currentTime;
    if (!started) {
        started = true;    
        timer = setInterval(countTime, 200);
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
    if (e.key == 'r') {
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
    if (!keySetPrompt.contains(e.target) && e.target !== key2Button) {
        keySetPrompt.style.display = 'none';
    }
});

key1Button.addEventListener("click", (e) => {
    keySetPrompt.style.display = 'block';
    isFocused = false;
    e.stopPropagation();
});

key2Button.addEventListener("click", (e) => {
    keySetPrompt.style.display = 'block';
    isFocused = false;
    e.stopPropagation();
});

key1Button.addEventListener("keyup", (e) => {
    if (document.activeElement === key1Button) {
        if (key2 == e.key) {
            isFocused = false;
            return;
        }
        if (e.key >= 'a' && e.key <= 'z') {
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
        if (key1 == e.key) {
            isFocused = false;
            return;
        }
        if (e.key >= 'a' && e.key <= 'z') {
            key2Button.blur();
            key2 = e.key;
            key2Button.textContent = key2.toUpperCase();
            isFocused = true;
            keySetPrompt.style.display = 'none';
        }
    }
});