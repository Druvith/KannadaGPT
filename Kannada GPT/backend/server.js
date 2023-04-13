const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/api/test", (req, res) => {
  res.send("Backend is working!");
});


app.post("/api/generate", async (req, res) => {
  const { prompt, language } = req.body;
  console.log("Received prompt:", prompt, "Language:", language);

  try {
    let kannadaPrompt = prompt;

    if (language === "en") {
      kannadaPrompt = await translate(prompt, "en", "kn");
      console.log("Translated prompt:", kannadaPrompt);
    }

    const chatGPTResponse = await generateWithChatGPT(kannadaPrompt);
    console.log("ChatGPT response:", chatGPTResponse);

    const kannadaResponse = await translate(chatGPTResponse, "en", "kn");
    console.log("Final response:", kannadaResponse);

    res.json({ response: kannadaResponse });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});


async function translate(text, sourceLang, targetLang) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
  const data = {
    q: text,
    source: sourceLang,
    target: targetLang,
    format: "text",
  };

  const response = await axios.post(url, data);
  return response.data.data.translations[0].translatedText;
}

async function generateWithChatGPT(prompt) {
  const url = "https://api.openai.com/v1/engines/davinci-codex/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.CHATGPT_API_KEY}`,
  };
  const data = {
    prompt: prompt,
    max_tokens: 50,
  };

  const response = await axios.post(url, data, { headers });
  return response.data.choices[0].text;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
