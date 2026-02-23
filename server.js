import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
const app = express();
app.use(cors({
  origin: "https://remist.net"  // Hostinger main site
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "routine.html"));
});

const HF_API_KEY = process.env.HF_API_KEY;

app.post("/suggest", async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ error: "No goal provided" });

    const body = {
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        { 
          role: "user", 
          content: `Write 5 short, daily business tasks for ${goal}. 
        Put **each task on its own line**, start with a number and a dot, 
        and make sure there are actual line breaks between items. No extra text.`
        },
      ],
    };

    const hfResponse = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const json = await hfResponse.json();

    if (!json.choices || !json.choices[0]?.message?.content) {
      return res.status(500).json({ error: "No suggestion generated" });
    }

    const rawText = json.choices[0].message.content;
    const lines = rawText.split(/(?=\d+\.)/).map(line => line.trim()).filter(line => line);

    res.json({ suggestion: lines });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

app.listen(3000, () => console.log("🤖 AI backend running"));



