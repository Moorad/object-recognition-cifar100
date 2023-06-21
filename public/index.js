// startAnimation();
const statusContainer = document.querySelector(".status-container");
const statusTitle = document.querySelector(".status-title");
const statusDescription = document.querySelector(".status-description");

function displayStatus(title, description) {
    statusContainer.classList.remove("hidden");
    statusTitle.innerText = title;
    statusDescription.innerText = description;
    statusContainer.classList.remove("entrance-animation");
    statusContainer.offsetWidth; // To trigger the animation properly
    statusContainer.classList.add("entrance-animation");
}

function hideStatus() {
    statusContainer.classList.add("hidden");
}

function connectToAPI() {}

displayStatus("Checking...", "Attempting to connect to server");

setTimeout(() => {
    displayStatus("Training...", "No saved model found, retraining model");
}, 2000);
