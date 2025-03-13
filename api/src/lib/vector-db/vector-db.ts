/* eslint-disable @typescript-eslint/no-explicit-any */
import weaviate, {
  Collection,
  ConnectToCustomOptions,
  WeaviateClient,
} from 'weaviate-client';
import { env } from '../env';
import { CollectionName } from './types';
import { generateHash, getCollectionTemplate } from './utils';
import { randomUUID } from 'crypto';

/**
 * Class for operating with vector DB.
 */
export class VectorDb {
  /**
   * Vector DB instance.
   */
  private static _instance: VectorDb;

  /**
   * Vector DB client.
   */
  public client: WeaviateClient;

  /**
   * Client connection options.
   */
  private _clientOptions: ConnectToCustomOptions = {
    httpHost: env.WEAVIATE_HTTP_HOST,
    httpPort: env.WEAVIATE_HTTP_PORT,
    grpcHost: env.WEAVIATE_GRPC_HOST,
    grpcPort: env.WEAVIATE_GRPC_PORT,
    httpSecure: env.WEAVIATE_API_USE_SECURE,
    authCredentials: new weaviate.ApiKey(env.WEAVIATE_API_KEY),
    timeout: {
      insert: 10 * 60 * 1000,
    },
  };

  /**
   * Get Vector DB instance.
   *
   * @returns Instance of VectorDb.
   */
  public static async getInstance(): Promise<VectorDb> {
    if (!VectorDb._instance) {
      VectorDb._instance = new VectorDb();
      VectorDb._instance.client = await weaviate.connectToCustom(
        VectorDb._instance._clientOptions,
      );
    }

    // Reconnect client if connection expired.
    if (!(await VectorDb._instance.client.isReady())) {
      VectorDb._instance.client = await weaviate.connectToCustom(
        VectorDb._instance._clientOptions,
      );
    }

    return VectorDb._instance;
  }

  /**
   * Closes Vector DB client connection.
   */
  public static async close(): Promise<void> {
    if (VectorDb._instance && VectorDb._instance.client) {
      await VectorDb._instance.client.close();
    }
  }

  /**
   * Creates vector DB collection.
   * @param collectionName Collection.
   * @returns Created collection.
   */
  public static async createCollection(
    collectionName: CollectionName,
  ): Promise<Collection> {
    const instance = await VectorDb.getInstance();

    const template = getCollectionTemplate(collectionName);
    if (!template) {
      throw new Error('Collection template does not exists.');
    }

    const exists = await instance.client.collections.exists(collectionName);
    if (exists) {
      throw new Error('Collection already exists.');
    }

    try {
      return await instance.client.collections.create(template);
    } catch (error) {
      console.error('Error while creating collection schema: ', error);

      throw new Error('Error while creating collection schema.');
    }
  }

  /**
   * Removes vector DB collection.
   * @param collectionName Collection.
   */
  public static async removeCollection(
    collectionName: CollectionName,
  ): Promise<void> {
    const instance = await VectorDb.getInstance();

    const exists = await instance.client.collections.exists(collectionName);
    if (!exists) {
      throw new Error('Collection does not exists.');
    }

    try {
      await instance.client.collections.delete(collectionName);
    } catch (error) {
      console.error('Error while removing collection: ', error);

      throw new Error('Error while removing collection.');
    }
  }

  /**
   * Imports data into the given collection.
   * @param collectionName Collection name.
   * @param data Import data.
   */
  public static async importData(collectionName: CollectionName, data: any[]) {
    const instance = await VectorDb.getInstance();

    const collection = instance.client.collections.get(collectionName);
    if (!(await collection.exists())) {
      throw new Error('Collection does not exists.');
    }

    try {
      const response = await collection.data.insertMany(data);
      if (response.hasErrors) {
        console.log(
          'Batch import failed for following documents: ',
          response.errors,
        );

        throw new Error('Error while importing collection data.');
      }
    } catch (error) {
      console.error('Error while importing collection data: ', error);

      throw new Error('Error while importing collection data.');
    }
  }

  /**
   * Queries collection.
   * @param collectionName Collection name.
   * @param text Search text.
   * @param limit Results limit.
   */

  public static async query(
    collectionName: CollectionName,
    embedding: number[],
    limit: number = 25,
  ): Promise<any> {
    const instance = await VectorDb.getInstance();

    const collection = instance.client.collections.get(collectionName);
    if (!(await collection.exists())) {
      throw new Error('Collection does not exists.');
    }

    try {
      const result = await collection.query.nearVector(embedding, {
        returnMetadata: ['distance', 'certainty'],
        limit,
      });

      return result.objects;
    } catch (error) {
      console.error('Error while querying collection data: ', error);

      throw new Error('Error while querying collection data.');
    }
  }

  public static async get(
    collectionName: CollectionName,
    limit: number = 25,
  ): Promise<any> {
    const instance = await VectorDb.getInstance();

    const collection = instance.client.collections.get(collectionName);
    if (!(await collection.exists())) {
      throw new Error('Collection does not exists.');
    }

    try {
      const result = await collection.query.fetchObjects({
        returnMetadata: ['distance', 'certainty'],
        limit,
      });

      return result.objects;
    } catch (error) {
      console.error('Error while querying collection data: ', error);

      throw new Error('Error while querying collection data.');
    }
  }

  /**
   *
   * @param text
   * @param limit
   * @returns
   */
  public static async getVerifiedAnswers(
    embedding: number[],
    limit: number = 25,
  ) {
    const instance = await VectorDb.getInstance();

    const collection = instance.client.collections.get(
      CollectionName.QUESTIONS,
    );

    if (!(await collection.exists())) {
      throw new Error('Collection does not exists.');
    }

    try {
      const result = await collection.query.nearVector(embedding, {
        returnMetadata: ['distance', 'certainty'],
        limit,
        filters: collection.filter.byProperty('verified').equal(true),
      });

      return result.objects;
    } catch (error) {
      console.error('Error while querying collection data: ', error);

      throw new Error('Error while querying collection data.');
    }
  }

  /**
   *
   * @param id
   * @param txHash
   */
  public static async verifyQuestion(id: string, txHash: string) {
    const instance = await VectorDb.getInstance();

    const collection = instance.client.collections.get(
      CollectionName.QUESTIONS,
    );

    if (!(await collection.exists())) {
      throw new Error('Collection does not exists.');
    }

    // TODO: Generate multiple questions!
    try {
      await collection.data.update({
        id,
        properties: {
          txHash,
          verified: true,
        },
      });
    } catch (error) {
      console.error('Error while querying collection data: ', error);

      throw new Error('Error while querying collection data.');
    }
  }

  /**
   *
   * @param question
   * @param answer
   * @returns
   */
  public static async saveQuestion(
    question: string,
    answer: string,
    source: string,
    embedding: number[],
  ): Promise<string> {
    const instance = await VectorDb.getInstance();

    const collection = instance.client.collections.get(
      CollectionName.QUESTIONS,
    );

    if (!(await collection.exists())) {
      throw new Error('Collection does not exists.');
    }

    const id = randomUUID();
    const data = {
      id,
      properties: {
        question,
        answer,
        source,
        hash: generateHash(answer, id),
      },
      vectors: embedding,
    };

    try {
      return await collection.data.insert(data);
    } catch (error) {
      console.error('Error while importing collection data: ', error);

      throw new Error('Error while importing collection data.');
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  public static async getById(id: string): Promise<any> {
    const instance = await VectorDb.getInstance();

    const collection = instance.client.collections.get(
      CollectionName.QUESTIONS,
    );

    if (!(await collection.exists())) {
      throw new Error('Collection does not exists.');
    }

    try {
      return await collection.query.fetchObjectById(id);
    } catch (error) {
      console.error('Error while importing collection data: ', error);

      throw new Error('Error while importing collection data.');
    }
  }
}
