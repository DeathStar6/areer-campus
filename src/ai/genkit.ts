import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if API key is available
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables.');
  console.warn('   Please create a .env.local file with your Gemini API key:');
  console.warn('   GEMINI_API_KEY=your_api_key_here');
  console.warn('   Get your API key from: https://makersuite.google.com/app/apikey');
}

export const ai = genkit({
  plugins: [googleAI({apiKey: apiKey || 'dummy-key'})],
  model: 'googleai/gemini-2.0-flash',
});

// Export API key status for debugging
export const isApiKeyConfigured = !!apiKey;
