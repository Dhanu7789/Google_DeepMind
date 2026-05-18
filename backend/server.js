import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {

  try {

    const { prompt } = req.body;

    const completion =
      await openai.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content: `
You are a professional web developer AI.

Return output STRICTLY in this format:

HTML:
...html code here...

CSS:
...css code here...

JS:
...javascript code here...

Rules:
- Do NOT mix code sections
- Do NOT add explanations
- Always follow exact format
`
          },

          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const result =
      completion.choices[0].message.content;

    res.json({
      success: true,
      result,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error generating code",
    });

  }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});