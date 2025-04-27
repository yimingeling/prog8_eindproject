const responseBox = document.getElementById("response");



document.getElementById("sendButton").addEventListener("click", async () => {


    const message = document.getElementById("message").value;
    if (!message) {
        alert("Please enter a message!");
        return;
    }

    buttonSend(); // This should just show "loading..." and disable buttons

    try {
        const response = await fetch("http://localhost:3000/ask", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: message }),  // Now message exists!
        });

        const data = await response.json();
        responseBox.textContent = data.message;
    } catch (error) {
        responseBox.textContent = "Error: Unable to fetch response. :(";
        console.error(error);
    } finally {
        sendButton.disabled = false;
        sendButtonEmbed.disabled = false;
    }
});

document.getElementById('sendButtonEmbed').addEventListener("click", async () => {
    const message = document.getElementById("message").value;
    if (!message) {
        alert("Please enter a message!");
        return;
    }

    buttonSend();

    try {
        const response = await fetch("http://localhost:3000/askEmbed", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: message }),
        });

        const data = await response.json();
        responseBox.textContent = data.message;
    } catch (error) {
        responseBox.textContent = "Error: Unable to fetch response. :(";
        console.error(error);
    } finally {
        sendButton.disabled = false;
        sendButtonEmbed.disabled = false;
    }
});


function buttonSend() {
    responseBox.textContent = "Loading...";
    const sendButton = document.getElementById('sendButton');
    const sendButtonEmbed = document.getElementById('sendButtonEmbed');
    sendButton.disabled = true;
    sendButtonEmbed.disabled = true;
}
