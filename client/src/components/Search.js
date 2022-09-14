import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import SearchResult from './SearchResult';
import axios from 'axios';
import {validPhoneNo} from '../utils/commonFuction';

const Search = (props) => {
  
    const [visitorName, setVisitorName] = useState();
    const [tel1, setTel1] = useState();
    const [tel2, setTel2] = useState();
    const [resultFlag, setResultFlag] = useState(false);
    const [resultData, setResultData] = useState();
    
    return(
      <>
        <section className="py-custom1">
          <div className="container px-5">
            <div className="bg-white rounded-3 py-5 px-4 px-md-5 mb-5">
                <div className="text-center mb-5">
                    <div className="feature bg-dark bg-gradient text-white rounded-3 mb-3"><i className="bi bi-search"></i></div>
                    <h2 className="fw-bolder">신청현황 조회</h2>
                    {
                    resultFlag == false ? 
                    <p className="lead fw-normal text-muted mb-0" style={{fontSize: "16.5px"}}>접수 시 입력하신 성함과 연락처를 입력해주세요</p>
                    : null
                    }
                </div>
                {
                resultFlag == false ? 
                <div className="row gx-5 justify-content-center">
                    <div className="col-lg-8 col-xl-6">
                      <form>
                          <div className="form-group">
                              <label htmlFor="inputName">신청자명</label>
                              <input type="text" className="form-control" placeholder="입력해주세요" required onChange={(e) => setVisitorName(e.target.value)}/>
                              <small className="form-text text-muted"></small>
                          </div>
                          <div className="form-group mb-3">
                              <label htmlFor="fff" >연락처</label>
                              <div className="d-flex flex-row justify-content-between align-items-center">
                                  <input type="text" className="form-control" readOnly defaultValue="010"/>
                                  &nbsp;-&nbsp;
                                  <input type="text" className="form-control" maxlength="4" value={tel1} onChange={(e) => validPhoneNo(e, setTel1)}/>
                                  &nbsp;-&nbsp;
                                  <input type="text" className="form-control" maxlength="4" value={tel2} onChange={(e) => validPhoneNo(e, setTel2)}/>
                              </div>    
                          </div> 
                          <Button variant="dark" size="lg" style={{width: "100%"}} onClick={(e) => {
                            var visitorTelStr = "010-" + tel1 + "-" + tel2;
                            if(visitorTelStr.length != 13) {
                              alert("연락처가 올바르지 않습니다.");
                              return;
                            }
                            if(!visitorName){
                              alert("신청자명을 입력해주세요");
                              return;
                            }
                            var param = { visitorName, visitorTelStr}
                            axios.post("/search", param)
                            .then((res)=>{
                              var returnData = res.data.returnData;
                              if(returnData != "X"){
                                setResultFlag(true);
                                setResultData(returnData);
                              }else{
                                alert("조회결과가 존재하지 않습니다.");
                              }
                            })
                            .catch((error)=>{
                              alert("error");
                            })
                          }}>
                          조회
                          </Button>
                        </form>
                    </div> 
                </div>
                :
                <SearchResult resultData={resultData}></SearchResult>
                }
            </div>
          </div>
        </section>
      </>
    )
}

export default Search;