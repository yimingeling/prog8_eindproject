import { AzureChatOpenAI } from "@langchain/openai"

import express from "express";
import cors from "cors";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { VectorStore } from "@langchain/core/vectorstores";

const app = express()
app.use(cors())

const model = new AzureChatOpenAI({ temperature: 1 });



async function createJoke() {
    const result = await model.invoke("tell me a joke")
    return result.content
}
async function sendPrompt(prompt) {
    const result = await model.invoke(prompt)
    return result.content
}



app.get('/', async (req, res) => {
    const result = await tellJoke()
    res.json({ message: result })
})

async function tellJoke() {
    const joke = await model.invoke("Tell me a Javascript joke!")
    return joke.content
}

app.post("/ask", async (req, res) => {
    let prompt = req.body.promt
    let result = await sendPrompt(prompt)
    console.log("the user asked for " + prompt)
    console.log(prompt)
    console.log(result)
    res.json({ message: result })
})




app.listen(3000, () => console.log("server op poort 3000"))