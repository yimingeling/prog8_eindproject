import {AzureChatOpenAI, AzureOpenAIEmbeddings} from "@langchain/openai";

import express, {response} from "express";
import cors from "cors";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {FaissStore} from "@langchain/community/vectorstores/faiss";


const app = express()
app.use(cors())
app.use(express.json());


const model = new AzureChatOpenAI({temperature: 1});
const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});
let vectorStore



async function loadManifesto() {
    const loader = new TextLoader("./public/manifesto.txt");
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000, chunkOverlap: 200});
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(`created ${splitDocs.length} text chunks`)
    vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
    await vectorStore.save("manifestoDatabase"); // geef hier de naam van de directory waar je de data gaat opslaan
    console.log('vector store created')
}
await loadManifesto()



app.post("/askEmbed", async (req, res) => {
    let prompt = req.body.prompt

    let response = await sendPromptEmbed(prompt)

    console.log("the user asked for " + prompt)
    console.log(response)

    res.json({message: response})
})


async function sendPromptEmbed(prompt) {
    if (typeof prompt !== "string") {
        throw new Error("Prompt must be a string!");
    }

    if (!vectorStore) {
        vectorStore = await FaissStore.load("manifestoDatabase", embeddings);
    }
    const relevantDocs = await vectorStore.similaritySearch(prompt, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");
    const response = await model.invoke([
        { role: "system", content: "Use the following context to answer the user's question. Only use information from the context." },
        { role: "user", content: `Context: ${context}\n\nQuestion: ${prompt}` }
    ]);
    console.log("\nAnswer found:");
    console.log(response.content);

    return response.content;
}




const messages = [
    ['system', "You are marxist intellectual. Seek to educate me, a unaware member of the proletariat, who does not yet grasp the hardship that the ruling class has subjected me to. "],
]
app.post("/ask", async (req, res) => {
    let prompt = req.body.prompt
    messages.push(
        ['human', `Reply to my prompt as short as you can: ${prompt}`]
    )
    let response = await sendPrompt(messages)

    console.log("the user asked for " + prompt)
    console.log(messages)
    console.log(response)

    res.json({message: response})
})

async function sendPrompt(prompt) {
    const response = await model.invoke(prompt)
    messages.push(
        ['ai', response.content]
    )
    return response.content

}



app.listen(3000, () => console.log("server op poort 3000"))