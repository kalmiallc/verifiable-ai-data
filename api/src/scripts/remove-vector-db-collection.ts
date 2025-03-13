import { CollectionName } from '../lib/vector-db/types';
import { VectorDb } from '../lib/vector-db/vector-db';

/**
 * Removes vector DB collections.
 */
const createCollections = async () => {
  try {
    await VectorDb.removeCollection(CollectionName.DOCUMENTS);
  } catch (error) {
    console.log('Error while removing collection:', error);
  }

  await VectorDb.close();
};

createCollections()
  .then(() => {
    console.log('Complete!');
    process.exit(0);
  })
  .catch(console.error);

// {
//   metadata: {},
//   properties: { content: undefined, source: undefined },
//   references: undefined,
//   uuid: '1199519a-4a85-476f-8bec-2269407b080e',
//   vectors: {}
// },
