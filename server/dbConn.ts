// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import * as sql from 'mssql';

//MongoDB Connection
// Global Variables
export const dbs: { plakorvrs?: mongoDB.Db, simplify?: mongoDB.Db } = {};
// Initialize Connection
export async function connectToMongoDB () {
  console.log("proceeding to mongoDB connection");  
  dotenv.config({ path: "../.env" });
  

  let uri :string = process.env.MONGO_URI || "";
  let dbName1 :string = process.env.DB_NAME1 || "";
  let dbName2 :string = process.env.DB_NAME2 || "";

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(uri);
           
  await client.connect();
       
  dbs.plakorvrs = client.db(dbName1);
  dbs.simplify = client.db(dbName2);
      
  //console.log(`Successfully connected to database: ${dbName1} and collection: ${dbName2}`);
}

//MSSQL Connection
const config = {
  server : "172.16.1.233",
  port: 1433,
  user : "parkinguser",
  password : "parkinguser",
  database : "parking_apt_DB",
  options: {
    enableArithAbort : true,
    encrypt: false, // 오류 발생시 추가 한 부분!
  },
  connectionTimeout : 150000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

//Async Await
export async function connectToMssqlDB(){
  try{
    console.log("proceeding to mssql connection");
    await sql.connect(config);
  }catch(error : any){
    console.log(error.message);
  }
}

