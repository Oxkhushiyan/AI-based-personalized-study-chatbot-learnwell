import { GoogleGenerativeAI } from '@google/generative-ai';
const mySecret = process.env['GEMINI_API_KEY']
const genAI = new GoogleGenerativeAI(mySecret);

export async function POST(req) {
  const { message, userInfo } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a student support chatbot. The user is in the ${userInfo.ageRange} age range, 
    at the ${userInfo.educationLevel} education level, and in grade ${userInfo.grade}. 
    Please provide a concise and organized response to their message: "${message}"

    Format your response using the following rules:
    1. Use HTML tags to structure the content.
    2. Keep information short and to the point.
    3. Organize key points in a <div> with class "bg-gray-100 p-3 rounded-lg my-2".
    4. Highlight important information using <strong> tags.
    5. Use <h3> tags for subtitles if needed.
    6. Keep the overall response brief and easy to read.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ message: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process the request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}