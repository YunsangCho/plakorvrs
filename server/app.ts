import express = require('express');
import { connectToDatabase, collections } from "./dbConn";

const path = require('path');
const app = express();
const bodyParser = require('body-parser');
//DB
// const MongoClient = mongodb.MongoClient;
const PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json()); 

connectToDatabase()
  .then(() => {
    app.listen(PORT, function(){
      console.log('WebServer listening on :  ' + PORT);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed~", error);
    process.exit();
  });

app.use(express.static(path.join(__dirname, 'build')));

app.post('/register', async (req: express.Request, res: express.Response)=>{
    
    var param = req.body;

    console.log(param);
    if(collections.reservation){
      await collections.reservation.insertOne(param);
      console.log("Success");
      res.json({OUT_MSG : "SUCCESS"})
    }else{
      res.json({OUT_MSG : "FAIL"})
    }

});

app.post('/search', async (req: express.Request, res: express.Response)=>{


    var param = req.body;
    var today = new Date();

    console.log(param);

    if(collections.reservation){
      collections.reservation.find(param).sort({'_id' : -1}).toArray((error, result)=>{
          if(error) {res.json({"returnData" : "error"}); return;}
          if(result){
            if(result.length == 0) {res.json({"returnData" : "X"}); return;}
            res.json({"returnData" : result})
          }
      })
    }
    
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './build/index.html'));
});
