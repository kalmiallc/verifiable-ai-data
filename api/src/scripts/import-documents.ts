import fs from 'fs';
import { createDocumentChunks } from '../lib/vector-db/utils';
import { VectorDb } from '../lib/vector-db/vector-db';
import { CollectionName } from '../lib/vector-db/types';

const DOCUMENTS_PATH = './src/documents';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const importDocuments = async () => {
  const fileNames = fs.readdirSync(DOCUMENTS_PATH);

  for (const fileName of fileNames) {
    const text = fs.readFileSync(`${DOCUMENTS_PATH}/${fileName}`, 'utf-8');
    console.log(fileName);

    const chunks = await createDocumentChunks(text, fileName);
    try {
      await VectorDb.importData(CollectionName.DOCUMENTS, chunks);
    } catch (error) {
      console.log('Error while importing data: ', error);
    }

    await sleep(1000 * 30);
  }
};

importDocuments()
  .then(() => {
    console.log('Complete!');
    process.exit(0);
  })
  .catch(console.error);
