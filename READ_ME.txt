# Project: Server and Client for Document Search & Chat

This project consists of two parts:
1. **Server**: A Node.js server that interacts with Azure OpenAI services to handle document processing, embeddings, and answering questions based on both static data and chat-style prompts.
2. **Client**: A simple frontend (HTML + JavaScript) to interact with the server by submitting prompts and displaying responses.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setting up the Server](#setting-up-the-server)
3. [Setting up the Client](#setting-up-the-client)
4. [Running the Server and Client](#running-the-server-and-client)
5. [Environment Variables](#environment-variables)
6. [Folder Structure](#folder-structure)

---

## Prerequisites

- **Node.js**: Ensure you have [Node.js](https://nodejs.org/en/) installed (v14.x or higher).
- **Azure OpenAI API Key**: You need to have access to the Azure OpenAI service. Set up your Azure account and get the necessary API keys for both **Azure Chat GPT** and **Azure Embedding**.

---

## Setting up the Server

### 1. Clone the repository:

```bash
git clone https://github.com/your-repository-name.git
cd your-repository-name

2. Install dependencies:
bash
Copy
Edit
npm install
3. Set up environment variables:
Create a .env file in the root directory of the project and add the following environment variables:

bash
Copy
Edit
AZURE_OPENAI_API_KEY=<your-openai-api-key>
AZURE_OPENAI_API_ENDPOINT=<your-openai-api-endpoint>
AZURE_EMBEDDING_DEPLOYMENT_NAME=<your-embedding-deployment-name>
Note: Replace the placeholder values with your actual Azure OpenAI API credentials.

4. Start the server:
bash
Copy
Edit
npm start
The server should now be running at http://localhost:3000.

Setting up the Client
1. Create the Client Files:
Inside the public/ folder (or another directory of your choice), create the following files:

index.html: A simple HTML page to interact with the server.

client.js: JavaScript file to send requests to the backend and display responses.

Example index.html:
html
Copy
Edit
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Chat</title>
</head>
<body>
    <h1>Chat with the Document!</h1>

    <label for="message">Enter a prompt:</label>
    <input type="text" id="message" />
    <button id="sendButton">Send Prompt</button>
    <button id="sendButtonEmbed">Ask with Embedding</button>

    <div id="response">Response will appear here.</div>

    <script src="client.js"></script>
</body>
</html>
Example client.js:
javascript
Copy
Edit
const responseBox = document.getElementById("response");
const sendButton = document.getElementById("sendButton");
const sendButtonEmbed = document.getElementById('sendButtonEmbed');

document.getElementById("sendButton").addEventListener("click", async () => {
    buttonSend();
    try {
        const response = await fetch("http://localhost:3000/ask", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: document.getElementById("message").value }),
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
    buttonSend();
    try {
        const response = await fetch("http://localhost:3000/askEmbed", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: document.getElementById("message").value }),
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
    const message = document.getElementById("message").value;
    if (!message) {
        alert("Please enter a message!");
        return;
    }

    responseBox.textContent = "Loading...";
    sendButton.disabled = true;
    sendButtonEmbed.disabled = true;
}
Running the Server and Client
1. Start the server (if not already running):
In the project root directory:

bash
Copy
Edit
npm start
The server will be running at http://localhost:3000.

2. Open the client:
Open index.html in a web browser. The client should now be able to communicate with the backend server.

Environment Variables
You need the following environment variables for the server to function:

AZURE_OPENAI_API_KEY: Your API key for Azure OpenAI services.

AZURE_OPENAI_API_ENDPOINT: The endpoint URL for your Azure OpenAI service.

AZURE_EMBEDDING_DEPLOYMENT_NAME: The name of the embedding model deployment in your Azure account.

Folder Structure
Here's a general folder structure for your project:

bash
Copy
Edit
/project-root
  /public
    index.html          # Client HTML file
    client.js           # Client JavaScript
  /node_modules
  /server
    server.js           # Server entry point
  .env                  # Environment variables
  package.json          # Project metadata
  README.md             # Project documentation
Troubleshooting
Error: prompt.content is undefined
This error may occur if you're sending a non-string value in your request. Ensure that the frontend is sending a string to the backend (use JSON.stringify() properly).

Error: Cannot read properties of undefined (reading 'replace')
This error usually happens when you're trying to process undefined values. Verify that your prompt is not empty or undefined before passing it to the vector search.

CORS Issues
If you encounter CORS errors, ensure that you have configured CORS in your backend correctly, as demonstrated in the server setup.


