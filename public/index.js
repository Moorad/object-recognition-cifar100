const SERVER_URL = "http://127.0.0.1:5000";
const loadingContainer = document.querySelector(".loading-container");
const statusContainer = document.querySelector(".status-container");
const statusTitle = document.querySelector(".status-title");
const statusDescription = document.querySelector(".status-description");
const canvasBG = document.querySelector(".gol-background");

const readyContainer = document.querySelector(".ready-container");
function complete(response) {
    displayStatus("Ready", "Everything is good to go");
    canvasBG.classList.add("fade-animation");
    startAnimation();

    setTimeout(() => {
        loadingContainer.classList.add("hidden");
        readyContainer.classList.remove("hidden");
        readyContainer.classList.add("entrance-animation");

        document.querySelector("#model-accuracy").innerText =
            response.model_accuracy * 100 + "%";
    }, 2000);
}

function failed() {
    displayStatus("Failed", "Something went wrong, try again later", true);
}

function displayStatus(title, description, failure = false) {
    statusContainer.classList.remove("hidden");
    statusTitle.innerText = title;
    statusDescription.innerText = description;

    if (failure) {
        statusTitle.classList.add("failed");
    }
    statusContainer.classList.remove("entrance-animation");
    statusContainer.offsetWidth; // To trigger the animation properly
    statusContainer.classList.add("entrance-animation");
}

function hideStatus() {
    statusContainer.classList.add("hidden");
}

function requestStatus() {
    return new Promise((resolve, reject) => {
        fetch(`${SERVER_URL}/status`)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                resolve(json);
            })
            .catch((e) => {
                reject(e);
            });
    });
}

async function checkServer() {
    try {
        displayStatus("Checking...", "Attempting to connect to server");
        const statusRes = await requestStatus();
        if (!statusRes.done_training) {
            displayStatus(
                "Training...",
                "No saved model found, retraining model"
            );
            const trainingInterval = setInterval(async () => {
                const statusRes = await requestStatus();
                if (statusRes.done_training) {
                    clearInterval(trainingInterval);
                    complete(statusRes);
                }
            }, 3000);
        } else {
            complete(statusRes);
        }
    } catch (e) {
        console.error(e);
        failed();
    }
}

checkServer();
