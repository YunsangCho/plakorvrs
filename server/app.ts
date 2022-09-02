const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
//DB
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 3000;

var db;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());

MongoClient.connect('mongodb+srv://plakor:!q2w3e4r@cluster0.dnh1o.mongodb.net/plakorvrs?retryWrites=true&w=majority', { useUnifiedTopology: true }, function(error, client){     //테스트용 DB
  if (error) return console.log(error);
  db = client.db('plakorvrs');

  app.listen(PORT, function(){
    console.log('WebServer listening on ' + PORT);
  });
});

app.use(express.static(path.join(__dirname, 'plakorvrs/build')));

app.post('/register', (req,res)=>{
    
    var param = req.body;

    console.log(param);

    db.collection('reservation').insertOne(param);

    console.log("Success");
    res.json({OUT_MSG : "SUCCESS"})
});

app.post('/search', (req, res) => {


    var param = req.body;
    var today = new Date();

    console.log(param);

    db.collection('reservation').find(param).sort({'_id' : -1}).toArray((error, result)=>{
        if(error) {res.json({"returnData" : "error"}); return;}
        if(result.length == 0) {res.json({"returnData" : "X"}); return;}
        res.json({"returnData" : result})
    })
    
    
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/plakorvrs/build/index.html'));
});
