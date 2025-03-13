import { CollectionName } from '../lib/vector-db/types';
import { VectorDb } from '../lib/vector-db/vector-db';

/**
 * Creates vector DB collections.
 */
const createCollections = async () => {
  const collections = [CollectionName.DOCUMENTS, CollectionName.QUESTIONS];

  for (const collection of collections) {
    console.log(collection);
    try {
      await VectorDb.createCollection(collection);
    } catch (error) {
      console.log(`Error while creating collection ${collection}:`, error);
    }
  }

  await VectorDb.close();
};

createCollections()
  .then(() => {
    console.log('Complete!');
    process.exit(0);
  })
  .catch(console.error);
