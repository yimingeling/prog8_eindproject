document.getElementById("sendButton").addEventListener("click", async () => {
    const message = document.getElementById("message").value;
    if (!message) {
        alert("Please enter a message!");
        return;
    }

    const responseBox = document.getElementById("response");
    responseBox.textContent = "Loading...";

    try {
        const response = await fetch("http://localhost:3000/ask", {
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
    }
});