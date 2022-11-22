import express = require('express');
import * as sql from 'mssql';
import { connectToMongoDB, dbs, connectToMssqlDB} from "./dbConn";
import axios from 'axios';
var mongodb = require('mongodb');
import { Temporal } from '@js-temporal/polyfill';
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');
const requestIp = require('request-ip');
const fs = require('fs');

const path = require('path');
const app = express();
const bodyParser = require('body-parser');
//DB
const PORT = process.env.PORT || 80;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 
// parse application/json
app.use(bodyParser.json()); 
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'build')));

//Connect to the DB & Start the Webserver
Promise.all([
  connectToMongoDB(), 
  connectToMssqlDB(),
])
.then(()=>{
  console.log("Promise fulfilled");
  console.log(`Successfully connected to MongoDB and MSSQL`);

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


});

//예약접수
app.post('/register', async (req: express.Request, res: express.Response)=>{

  console.log("-------------------------------------------------------------------------------------------------------------------");
  console.log(`Visitor ${req.body.visitorName} (${requestIp.getClientIp(req)}) is requesting the router "/register"`);
  
  //파라미터
  let param = {...req.body};
  //DB inserted id
  let resvId : string;

  //예약정보 DB 인서트 함수
  const insertDb = async () => {
    if(dbs.plakorvrs){
      await dbs.plakorvrs.collection("reservation").insertOne(param)
      .then((result)=> {
        resvId = result.insertedId.toString();
        param.resvId = resvId;
        console.log("======================================================================");
        console.log(`Inserting INFO into DB.... insertedId is "${resvId}"`);
        console.log("======================================================================");
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  //알림톡 전송(방문자)
  await alimtalk(res, param, "resvAlr_visitor");
  //DB Insert && 알림톡 전송(담당자)
  await alimtalk(res, param, "resvAlr_manager", insertDb);
  res.json({OUT_FLAG : "SUCCESS"});
  console.log("-------------------------------------------------------------------------------------------------------------------");
});

//알림톡 내 승인 반려 처리
app.get('/api/alimtalk/resvApproval', async (req: express.Request, res: express.Response)=>{
  console.log("call");
  
  let action = req.query.action;
  let resvId : any = req.query.resvId;
  let findParam : any;
  let resvData : any;  
  let now = Temporal.Now.plainDateISO();
  let today = now.toString();
  let updateParam = { registerState : "", approvalDate : ""};

  let hasCar : boolean;
  let chkException = 0;
  let alimtalkObj : any;

  const validation = async () => {
    //parameter 유효성 검사
    if(action == "approve"){
      updateParam.registerState = "승인";
      updateParam.approvalDate = today;
    }else if(action == "deny"){
      updateParam.registerState = "반려";
      updateParam.approvalDate = today;
    }else{
      chkException++;
      return res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : "확인", msg : "잘못된 접근입니다."});
    }
    if (resvId.match(/^[0-9a-fA-F]{24}$/)) {
      findParam = {_id : mongodb.ObjectId(resvId)};
    }else{
      chkException++;
      return res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : "확인", msg : "잘못된 접근입니다."});
    }
    //조회 후 처리가능 검사
    if(dbs.plakorvrs){
      await (dbs.plakorvrs.collection("reservation").findOne(findParam) as any).then((result : any) => {
        resvData = result;
        //예약이 존재하지 않는 경우
        if(!resvData){
          chkException++;
          return res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : "확인", msg : "해당 예약이 존재하지 않습니다."});
        }
        //현시간부로 방문일자 지난 경우
        if(today > resvData?.visitDateStr){
          chkException++;
          return res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : "확인", msg : "방문일이 지난 예약은 처리할 수 없습니다."});
        }
        //승인상태가 대기상태가 아닌 경우
        if(resvData?.registerState != "대기"){
          chkException++;
          return res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : "확인", msg : "이미 처리가 완료되었습니다."});
        }
      });
    }else{
      chkException++;
      return res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : "확인", msg : "잠시 후 다시 시도해주세요."});
    }
    console.log("chkException : " + chkException);
  }

  //예약상태 업데이트
  const updateResvStat = async () : Promise<string> => {
    let updateResvStatException = 0;
    if(dbs.plakorvrs){
      await dbs.plakorvrs.collection("reservation").updateOne(findParam, {$set : updateParam})
      .then((result) => {
        //MongoDB update success
        if(result.modifiedCount === 1){
          if(action === "approve"){
            if(resvData.hasCar === "유"){
              //주차관제시스템 등록
              let resultFlag : any = insertCarInfo();
              if(resultFlag === "FAIL"){
                updateResvStatException++;
              }
            }
          }
        }else{
          console.error("Failed to update reservation INFO");
          updateResvStatException++;
        }
      });
    }
    if(updateResvStatException > 0){
      return "FAIL";
    }else{
      return "SUCCESS";
    }
  }

  //차량정보 등록
  const insertCarInfo = async() : Promise<string> => {
    //차량등록
    var request = new sql.Request();
    request.stream = true;

    var query = `INSERT INTO [PARKING_APT_DB].[DBO].[VISIT_PARKING]
                ([차량번호], [방문_등록일자], [방문_시작일자], [방문_마침일자], [방문_성함], [방문_소속], [방문_연락처], [방문_사유]) 
                 VALUES('${resvData?.carNo}', '${resvData?.registerDate}', '${resvData?.visitDateStr}', '${resvData?.visitDateStr}'
                 , '${resvData?.visitorName}', '${resvData?.visitorTeam}', '${resvData?.visitorTelStr}', '${resvData?.visitPurpose}')
                `;
    request.query(query, (err, result) => {
      if(err){
        console.error(err);
        return "FAIL";
      }else{
        console.log("차량정보 등록 완료");
        return "SUCCESS";
      }
    });
    return "dd";
  }

  //검사
  await validation();
  //데이터 처리
  if(chkException === 0){
    
    let isUpdated = await updateResvStat();
    console.log(isUpdated);
    if(isUpdated === "SUCCESS"){
      console.log("SUCCESS");
      alimtalk(res, resvData, "resvAlr_visitor_" + action);
      return res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : updateParam.registerState + "완료", msg : updateParam.registerState + "처리가 완료되었습니다."});
    }else if(isUpdated === "FAIL"){
      console.log("FAIL");
      return res.render(path.join(__dirname, './build/resources/html/approvalResult.ejs'), {status : updateParam.registerState + "실패", msg : updateParam.registerState + "처리를 완료하지 못하였습니다.."});
    }
  }
  
});

//예약목록 조회
app.post('/search', async (req: express.Request, res: express.Response)=>{

  var param = req.body;
  var today = new Date();

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

//임직원 검색
app.post('/empSearch', async (req: express.Request, res: express.Response)=>{
var param = {name : req.body.name};

if(dbs.simplify){
  dbs.simplify.collection("user").find(param).toArray((error, result)=>{
    res.json(result);
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

//TMAP연동
app.get('/api/alimtalk/openTmap', async (req: express.Request, res: express.Response)=>{
  return res.render(path.join(__dirname, './build/resources/html/openTmap.ejs'));
})

//차량출입일지 출력
app.post('/getParkingHist', async (req: express.Request, res: express.Response)=>{
  let visitDate = req.body.visitDate.substring(0,10);

  var request = new sql.Request();
  request.stream = true;

  var query = 
  `SELECT A.[차량번호]
         ,A.[입차일시]
         ,A.[출차일시]
         ,A.[등록구분]
         ,A.[성명]
         ,A.[연락처]
         ,C.[방문_소속] AS 방문자소속 -- 커스텀 컬럼
         ,C.[방문_성함] AS 방문자성함 -- 커스텀 컬럼
         ,C.[방문_연락처] AS 방문자연락처
         ,C.[방문_사유] AS 방문사유
  FROM [parking_apt_DB].[dbo].[In_Out_Parking] A LEFT JOIN [parking_apt_DB].[dbo].[Free_Parking] B
  ON A.[차량번호] = B.[차량번호]
    LEFT JOIN [parking_apt_DB].[dbo].[Visit_Parking] C
    ON A.[차량번호] = C.[차량번호] AND LEFT(A.[입차일시], 10) = LEFT(C.[방문_시작일자], 10)
  WHERE LEFT(A.[입차일시], 10) = '${visitDate}'
  ORDER BY A.[입차일시]
  `;
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
    var createExcel = require('./createExcel');

    createExcel(visitDate, result);
    setTimeout(()=>{
      res.set('Content-Type', 'text/xlsx');
      fs.createReadStream(`./${visitDate} 차량출입일지.xlsx`)
      .pipe(res)
      .on('finish', ()=>{
          console.log('download complete')
      })
    }, 1000);
 });

});

app.get('*', function (req, res) {
    console.log("client IP: " + requestIp.getClientIp(req));
    res.sendFile(path.join(__dirname, './build/index.html'));
});

//Common Functions---------------------------------------------------------------------

//알림톡 파라미터 객체 초기화 함수
const initAlimtalkObj = async (param : any) : Promise<Object> => {
  return new Promise((resolve, reject) => {
    var alimtalkObj = {
      URL : "https://alimtalk-api.bizmsg.kr/v2/sender/send"
      ,
      config : {
        headers : { userid : "dddbstkd"}                        //env로 처리
      },
      resvAlr_visitor : {
        data : [{
          message_type: "AT",
          phn : param.visitorTelStr.replaceAll("-",""),
          profile : "3e1beefafdc993c5c608b6ea6a819bd752c190a2",//env로 처리
          tmplId : "vrs_visitor_resv1",
          msg : `안녕하세요 ${param.visitorName}님 (주) 프라코입니다. 예약접수가 완료됨을 안내드립니다.\n\n□ 담당자 : ${param.empName}\n□ 방문사업장 : ${param.visitFactory}\n□ 방문인원: ${param.visitorCnt}\n□ 희망 방문일 : ${param.visitDateStr}\n□ 희망 방문시간 : ${param.startTimeStr + " ~ " + param.endTimeStr}\n\n담당자가 승인하면 방문예약이 완료됩니다.`
        }]
      },
      resvAlr_manager : {
        data : [{
          message_type: "AT",
          phn : param.empTel.replaceAll("-",""),
          profile : "3e1beefafdc993c5c608b6ea6a819bd752c190a2",//env로 처리
          tmplId : "vrs_manager_resv1",
          msg : `안녕하세요 ${param.empName} ${param.empPosition}님\n${param.empName} ${param.empPosition}님께 방문예약이 접수되었습니다.\n\n□ 소속 : ${param.visitorTeam}\n□ 방문자 : ${param.visitorName}\n□ 연락처 : ${param.visitorTelStr}\n□ 방문인원: ${param.visitorCnt}\n□ 방문사업장 : ${param.visitFactory}\n□ 방문목적 : ${param.visitPurpose}\n□ 희망 방문일 : ${param.visitDateStr}\n□ 희망 방문시간 : ${param.startTimeStr + " ~ " + param.endTimeStr}\n□ 기타사항 : ${param.remarks ? param.remarks : "없음"}\n\n아래 버튼을 통해 승인 또는 반려 처리할 수 있습니다.`,
          button1 : {name : "승인", type : "WL", url_mobile : "http://visit.plakor.co.kr/api/alimtalk/resvApproval?action=approve&resvId=" + param.resvId},
          button2 : {name : "반려", type : "WL", url_mobile : "http://visit.plakor.co.kr/api/alimtalk/resvApproval?action=deny&resvId=" + param.resvId}
        }]
      },
      resvAlr_visitor_approve : {
        data : [{
          message_type: "AT",
          phn : param.visitorTelStr.replaceAll("-",""),
          profile : "3e1beefafdc993c5c608b6ea6a819bd752c190a2",//env로 처리
          tmplId : "vrs_visitor_resv2",
          msg : `${param.visitorName}님의 방문예약이 승인되었습니다.\n${param.carNo ? param.carNo + "건으로 사전 주차 등록이 되었습니다.\n주차공간이 부족할 시 경비실의 안내를 따라 주시길 바랍니다." : ""}\n\n□ 부서 : ${param.empDept}\n□ 담당자 : ${param.empName} ${param.empPosition}\n□ 연락처 : ${param.empTel}\n□ 방문일 : ${param.visitDateStr}\n□ 방문시간 : ${param.startTimeStr + "~" + param.endTimeStr}`,
          button1 : {name : "오시는길(TMAP)", type : "WL", url_mobile : "http://visit.plakor.co.kr/api/alimtalk/openTmap"},
        }]
      },
      resvAlr_visitor_deny : {
        data : [{
          message_type: "AT",
          phn : param.visitorTelStr.replaceAll("-",""),
          profile : "3e1beefafdc993c5c608b6ea6a819bd752c190a2",//env로 처리
          tmplId : "vrs_visitor_resv3",
          msg : `${param.visitorName}님의 ${param.visitDateStr} ${param.startTimeStr + "~" + param.endTimeStr}\n방문예약이 반려되었습니다.\n\n담당자와 상의 후 다시 접수 바랍니다.\n\n감사합니다.`,
        }]
      },
    } 
    resolve(alimtalkObj);
  })
}

//알림톡 전송 함수
const alimtalk = async(res : express.Response, param : any, profileName : string, callback : Function = ()=>{}) => {
  let target : string;
  let targetName : string;
  let alimtalkObj : any;
  if(profileName === "resvAlr_visitor"){
    target = "visitor";
    targetName = param.visitorName;
  }else if(profileName === "resvAlr_manager"){
    target = "manager";
    targetName = param.empName;
  }else if(profileName === "resvAlr_visitor_approve"){
    target = "visitor";
    targetName = param.visitorName;
  }else if(profileName === "resvAlr_visitor_deny"){
    target = "visitor";
    targetName = param.visitorName;
  }

  //DB insert
  await callback();
  alimtalkObj = await initAlimtalkObj(param);
  
  return new Promise((resolve, reject)=> {
    let sendResult : string;
    axios.post(alimtalkObj.URL, alimtalkObj[profileName].data, alimtalkObj.config)
    .then((resFromKakao) => {
      sendResult = resFromKakao.data[0].code;
      console.log("======================================================================");
      console.log(`Sending a message to ${target} "${targetName}" ${sendResult}!`); 
      if(sendResult === 'success') {resolve("success");}
      if(sendResult === 'fail') {console.log(resFromKakao?.data[0].message); res.json({OUT_FLAG : `${target} msg FAIL`});}
      console.log("======================================================================");
    })
    .catch((err) => {
      console.error(err)
      reject("fail");
      res.json({OUT_FLAG : "FAIL"});
    });
  })
}

//Common Functions---------------------------------------------------------------------//