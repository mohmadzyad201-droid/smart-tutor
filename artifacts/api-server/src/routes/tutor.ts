import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import OpenAI from "openai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const LANGUAGE_NAMES: Record<string, string> = {
  ar: "Arabic",
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  tr: "Turkish",
  ru: "Russian",
  zh: "Simplified Chinese",
  ja: "Japanese",
  ko: "Korean",
  he: "Hebrew",
  pt: "Portuguese",
  it: "Italian",
};

const SUPPORTED_GRADES = new Set(["11", "12"]);
const MAX_MESSAGE_LENGTH = 6_000;
const MAX_HISTORY_ITEMS = 12;

type TutorHistoryItem = {
  role?: unknown;
  content?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

router.post("/tutor/chat", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = isRecord(req.body) ? req.body : {};
  const language = typeof body.language === "string" ? body.language : "";
  const grade = typeof body.grade === "string" ? body.grade : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!LANGUAGE_NAMES[language]) {
    res.status(400).json({ error: "Unsupported language" });
    return;
  }
  if (!SUPPORTED_GRADES.has(grade)) {
    res.status(400).json({ error: "Unsupported grade" });
    return;
  }
  if (!message) {
    res.status(400).json({ error: "A question is required" });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: "The question is too long" });
    return;
  }

  const history = Array.isArray(body.history)
    ? (body.history as TutorHistoryItem[])
        .filter(
          (item) =>
            isRecord(item) &&
            (item.role === "user" || item.role === "assistant") &&
            typeof item.content === "string" &&
            item.content.trim().length > 0,
        )
        .slice(-MAX_HISTORY_ITEMS)
        .map((item) => ({
          role: item.role as "user" | "assistant",
          content: String(item.content).slice(0, MAX_MESSAGE_LENGTH),
        }))
    : [];

  const attachmentContext = Array.isArray(body.attachments)
    ? body.attachments
        .filter(isRecord)
        .map((attachment) => {
          const name = typeof attachment.name === "string" ? attachment.name : "unnamed file";
          const type = typeof attachment.type === "string" ? attachment.type : "unknown type";
          return `${name} (${type})`;
        })
        .slice(0, 10)
    : [];

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logger.error("OPENAI_API_KEY is not configured");
    res.status(503).json({ error: "AI service is not configured" });
    return;
  }

  const openai = new OpenAI({ apiKey, timeout: 45_000 });
  const languageName = LANGUAGE_NAMES[language];
  const attachmentNote = attachmentContext.length > 0
    ? `\nThe student attached these files, but their binary contents are not available to you in this request: ${attachmentContext.join(", ")}. Never claim that you read or analyzed their contents.`
    : "";

  const messages = [
    {
      role: "system" as const,
      content: [
        "You are Smart Tutor, a patient and accurate secondary-school science tutor.",
        `The student is in grade ${grade}.`,
        `Answer entirely in ${languageName}, using clear language appropriate for this grade.`,
        "Explain the reasoning step by step when useful, define unfamiliar terms, and do not invent facts.",
        "If the question is ambiguous, ask one concise clarifying question.",
        attachmentNote,
      ].join(" "),
    },
    ...history,
    { role: "user" as const, content: message },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.6-terra",
      max_completion_tokens: 8192,
      messages,
    });
    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      res.status(502).json({ error: "The AI returned an empty answer" });
      return;
    }
    res.json({ reply });
  } catch (error) {
    logger.error(
      {
        userId,
        error: error instanceof Error ? error.message : String(error),
      },
      "OpenAI tutor request failed",
    );
    res.status(502).json({ error: "The AI service could not answer right now" });
  }
});

export default router;