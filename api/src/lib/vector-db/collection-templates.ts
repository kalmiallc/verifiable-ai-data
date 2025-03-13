import { CollectionConfigCreate, vectorizer } from 'weaviate-client';
import { CollectionName } from './types';

/**
 * Document schema template.
 */
export const DOCUMENTS_COLLECTION: CollectionConfigCreate = {
  name: CollectionName.DOCUMENTS,
  description: 'Documents contexts collections - content of context documents.',
  properties: [
    {
      name: 'content',
      description: 'Content of the context.',
      dataType: 'text',
    },
    {
      name: 'source',
      description: 'The name of the source material.',
      dataType: 'text',
    },
  ],
  vectorizers: vectorizer.none(),
};

/**
 * Questions schema template.
 */
export const QUESTIONS_COLLECTION: CollectionConfigCreate = {
  name: CollectionName.QUESTIONS,
  description: 'Question collections.',
  properties: [
    {
      name: 'question',
      description: 'User question.',
      dataType: 'text',
    },
    {
      name: 'generatedQuestions',
      description: 'LLM generated questions.',
      dataType: 'text',
    },
    {
      name: 'answer',
      description: 'LLM answer.',
      dataType: 'text',
    },
    {
      name: 'source',
      description: 'The name of the source material.',
      dataType: 'text',
    },
    {
      name: 'hash',
      description: 'Generated hash.',
      dataType: 'text',
    },
    {
      name: 'txHash',
      description: 'Transaction hash.',
      dataType: 'text',
    },
    {
      name: 'verified',
      description: 'If answer is verified on chain.',
      dataType: 'boolean',
    },
  ],
  vectorizers: vectorizer.none(),
};
