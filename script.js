const totalClicks = document.querySelector("#total-clicks");
const bpmElement = document.querySelector("#BPM");
const cpsElement = document.querySelector("#CPS");

var clicks = 0;
var BPM = 0;
var CPS = 0.0;

var key1Flag = false;
var key2Flag = false;
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
    totalClicks.textContent = clicks;
    bpmElement.textContent = 0;
    cpsElement.textContent = 0;
}

function calculateBPM() {
    var factor = (timeElapsed/timeFactor) / 60;
    var BPM = clicks / (factor * 4);
    bpmElement.textContent = BPM.toFixed(2);
}

function getArrayAverage(arr) {
    if (intervals.length >= 1) {
        var sum = getArraySum(arr);
        var average = sum/intervals.length;
        return average;
    }
    return 0;
}

function getArraySum(arr) {
    var sum = 0.0;
    if (intervals.length >= 1) {
        for (var i = 0; i < intervals.length; i++) {
            sum += intervals[i];
        }
    }
    return sum;
}

function calculateCPS() {
    CPS = clicks/(timeElapsed/timeFactor);
    cpsElement.textContent = CPS.toFixed(2);
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
    if (e.key == 'z' && !key1Flag && !stopped) {
        key1Flag = true;
        keyTap();
    }
    if (e.key == 'x' && !key2Flag && !stopped) {
        key2Flag = true;
        keyTap();
    }
    if (e.key == 'r') {
        reset();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key == 'z') {
        key1Flag = false;
    }
    if (e.key == 'x') {
        key2Flag = false;
    }
});