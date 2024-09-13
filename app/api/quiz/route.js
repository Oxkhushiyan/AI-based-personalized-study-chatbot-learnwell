import { GoogleGenerativeAI } from '@google/generative-ai';

const mySecret = process.env['GEMINI_API_KEY'];
const genAI = new GoogleGenerativeAI(mySecret);

export async function POST(req) {
  try {
    const { topic, userInfo } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a quiz on the topic "${topic}" for a student in the ${userInfo.ageRange} age range, 
    at the ${userInfo.educationLevel} education level, and in grade ${userInfo.grade}. 
    Create 10 single choice questions. For each question, provide 4 answer choices, the correct answer, and a brief explanation.
    Format the response as a JSON array of objects, where each object represents a question and has the following structure:
    {
      "question": "The question text",
      "answers": ["Answer A", "Answer B", "Answer C", "Answer D"],
      "correctAnswer": 0, // Index of the correct answer (0-3)
      "explanation": "Brief explanation of the correct answer"
    }
    Ensure the questions are appropriate for the user's education level and age range. Do not include any additional text or formatting outside of the JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Raw API response:", text); // Log the raw response for debugging

    // Attempt to clean and parse the response
    let questions;
    try {
      // Remove any potential markdown formatting and find the JSON array
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON array found in the response');
      }

      // Validate the structure of the parsed data
      if (!Array.isArray(questions) || questions.length === 0 || !questions.every(isValidQuestionObject)) {
        throw new Error('Invalid quiz data structure');
      }
    } catch (error) {
      console.error('Error parsing or validating quiz data:', error);
      return new Response(JSON.stringify({ error: 'Invalid quiz data received' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate quiz' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function isValidQuestionObject(obj) {
  return (
    typeof obj === 'object' &&
    typeof obj.question === 'string' &&
    Array.isArray(obj.answers) &&
    obj.answers.length === 4 &&
    typeof obj.correctAnswer === 'number' &&
    obj.correctAnswer >= 0 &&
    obj.correctAnswer <= 3 &&
    typeof obj.explanation === 'string'
  );
}