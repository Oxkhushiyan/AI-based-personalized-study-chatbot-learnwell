import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;

export function initializeGenAI() {
  const mySecret = process.env.GEMINI_API_KEY;
  genAI = new GoogleGenerativeAI(mySecret);
}

export async function getChatbotResponse(message, userInfo) {
  if (!genAI) {
    initializeGenAI();
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a student support chatbot. The user is in the ${userInfo.ageRange} age range, 
  at the ${userInfo.educationLevel} education level, and in grade ${userInfo.grade}. 
  Please provide an appropriate response to their message: "${message}"
  Format your response using the following rules:
  1. Use HTML tags to structure the content.
  2. Keep information short and to the point.
  3. Organize key points in a <div> with class "bg-gray-100 p-3 rounded-lg my-2".
  4. Highlight important information using <strong> tags.
  5. Use <h3> tags for subtitles if needed.
  6. Keep the overall response brief and easy to read.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "I'm sorry, but I couldn't generate a response. Please try asking your question again.";
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I encountered an error while processing your request. Please try again later.";
  }
}
