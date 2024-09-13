// utils/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const mySecret = process.env['GEMINI_API_KEY']
const genAI = new GoogleGenerativeAI(mySecret);

export async function getChatbotResponse(message, userInfo) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a student support chatbot. The user is in the ${userInfo.ageRange} age range, 
  at the ${userInfo.educationLevel} education level, and in grade ${userInfo.grade}. 
  Please provide an appropriate response to their message: "${message}"`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
