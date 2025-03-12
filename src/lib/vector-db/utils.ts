/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { createHash } from 'crypto';
import { env } from '../env';
import {
  DOCUMENTS_COLLECTION,
  QUESTIONS_COLLECTION,
} from './collection-templates';
import { CollectionName } from './types';
import { getEmbedding } from '../google-ai';

/**
 * Returns collection template.
 *
 * @param collectionName Collection name.
 * @returns Template.
 */
export const getCollectionTemplate = (collectionName: CollectionName) => {
  let template = null;

  switch (collectionName) {
    case CollectionName.DOCUMENTS:
      template = DOCUMENTS_COLLECTION;
      break;

    case CollectionName.QUESTIONS:
      template = QUESTIONS_COLLECTION;
      break;

    default:
      break;
  }

  return template;
};

/**
 * Creates document chunks.
 * @param text Document text.
 * @param documentName Document name.
 * @returns Created chunks.
 */
export const createDocumentChunks = async (
  text: string,
  documentName: string,
): Promise<any> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: env.VECTOR_DB_CHUNK_SIZE,
    chunkOverlap: env.VECTOR_DB_CHUNK_OVERLAP,
    keepSeparator: false,
  });

  // Remove multiple white spaces.
  text = text.trim().replace(/[ \t]+/g, ' ');
  const splittedText = await splitter.splitText(text);

  // Create chunks and add metadata.
  const chunks = [];
  for (const text of splittedText) {
    const chunk = text.replace(/(\r\n|\n|\r)/gm, '');
    const embedding = await getEmbedding(chunk);

    chunks.push({
      properties: {
        content: chunk,
        source: documentName,
      },
      vectors: embedding,
    });
  }

  return chunks;
};

/**
 *
 * @param answer
 * @param questionId
 * @returns
 */
export function generateHash(answer: string, questionId: string) {
  const input = `${answer}:${questionId}`;

  return createHash('sha256').update(input).digest('hex');
}

/**
 *
 * @param str
 * @returns
 */
export function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(str);
}
