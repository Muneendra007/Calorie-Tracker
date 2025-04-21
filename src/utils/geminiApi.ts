
const GEMINI_API_KEY = "AIzaSyAhr8RRwPKbuZvSCeaVWcv1tR0-Ghh0ZCQ";

/**
 * Fetch a response from the Gemini generative AI model.
 * @param {string} prompt - The prompt/message to send to Gemini.
 * @returns {Promise<string>} The generated content from Gemini.
 */
export async function fetchGeminiResponse(prompt: string): Promise<string> {
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  const body = {
    contents: [
      { parts: [ { text: prompt } ] }
    ]
  };
  const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (
    data &&
    data.candidates &&
    data.candidates.length > 0 &&
    data.candidates[0].content &&
    data.candidates[0].content.parts &&
    data.candidates[0].content.parts.length > 0
  ) {
    return data.candidates[0].content.parts[0].text as string;
  } else {
    throw new Error("No response from Gemini API.");
  }
}
