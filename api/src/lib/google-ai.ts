import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env';

export async function getEmbedding(text: string) {
  const genAI = new GoogleGenerativeAI(env.GOOGLE_CLOUD_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  const result = await model.embedContent(text);
  return result.embedding.values;
}
