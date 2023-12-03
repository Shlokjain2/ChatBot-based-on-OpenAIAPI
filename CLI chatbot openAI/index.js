import { error } from "console";
import { Configuration,  OpenAIApi } from "openai";
import readline from 'readline';

const Config = new Configuration({
    organization: "org-Ef36CYnLzWTxXThwTgHu43fv",
    apiKey: "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"
});

const openai= new OpenAIApi(Config);

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

userInterface.prompt();
userInterface.on("line", async (input) => {
    await openai
    .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: input}]
    }).then((result) => {
        console.log(result.data.choices[0].message.content);
        userInterface.prompt();
    }).catch(error => console.log(error)); 
});