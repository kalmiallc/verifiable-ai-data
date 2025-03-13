/**
 * List of db collections.
 */
export enum CollectionName {
  DOCUMENTS = 'Documents',
  QUESTIONS = 'Questions',
}

/**
 * Document interface.
 */
export interface DocumentInterface {
  content: string;
  documentName: string;
}

/**
 * Question interface.
 */
export interface QuestionInterface {
  question: string;
  answer: number;
  questionId: string;
  txHash: string;
}
