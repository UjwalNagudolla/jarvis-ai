require("dotenv").config();
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/api/command", async (req, res) => {
    const command = req.body.command;

    console.log("Command received:", command);

    let reply;
let url = null;

    if (command === "hello" || command === "hi") {
        reply = "Hello. Systems are online.";
    }

    else if (command.includes("open youtube")) {
    reply = "Opening YouTube.";
    url = "https://www.youtube.com";
}
    
    else if (command.includes("open instagram")) {
    reply = "Opening Instagram.";
    url = "https://www.instagram.com";
}
    
    else if (command.includes("who are you")) {
        reply = "I am JARVIS, your personal AI assistant.";
    }

    else if (
    command.includes("what is the time?") ||
    command.includes("current time ")
) {
    new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit"
})
    })}.`;
}
    else if (command.includes("what is today's date?") || command.includes("today's date")) {
        const date = new Date();
        const day = date.getDate();
        const month = date.toLocaleString("en-IN", { month: "long" });

        reply = `Today is ${day}${day === 1 || day === 21 || day === 31 ? "st" :
            day === 2 || day === 22 ? "nd" :
            day === 3 || day === 23 ? "rd" : "th"} ${month}.`;
    }

    else {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `You are JARVIS. Answer briefly and naturally in plain text. No markdown, no bullets, no headings. Usually 1 to 3 sentences unless the user asks for detail.

User command: ${command}`
        });
	
        reply = response.text
            .replace(/[*#_`]/g, "")
            .replace(/\n+/g, " ")
            .trim();

    } catch (error) {
        console.error("Gemini Error:", error);
        reply = "I'm having trouble reaching my Core right now, Please try again.";
    }
}
res.json({
    reply: reply,
    url: url || null
});

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`JARVIS is running on port ${PORT}`);
});