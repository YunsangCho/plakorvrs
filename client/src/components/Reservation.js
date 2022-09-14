import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import {setMinutes, setHours} from "date-fns";
import { validPhoneNo, leftPad, toStringByFormatting } from '../utils/commonFuction';
import Footer from './common/Footer';

registerLocale('ko', ko);

const Reservation = (props) => {

    //약관 확인
    const [tncCheck, setTncCheck] = useState(false);
    const [soCheck, setSoCheck] = useState(false);
  
    //방문 장소
    const [visitFactory, setVisitFactory] = useState();
    const [visitPurpose, setVisitPurpose] = useState();
    
    //방문자 정보
    const [meetingSpot, setMeetingSpot] = useState();
    const [visitDate, setVisitDate] = useState(new Date());         
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [visitorCnt, setVisitorCnt] = useState(0);
    const [visitorTeam, setVisitorTeam] = useState();
    const [visitorPosition, setVisitorPosition] = useState();
    const [visitorName, setVisitorName] = useState();
    const [visitorTel1, setVisitorTel1] = useState();
    const [visitorTel2, setVisitorTel2] = useState();
    const [hasCar, setHasCar] = useState('유');
    const [carNo, setCarNo] = useState();
    const [remarks, setRemarks] = useState();
  
    //담당자 정보
    const [empNo, setEmpNo] = useState();
    const [empName, setEmpName] = useState();
    const [mngTel1, setMngTel1] = useState();
    const [mngTel2, setMngTel2] = useState();
  
    const [startTimeObj, setStartTimeObj] = useState();
    useEffect(()=>{
     
    })
    const [endTimeObj, setEndTimeObj] = useState({sTime:0, sHour:0, sMinute:0, tmpDateObj:0});
  
    const now = new Date();
  
    return(
      <>
      <section className="py-5">
        <div className="container mt-5">
          <div className="form-group">
            <div className="privacy-wrap">
              <p className="c-sub-title">개인정보 수집 및 이용에 대한 동의</p>
              <div className="privacy-content">
                <dl>
                  <dt>1. 개인 정보의 이용 목적 </dt>
                  <dd>여러분이 제공해주신 개인정보는 보다 정확한 서비스를 제공하기 위해 이용되며, 이용약관에 명시된 목적 이외에 다른 용도로  이용하거나 본인의 승낙 없이  제3자에게 회원정보를 제공하지 않습니다. </dd>
                  <dd>다만, 다음 각 사항에 해당하는 경우에는 예외로 제3자와 공유될 수 있습니다.</dd>
                  <dd>1) 관계법령에 의하여 수사상의 목적으로 관계기관으로부터 요구가 있을 경우</dd>
                  <dd>2) 기타 관계법령에서 정한 절차에 따른 요청이 있는 경우</dd>
                  <dd>개인정보를 새로이 제3자에게 제공하는 경우에는 제공 받는 자, 제공목적 및 제공할 정보의 내용을 이메일 등을  통해 당사자에게 미리 고지하여 동의를 얻으며, 당사자의 동의 없이 어떠한 정보도 제공하지 않습니다.</dd>
                </dl>
                <dl>
                  <dt>2. 개인정보 수집항목 및 방법</dt>
                  <dd>(주)프라코은 문의, 제안 및 견적문의 메뉴를 통해 이름, 연락처 등 개인정보 일부를 제공받고 있습니다. </dd>
                  <dd>(주)프라코에 문의, 제안 또는 견적문의를 하시기 위해서는 다음의 정보를 입력해주셔야 하며,선택항목을 입력하시지 않았다고 하여 문의, 안, 견적문의접수에 제한은 없습니다.</dd>
                  <dd>- 이용항목: 이름, 연락처.</dd>
                </dl>
                <dl>
                  <dt>3. 개인 정보의 보유기간과 이용 기간 </dt>
                  <dd>수집된 일부 개인정보는 (주)프라코의 답변이 완료되기전까지 보유되며, 당사의 보다 정확한 서비스제공에 이용됩니다. 제안, 견적문의를 통해 접수된 내용에 대한 답변완료 또는 정보제공의 목적 달성 시에는 재생이 불가능 하도록 완전 삭제(접수내역 DB삭제)합니다.</dd>
                  <dd>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유-이용기간 내에서 개인정보를 처리·보유합니다. 고객상담 서비스 운영기간 동안 보유하고 있으며, 이외의 다른 목적으로 사용되지 않습니다.</dd>
                </dl>
                <dl>
                  <dt>4. 개인정보 수집 및 이용에 대한 동의를 거부할 권리</dt>
                  <dd>이용자는 위의 개인정보 수집 및 이용에 대하여 동의하지 않을 권리를 가지고 있습니다.</dd>
                  <dd>단, 개인정보 수집 및 이용은 회사가 사이트를 운영함에 있어 필수적인 정보로써, 개인정보의 수집 및 이용에 대하여 동의하지 않는 이용자는 고객상담 서비스 이용이 제한됩니다.</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="form-check float-end">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={tncCheck} onClick={()=>{setTncCheck(!tncCheck)}}/>
            <label className="form-check-label" htmlFor="exampleCheck1">개인정보 수집 및 이용에 동의합니다.</label>
          </div>
        </div>
        <div className="container mt-5">
          <div className="form-group">
            <div className="privacy-wrap">
              <p className="c-sub-title">보안정책 준수 동의</p>
              <div className="privacy-content">
                <dl>
                  <dt>◆ 보안정책 ◆</dt>
                  <dd>＊ 지정된 장소 외 출입 및 개별 행동 금지(안내자와 상시 동행)</dd>
                  <dd>＊ 사진 촬영 및 음성 녹음 금지 </dd>
                  <dd>＊ 사전 허가된 인원과 장비만 출입 및 반입 </dd>
                  <dd>＊ 기타 방문사업장의 정문 보안통제에 적극 협조 </dd>
                  <dd>＊ 신청자 주관으로 방문 동행인 대상 상기 보안정책 교육 및 전파 </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="form-check float-end">
            <input type="checkbox" className="form-check-input" id="exampleCheck2" checked={soCheck} onClick={()=>{setSoCheck(!soCheck)}}/>
            <label className="form-check-label" htmlFor="exampleCheck2">상기 보안정책 준수사항에 모두 동의합니다.</label>
          </div>
        </div>
  
        <div className="container">
          <div className="text-center pt-5">
            <h2></h2>
            <p>
              
            </p>
          </div>
          
          <div className="card">
            <div className="card-body">
              <form id="bookingForm" action="#" method="" className="needs-validation" novalidate autoComplete="off">
                <p className="card-text">방문 장소</p>
                <hr/>
                <div className="form-group">
                  <label>방문 사업장</label>
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <select className="form-control mr-1" autoComplete="off" onChange={(e)=> setVisitFactory(e.target.value)}>
                      <option defaultValue="">선택해주세요</option>
                      <option value="화성공장">화성공장</option>
                      <option value="아산공장">아산공장</option>
                      <option value="서산공장">서산공장</option>
                      <option value="진천공장">진천공장</option>
                      <option value="당진공장">당진공장</option>
                    </select>
                  </div>
                  <p className="card-text">방문자 정보</p>
                  <hr/>
                  <div className="form-group required">
                    <label htmlFor="inputName">방문목적<span className="ess">*</span></label>
                    <input type="text" className="form-control" placeholder="입력해주세요" required autoComplete="off" value={visitPurpose} onChange={(e)=>{setVisitPurpose(e.target.value)}}/>
                    <small className="form-text text-muted"></small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputName">방문장소</label>
                    <input type="text" className="form-control" placeholder="입력해주세요" required autoComplete="off" value={meetingSpot} onChange={(e)=>{setMeetingSpot(e.target.value)}}/>
                    <small className="form-text text-muted">ex) 회의실</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputDate">방문일시<span className="ess">*</span></label>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <DatePicker
                        locale={ko}
                        selected={visitDate}
                        onChange={(date) => setVisitDate(date)}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        onFocus={e => e.target.blur()}
                      />
                      <div className="m-1 customField1"></div>
                      <DatePicker
                        selected={startTime}
                        onChange={(time) => {
                                              setStartTime(time);
                                              var sHour = (time.getHours() - 10) < 0 ? ('0' + time.getHours().toString()) : time.getHours();
                                              var sMinute =  (time.getMinutes() - 10) < 0 ? ('0' + time.getMinutes().toString()) : time.getMinutes();
                                              var sTime = sHour + ":" + sMinute;
                                              var tmpDateObj = new Date();
                                              tmpDateObj.setHours(sHour);
                                              tmpDateObj.setMinutes(sMinute);
                                              setStartTimeObj({sTime, sHour, sMinute, tmpDateObj});
                                              setEndTime(0);
                                            }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="시간"
                        timeFormat='HH:mm'
                        dateFormat="HH시mm분"
                        onFocus={e => e.target.blur()}            
                      />
                      <div className="customField1"></div>
                      ~
                      <div className="customField1"></div>
                      { startTimeObj ? 
                      <DatePicker
                        selected={endTime}
                        onChange={(time)=>{
                                            setEndTime(time);
                                            var eHour = (time.getHours() - 10) < 0 ? ('0' + time.getHours().toString()) : time.getHours();
                                            var eMinute =  (time.getMinutes() - 10) < 0 ? ('0' + time.getMinutes().toString()) : time.getMinutes();
                                            var eTime = eHour + ":" + eMinute;
                                            var tmpDateObj = new Date();
                                            tmpDateObj.setHours(eHour);
                                            tmpDateObj.setMinutes(eMinute);
                                            setEndTimeObj({eTime, eHour, eMinute, tmpDateObj});
                                          }}
                        showTimeSelect
                        showTimeSelectOnly
                        minDate={now}
                        minTime={setHours(setMinutes(now, startTimeObj.sMinute), startTimeObj.sHour)}
                        maxTime={setHours(setMinutes(now, 45), 23)}
                        timeIntervals={15}
                        timeCaption="시간"
                        timeFormat='HH:mm'
                        dateFormat="HH시mm분"
                        onFocus={e => e.target.blur()}
                      />: <DatePicker showTimeSelect showTimeSelectOnly/>
                      }
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputName">인원<span className="ess">*</span></label>
                    <select className="form-control mr-1" onChange={(e)=> setVisitorCnt(e.target.value)}>
                      <option defaultValue="" disabled selected>선택해주세요</option>
                      <option value="1">1명</option>
                      <option value="2">2명</option>
                      <option value="3">3명</option>
                      <option value="4">4명</option>
                      <option value="5">5명</option>
                      <option value="6">6명</option>
                      <option value="7">7명</option>
                      <option value="8">8명</option>
                      <option value="9">9명</option>
                      <option value="10">10명</option>
                    </select>
                    <small className="form-text text-muted"></small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputName">소속<span className="ess">*</span></label>
                    <input type="text" className="form-control" placeholder="입력해주세요" required autoComplete="off" value={visitorTeam} onChange={(e)=>{setVisitorTeam(e.target.value)}}/>
                    <small className="form-text text-muted"></small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputName">직책</label>
                    <input type="text" className="form-control" placeholder="입력해주세요" required autoComplete="off"value={visitorPosition} onChange={(e)=>{setVisitorPosition(e.target.value)}}/>
                    <small className="form-text text-muted"></small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputName">성명<span className="ess">*</span></label>
                    <input type="text" className="form-control" placeholder="입력해주세요" required autoComplete="off" value={visitorName} onChange={(e)=>{setVisitorName(e.target.value)}}/>
                    <small className="form-text text-muted"></small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputDate">대표자 연락처<span className="ess">*</span></label>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <input type="text" className="form-control" readOnly defaultValue="010"/>
                      &nbsp;-&nbsp;
                      <input type="text" className="form-control" maxlength="4" value={visitorTel1} onChange={(e) => validPhoneNo(e, setVisitorTel1)}/>
                      &nbsp;-&nbsp;
                      <input type="text" className="form-control" maxlength="4" value={visitorTel2} onChange={(e) => validPhoneNo(e, setVisitorTel2)}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>차량유무</label><br/>
                    <div className="form-check form-check-inline">
                      <input type="radio" className="form-check-input" id="유" name="dd" defaultValue="type1" value={'유'} checked={hasCar === '유'} onChange={(e)=>{setHasCar(e.target.value)}}/>
                      <label className="form-check-label" htmlFor="유">유</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input type="radio" className="form-check-input" id="무" name="dd" defaultValue="type2" value={'무'} checked={hasCar === '무'} onChange={(e)=>{setHasCar(e.target.value);setCarNo('')}}/>
                      <label className="form-check-label" htmlFor="무">무</label>
                    </div>
                  </div>
                  {
                    hasCar == '유' ? 
                    
                    <div className="form-group">
                      <label htmlFor="inputName">차량번호</label>
                      <input type="text" className="form-control" placeholder="입력해주세요" required autoComplete="off" value={carNo} onChange={(e)=>{setCarNo(e.target.value)}}/>
                      <small className="form-text text-muted"></small>
                    </div>
                    
                    : null
                    
                  }
                  <div className="form-group">
                    <label htmlFor="textAreaRemark">기타사항</label>
                    <textarea className="form-control" rows="2" placeholder="비고" onChange={(e)=>{setRemarks(e.target.value)}}></textarea>
                  </div>
                  <p className="card-text">담당자 정보</p>
                  <hr/>
                  <div className="form-group">
                    <label htmlFor="inputName">담당자 사번<span className="ess">*</span></label>
                    <input type="text" className="form-control" placeholder="입력해주세요" required value={empNo} onChange={(e)=>{setEmpNo(e.target.value)}}/>
                    <small className="form-text text-muted"></small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputName">담당자명<span className="ess">*</span></label>
                    <input type="text" className="form-control" placeholder="입력해주세요" required value={empName} onChange={(e)=>{setEmpName(e.target.value)}}/>
                    <small className="form-text text-muted"></small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputName">담당자 연락처<span className="ess">*</span></label>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <input type="text" className="form-control" readOnly defaultValue="010"/>
                      &nbsp;-&nbsp;
                      <input type="text" className="form-control" maxlength="4" value={mngTel1} onChange={(e) => validPhoneNo(e, setMngTel1)}/>
                      &nbsp;-&nbsp;
                      <input type="text" className="form-control" maxlength="4" value={mngTel2} onChange={(e) => validPhoneNo(e, setMngTel2)}/>
                    </div>
                  </div>
                  <hr/>
                  <Button variant="dark" size="lg" style={{width: "100%"}}
                      onClick={(e)=>{
                        if(!tncCheck){
                          alert("개인정보 수집 및 이용 동의는 필수항목입니다.");
                          return;
                        }
                        if(!soCheck){
                          alert("보안정책 준수 동의는 필수항목입니다.");
                          return;
                        }
                        if(!visitFactory){
                          alert("방문 사업장은 필수항목입니다.");
                          return;
                        }
                        if(!visitPurpose){
                          alert("방문목적은 필수항목입니다.");
                          return;
                        }
                        if(!visitDate || !startTime || !endTime){
                          alert("방문일시는 필수항목입니다.");
                          return;
                        }
                        if(!visitorCnt){
                          alert("인원은 필수항목입니다.");
                          return;
                        }
                        if(!visitorTeam){
                          alert("소속은 필수항목입니다.");
                          return;
                        }
                        if(!visitorName){
                          alert("성명은 필수항목입니다.");
                          return;
                        }
                        if(!visitorTel1 || !visitorTel2){
                          alert("대표자연락처는 필수항목입니다.");
                          return;
                        }else if(visitorTel1 && visitorTel2){
                          if(visitorTel1.length < 4 || visitorTel2.length < 4){
                            alert("대표자연락처가 올바르지 않습니다.");
                            return;
                          }
                        }
                        if(hasCar == "유"){
                          if(!carNo){
                            alert("차량번호는 필수항목입니다.");
                            return;
                          }
                        }
                        if(!empNo){
                          alert("담당자 사번은 필수항목입니다.");
                          return;
                        }
                        if(!empName){
                          alert("담당자명은 필수항목입니다.");
                          return;
                        }
                        if(!mngTel1 || !mngTel2){
                          alert("담당자 연락처는 필수항목입니다.");
                          return;
                        }else if(mngTel1 && mngTel2){
                          if(mngTel1.length < 4 || mngTel2.length < 4){
                            alert("담당자연락처가 올바르지 않습니다.");
                            return;
                          }
                        }
  
                        var visitDateStr = toStringByFormatting(visitDate);
                        var startTimeStr = startTimeObj.sTime;
                        var endTimeStr = endTimeObj.eTime;
                        var visitorTelStr = '010-' + visitorTel1 + "-" + visitorTel2;
                        var mngTelStr = '010-' + mngTel1 + "-" + mngTel2;
                        var registerState = "대기";
                        const today = new Date();
                        
                        const hours = ('0' + today.getHours()).slice(-2);
                        const minutes = ('0' + today.getMinutes()).slice(-2);
                        const seconds = ('0' + today.getSeconds()).slice(-2);
                        const registerDate = toStringByFormatting(today) + ' ' +  hours + ':' + minutes + ':' + seconds;
  
                        var setparam = () => {
                          var param ={
                            visitFactory,      //방문 사업장  
                            visitPurpose,      //방문목적*
                            meetingSpot,       //방문장소
                            visitDateStr,      //방문일시*
                            startTimeStr,      //시작시간  
                            endTimeStr,        //종료시간
                            visitorCnt,        //인원*
                            visitorTeam,       //소속*
                            visitorPosition,   //직책
                            visitorName,       //성명*
                            visitorTelStr,     //대표자 연락처*
                            hasCar,            //차량유무
                            carNo,             //차량번호 == "유" ? 필수 : Ⅹ
                            remarks,           //기타사항
                            empNo,             //담당자 사번*
                            empName,           //담당자 성함*
                            mngTelStr,         //담당자 연락처*
                            registerDate,      //접수시간
                            registerState      //승인상태 
                          }
                          return param;
                        }
                        
                        //파라미터 출력
                        console.log(setparam());
  
                        //server req
                        axios.post("/register", setparam())
                        .then((res)=>{
                          console.log(res);
                          document.location.href = '/'
                          alert("접수되었습니다.");
                        })
                        .catch((error)=>{
                          console.log(error);
                        });
                      }}>
                      접수
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
      </>
    )
  }
  
  export default Reservation;