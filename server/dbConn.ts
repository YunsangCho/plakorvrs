// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
//const PORT = process.env.PORT || 3000;

// Global Variables
export const collections: { reservation?: mongoDB.Collection } = {};

// Initialize Connection
export async function connectToDatabase () {
  
  dotenv.config({ path: "../.env" });
  
  let uri :string = process.env.MONGO_URI || "";
  let dbName :string = process.env.DB_NAME || "";
  let collectionName :string = process.env.COLLECTION_NAME || "";

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(uri);
           
  await client.connect();
       
  const db: mongoDB.Db = client.db(dbName);
  
  const collection: mongoDB.Collection = db.collection(collectionName);

  collections.reservation = collection;
      
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${collection.collectionName}`);

}

