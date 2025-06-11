const mainBox = document.querySelector("#main-box")
var clicks = 0

document.body.addEventListener("keypress", (e)=> {
    if (e.key == 'z' || e.key == 'x') {
        clicks += 1
        mainBox.textContent = clicks
    }
});
