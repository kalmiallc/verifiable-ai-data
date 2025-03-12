/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import express from 'express';
import { env } from './lib/env';
import { CollectionName } from './lib/vector-db/types';
import { VectorDb } from './lib/vector-db/vector-db';
import { getEmbedding } from './lib/google-ai';
import { generateHash, isUUID } from './lib/vector-db/utils';

const MAX_QUESTION_LEN = 500;
const MAX_DOCUMENTS_LIMIT = 25;
const MAX_QUESTIONS_LIMIT = 5;
const UNKNOWN_SOURCE = 'UNKNOWN';
const UNKNOWN_ANSWER = 'I am sorry, I do not know the answer to this question.';

const app = express();
const port = env.API_PORT;

app.use(express.json());

console.log(env.GOOGLE_CLOUD_API_KEY);

const client = new GoogleGenerativeAI(env.GOOGLE_CLOUD_API_KEY);

/**
 * Verify route.
 */
app.post('/api/verify', async (req, res) => {
  const id = req.body.id;
  const txHash = req.body.txHash;

  if (!id || !txHash) {
    res.status(422);
    res.json({ error: 'Invalid data, `id` or `txHash` is missing.' });
    return;
  }

  try {
    const doc = await VectorDb.getById(id);
    const question = doc.properties;
    if (question.verified && question.txHash) {
      res.status(400);
      res.json({ error: 'Answer is already verified.' });
      return;
    }

    await VectorDb.verifyQuestion(id, txHash);
    question.verified = true;
    question.txHash = txHash;

    res.json(doc.properties);
  } catch (error) {
    res.status(500);
    res.json({ error: 'Error while verifying question.' });
    return;
  }
});

/**
 * Chat route.
 */
app.post('/api/chat', async (req, res) => {
  // Request validation.
  const question = req.body.question;
  if (!question) {
    res.status(422);
    res.json({ error: 'Invalid data, `question` is missing.' });
    return;
  }

  if (question.length > MAX_QUESTION_LEN) {
    res.status(422);
    res.json({
      error: `Invalid data, question max length is ${MAX_QUESTION_LEN} characters.`,
    });
    return;
  }

  try {
    const embedding = await getEmbedding(question);

    // Obtain relevant document content.
    const docs = await VectorDb.query(
      CollectionName.DOCUMENTS,
      embedding,
      MAX_DOCUMENTS_LIMIT,
    );

    // Obtain relevant questions that are already verified.
    const questions = await VectorDb.getVerifiedAnswers(
      embedding,
      MAX_QUESTIONS_LIMIT,
    );

    // Parse knowledge into more structured format.
    const knowledge = docs.map(
      (c: any) =>
        `\n [ CONTENT: "${c.properties.content}"\nSOURCE: "${c.properties.source}" ]`,
    );

    // Parse verified questions into more structured format.
    const verifiedAnswers = questions.map(
      (q: any) =>
        `\n [ CONTENT: "${q.properties.answer}"\nSOURCE: "${q.uuid}" ]`,
    );

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        answer: {
          type: SchemaType.STRING,
          description: 'Answer to the user question.',
          nullable: false,
        },
        source: {
          type: SchemaType.STRING,
          description: 'Source of the answer.',
          nullable: false,
        },
      },
      required: ['answer', 'source'],
    };

    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema as any,
      },
      systemInstruction: `
        You will be answering user's question. Answer the question as truthfully as possible using given KNOWLEDGE and if answer is not present say that you don't know it. 
        If the answer is already a part of VERIFIED ANSWERS and is contextually correct for the given question return AS IT IS (DO NOT CHANGE IT) it, and do not answer the question yourself.
        Provide sources with your answer and if the source is unknown to you us this constant: ${UNKNOWN_SOURCE}.

        ##################################################################################
        VERIFIED ANSWERS: ${verifiedAnswers}
    
        ##################################################################################
        KNOWLEDGE: ${knowledge}
      `,
    });

    console.log(model.systemInstruction);

    const result = await model.generateContent(question);
    const responseObject: any = JSON.parse(result.response.text());

    // If we decide to only answer knowledge sourced questions we can filter them.
    if (responseObject.source === UNKNOWN_SOURCE) {
      responseObject.answer = UNKNOWN_ANSWER;
    }

    if (isUUID(responseObject.source)) {
      responseObject.verified = true;
      try {
        const obj = await VectorDb.getById(responseObject.source);
        responseObject.txHash = obj.properties.txHash;
        responseObject.hash = obj.properties.hash;
        responseObject.id = responseObject.source;
      } catch (error) {
        console.log('Error while getting question: ', error);
      }
    } else {
      try {
        const id = await VectorDb.saveQuestion(
          question,
          responseObject.answer,
          responseObject.source,
          embedding,
        );

        responseObject.id = id;
        responseObject.hash = generateHash(responseObject.answer, id);
        console.log('Question saved..');
      } catch (error) {
        console.log('Error while saving question: ', error);
      }
    }

    res.json(responseObject);
  } catch (error) {
    console.log(error);

    // Handle an error in user friendly way.
    res.json({
      answer:
        'I am sorry I cannot answer your question right now. Please try again.',
      source: UNKNOWN_SOURCE,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
