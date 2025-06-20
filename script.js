const totalClicks = document.querySelector("#total-clicks");
const bpmElement = document.querySelector("#BPM");
const cpsElement = document.querySelector("#CPS");

var clicks = 0;
var BPM = 0;
var CPS = 0.0;
var key1Flag = false;
var key2Flag = false;

function reset() {
    key1Flag = false;
    key2Flag = false;
    clicks = 0;
    totalClicks.textContent = clicks;
}

function calculateBPM() {

}

document.addEventListener("keydown", (e)=> {
    if (e.key == 'z' && !key1Flag) {
        key1Flag = true;
        clicks += 1;
        totalClicks.textContent = clicks;
    }
    if (e.key == 'x' && !key2Flag) {
        key2Flag = true;
        clicks += 1;
        totalClicks.textContent = clicks;
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