// Show user info
function infoOn() {
    if (document.querySelector(".main--info")) {
        if (
            document.querySelector(".main--info").classList.contains("d-none")
        ) {
            document.querySelector(".main--info").classList.toggle("d-none");
        }
    }
}

// Hide user info
function infoOff() {
    if (document.querySelector(".main--info")) {
        if (
            !document.querySelector(".main--info").classList.contains("d-none")
        ) {
            document.querySelector(".main--info").classList.toggle("d-none");
        }
    }
}

// Display info in DOM
function infoGenerator(info) {
    document.querySelector(".main--info").innerText = info;
    infoOn();
}
