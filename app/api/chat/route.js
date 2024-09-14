import { initializeGenAI, getChatbotResponse } from '../../lib/gemini';

export const runtime = 'edge';

export async function POST(req) {
  const { message, userInfo } = await req.json();

  try {
    initializeGenAI();
    const response = await getChatbotResponse(message, userInfo);

    return new Response(JSON.stringify({ message: response }), {
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