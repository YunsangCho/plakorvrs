import express = require('express');
import * as sql from 'mssql';
import { connectToMongoDB, dbs, connectToMssqlDB} from "./dbConn";
import axios from 'axios';
var mongodb = require('mongodb');
import { Temporal } from '@js-temporal/polyfill';

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
app.set('view engine','ejs');

Promise.all([
  connectToMongoDB(), 
  connectToMssqlDB(),
])
.then(()=>{
  console.log("Promise fulfilled");
  console.log(`Successfully connected to database: MongoDB and collection: MSSQL`);

  app.listen(PORT, function(){
    console.log('WebServer listening on :  ' + PORT);
  });

})
.catch(error=>{
  console.error("Database connection failed~", error);
  process.exit();
})


//SQL SELECT SAMPLE
app.get("/testSelect", (req, res) => {
  console.log("테스트호출");

  var request = new sql.Request();
  request.stream = true;

  var query = `SELECT [차량번호]
                     ,[입차일시]
                     ,[출차일시]
                     ,[등록구분]
                     ,[성명]
                     ,[연락처]
                     ,[방문_연락처]
                     ,[방문_사유]
               FROM [parking_apt_DB].[dbo].[In_Out_Parking]
               WHERE [입차일시] LIKE '2022-10-25%'
               ORDER BY 입차일시`;
  request.query(query, (err, result) => {
    if(err) console.error(err);
  });

  var result : any = [];
  request.on("error", (err) => {
    console.log(err);
  })
  .on("row", (row) => {
    result.push(row);
  })
  .on("done", () => {
    console.log("result : ", result);
    res.json({result : result});
  });
});

//SQL INSERT SAMPLE
app.get("/testInsert", (req, res) => {
  console.log("테스트호출");

  var request = new sql.Request();
  request.stream = true;

  var query = `INSERT INTO [PARKING_APT_DB].[DBO].[VISIT_PARKING]([차량번호], [방문_등록일자], [방문_시작일자], [방문_마침일자], [방문_연락처], [방문_사유]) 
               VALUES('12가3456', '2022-10-24', '2022-10-24', '2022-10-24', '010-7383-1339', 'test')
              `;

  request.query(query, (err, result) => {
    if(err){
      console.error(err);
    }else{
      console.log("insert 완료");
    }
  });

});

app.use(express.static(path.join(__dirname, 'build')));

//임직원 검색
app.post('/empSearch', async (req: express.Request, res: express.Response)=>{
    var param = {name : req.body.name};

    if(dbs.simplify){
      dbs.simplify.collection("user").find(param).toArray((error, result)=>{
        console.log(result);
        res.json(result);
      })
    }
});

//알림톡 내 승인 반려 처리
app.get('/api/alimtalk/resvApproval', async (req: express.Request, res: express.Response)=>{
  console.log("call");
  
  let action = req.query.action;
  let resvId = req.query.resvId;
  
  let now = Temporal.Now.plainDateISO();
  let today = now.toString();
  
  console.log("action");
  console.log(action);
  console.log("resvId");
  console.log(resvId);

  let findParam = {_id : mongodb.ObjectId(resvId)};
  let updateParam = { registerState : "", approvalDate : ""};

  //Validation
  if(dbs.plakorvrs){
    await dbs.plakorvrs.collection("reservation").findOne(findParam).then((result) => {
      //현시간부로 방문일자 지났으면 처리 불가
      if(today > result?.visitDateStr){
        res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : "확인", msg : "방문일이 지난 예약은 처리할 수 없습니다."});
      }
      //승인상태가 대기상태가 아닌 경우
      if(result?.registerState != "대기"){
        res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : "확인", msg : "이미 처리가 완료되었습니다."});
      }
    });
  }

  if(action == "approve"){
    updateParam.registerState = "승인";
    updateParam.approvalDate = today;
  }else if(action == "deny"){
    updateParam.registerState = "반려";
    updateParam.approvalDate = today;
  }

  if(dbs.plakorvrs){
    await dbs.plakorvrs.collection("reservation").updateOne(findParam, {$set : updateParam})
    .then((result) => {
      console.log(result);
      res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : updateParam.registerState + "완료", msg : updateParam.registerState + "처리가 완료되었습니다."});
    });
  }

  //차량등록
  var request = new sql.Request();
  request.stream = true;

  var query = `INSERT INTO [PARKING_APT_DB].[DBO].[VISIT_PARKING]([차량번호], [방문_등록일자], [방문_시작일자], [방문_마침일자], [방문_연락처], [방문_사유]) 
               VALUES('12가3456', '2022-10-24', '2022-10-24', '2022-10-24', '010-7383-1339', 'test')
              `;
  request.query(query, (err, result) => {
    if(err){
      console.error(err);
    }else{
      console.log("차량정보 등록 완료");
    }
  });

  //메시지 발송
  //
  //
  
});

//예약접수
app.post('/register', async (req: express.Request, res: express.Response)=>{

    let insertParam = {...req.body};
    let alimtalkInitParam = {...req.body};
    let resvId;
    let alimtalkObj : any;

    //임직원 req.param에 직위 추가
    //추후 프론트단에서 직위 추가할 것임
    if(dbs.simplify){
      await dbs.simplify.collection("user").findOne({id : insertParam.empNo})
      .then((result) => {
        alimtalkInitParam.empPosition = result?.position;
        alimtalkInitParam.empTel = result?.tel;
        
        console.log("--------- userInfo ---------")
        console.log(result);
        console.log("--------- ----------------- ---------")
        console.log("--------- alimtalkInitParam ---------")
        console.log(alimtalkInitParam);
        console.log("--------- ----------------- ---------")
      })
      .catch((error) => {
        console.error(error);
      })
    }    

    //예약정보 인서트
    if(dbs.plakorvrs){
      await dbs.plakorvrs.collection("reservation").insertOne(insertParam)
      .then((result)=> {
        resvId = result.insertedId.toString();
        alimtalkInitParam.resvId = resvId;
        console.log("--------- resvId ---------")
        console.log(resvId);
        console.log("--------- ----------------- ---------")
      })
      .catch((error) => {
        console.error(error);
      });
    }

    // 객체 초기화
    alimtalkObj = await initAlimtalkObj(alimtalkInitParam);

    const alimtalk1 = axios.post(alimtalkObj.URL, alimtalkObj.resvAlr_visitor.data, alimtalkObj.config).then((res) => {console.log("1111result : "); console.log(res)});
    const alimtalk2 = axios.post(alimtalkObj.URL, alimtalkObj.resvAlr_manager.data, alimtalkObj.config).then((res) => {console.log("2222result : "); console.log(res)});


    Promise.all([alimtalk1, alimtalk2])
    .then((result) => {
      console.error("promiseAll");
      console.error(result);
      res.json({OUT_MSG : "SUCCESS"});
    })
    .catch((error) => {
      console.error(error);
      res.json({OUT_FLAG : "FAIL"});
    });

    //res.json(alimtalkObj);

    function initAlimtalkObj(param : any) : Promise<Object>{
      return new Promise((resolve, reject) => {
        var alimtalkObj = {
          URL : "https://dev-alimtalk-api.bizmsg.kr:1443/v2/sender/send"
          ,
          config : {
            headers : { userid : "sweet_partner"}                                  //env로 처리
          },
          resvAlr_visitor : {
            data : [{
              message_type: "AT",
              phn : param.visitorTelStr.replaceAll("-",""),
              profile : "3dd8b23c4c60316ee0c5ae80ae0f477e720ee392",//env로 처리
              tmplId : "vrs_visitor_resv1",
              msg : `안녕하세요 ${param.visitorName}님 (주) 프라코입니다. 예약접수가 완료됨을 안내드립니다.\n\n□ 담당자 : ${param.empName}\n□ 방문사업장 : ${param.visitFactory}\n□ 방문인원: ${param.visitorCnt}\n□ 희망 방문일 : ${param.visitDateStr}\n□ 희망 방문시간 : ${param.startTimeStr + " ~ " + param.endTimeStr}\n\n담당자가 승인하면 방문예약이 완료됩니다.`
            }]
          },
          resvAlr_manager : {
            data : [{
              message_type: "AT",
              phn : param.empTel.replaceAll("-",""),
              profile : "3dd8b23c4c60316ee0c5ae80ae0f477e720ee392",//env로 처리 (개발서버)
              tmplId : "local_API_TESTTEST",
              msg : `안녕하세요 ${param.empName} ${param.empPosition}님\n${param.empName} ${param.empPosition}님께 접수된 방문예약이 있음을 알려드립니다.\n\n□ 소속 : ${param.visitorTeam}\n□ 방문자 : ${param.visitorName}\n□ 방문인원: ${param.visitorCnt}\n□ 방문사업장 : ${param.visitFactory}\n□ 희망 방문일 : ${param.visitDateStr}\n□ 희망 방문시간 : ${param.startTimeStr + " ~ " + param.endTimeStr}\n□ 기타사항 : ${param.remarks}\n\n아래 버튼을 통해 승인 반려 처리를 해주세요.`,
              button1 : {name : "승인", type : "WL", url_mobile : "http://172.16.1.30:3000/api/alimtalk/resvApproval?action=approve&resvId=" + param.resvId},
              button2 : {name : "반려", type : "WL", url_mobile : "http://172.16.1.30:3000/api/alimtalk/resvApproval?action=deny&resvId=" + param.resvId}
            }]
          },
        } 
        resolve(alimtalkObj);
      })
    }

});

//공지사항 목록 가져오기
app.post('/getNoticeList', async (req: express.Request, res: express.Response) => {

  if(dbs.plakorvrs){

    dbs.plakorvrs.collection("notice").find().sort({'_id' : -1}).toArray((error, result)=>{
      if(error){
        res.json({OUT_MSG : "ERROR"});
      }else if(result){
        res.json({resultList : result});
      }else{
        res.json({resultList : {}});
      }
    });
  }else{
    res.json({resultList : {}});
  }


});

//공지사항 등록
app.post('/registerNotice', async (req: express.Request, res: express.Response) => {

  var param = req.body;

  console.log(param);

  if(dbs.plakorvrs){

    await dbs.plakorvrs.collection("notice").insertOne(param)
      .then((result)=> {
        if(result.acknowledged == true){
          res.json({OUT_MSG : "SUCCESS"});
        }else{
          res.json({OUT_MSG : "FAIL"});
        }
      })
      .catch((error) => {
        console.error(error);
        res.json({OUT_MSG : "ERROR"});
      });
  }

});

//예약목록 조회
app.post('/search', async (req: express.Request, res: express.Response)=>{

    var param = req.body;
    var today = new Date();

    console.log(param);

    if(dbs.plakorvrs){
      dbs.plakorvrs.collection("reservation").find(param).sort({'_id' : -1}).toArray((error, result)=>{
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