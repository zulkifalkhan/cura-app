// agents/generalAgent.ts
import axios from "axios";

export const generalAgent = async (city: string, query: string, OPENAI_API_KEY: string) => {
  const systemPrompt = `
You are a professional and friendly AI health assistant. The user is located in ${city}. 

Your job is to classify their health symptoms into one of three categories:

1. Emergency – Advise them to visit a hospital immediately.
   - Provide 2–3 nearby hospitals in ${city}.
   - Include for each hospital:
     - Name
     - Address
     - If available: Contact or email
     - Use a clear format starting with: ## Hospital:
     - DO NOT include hospitals inside the main advice text, only return them after the advice section.

2. Moderate – Suggest monitoring symptoms and visiting a doctor soon.
3. Normal – Reassure the user and offer basic health advice.

Important:
- NEVER refuse to answer.
- ALWAYS end with this exact format (on a new line): Classification: Emergency / Moderate / Normal
- NEVER include hospital information unless classification is Emergency.
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};
