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

var timeElapsed = 0;
var targetTime = 5;
var timer;
var lastTime = null;

function reset() {
    key1Flag = false;
    key2Flag = false;
    stopped = false;
    started = false;
    timeElapsed = 0;
    clicks = 0;
    totalClicks.textContent = clicks;
}

function calculateBPM() {

}

function calculateCPS() {
    CPS = clicks/timeElapsed;
    console.log(CPS);
}

function countTime() {
    if (timeElapsed < targetTime - 1) {
        timeElapsed += 1;
        console.log(timeElapsed);
    }
    else {
        clearInterval(timer);
        console.log("Cleared");
        calculateCPS();
        stopped = true;
    }
}

function keyTap() {
    clicks += 1;
    totalClicks.textContent = clicks;
    const currentTime = performance.now();
    if (lastTime !== null) {
        var intr = (currentTime - lastTime)/1000;
        console.log(intr);
    }
    lastTime = currentTime;
    if (!started) {
        started = true;    
        timer = setInterval(countTime, 1000);
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