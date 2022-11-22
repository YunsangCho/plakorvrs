import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import { validPhoneNo, leftPad, toStringByFormatting } from '../utils/commonFuction';

const ParkingHist = (props) => {

  const [visitFactory, setVisitFactory] = useState();
  const [visitDate, setVisitDate] = useState(new Date(new Date().setDate(new Date().getDate() - 1)));
  
    return(
      <>
        <section className="py-custom1">
          <div className="container px-5">
            <div className="bg-white rounded-3 py-5 px-4 px-md-5 mb-5">
                <div className="text-center mb-5">
                    <div className="feature bg-dark bg-gradient text-white rounded-3 mb-3"><i className="bi bi-search"></i></div>
                    <h2 className="fw-bolder">차량출입이력 조회</h2>
                </div>
                <div className="row gx-5 justify-content-center">
                    <div className="col-lg-8 col-xl-6">
                      <form>
                          <div className="form-group">
                              <label htmlFor="inputName">사업장</label>
                              <select readOnly disabled className="form-control mr-1" autoComplete="off" defaultValue={visitFactory} onChange={(e)=> setVisitFactory(e.target.value)}>
                                <option defaultValue="화성공장">선택해주세요</option>
                                <option value="화성공장" selected>화성공장</option>
                                <option value="아산공장">아산공장</option>
                                <option value="서산공장">서산공장</option>
                                <option value="진천공장">진천공장</option>
                                <option value="당진공장">당진공장</option>
                              </select>
                              <small className="form-text text-muted"></small>
                          </div>
                          <div className="form-group mb-3">
                              <label htmlFor="fff" >일자</label>
                              <div className="d-flex flex-row justify-content-between align-items-center">
                                <DatePicker
                                  locale={ko}
                                  selected={visitDate}
                                  onChange={(date) => setVisitDate(date)}
                                  maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                  dateFormat="yyyy-MM-dd"
                                  onFocus={e => e.target.blur()}
                                />
                              </div>    
                          </div> 
                          <Button variant="dark" size="lg" style={{width: "100%"}} onClick={(e) => {
                            props.setLoading(true);
                            var param = {
                              //visitFactory, 
                              visitDate : toStringByFormatting(visitDate),
                            };
                            
                            // if(!visitFactory){
                            //   console.log(param);
                            //   alert("방문사업장을 선택해주세요.");
                            //   return;
                            // }

                            if(!visitDate){
                              props.setLoading(false);
                              alert("일자를 선택해주세요.");
                              return;
                            }
                            
                            axios({
                              url : '/getParkingHist',
                              method : 'post',
                              responseType : 'blob',
                              data : param
                            })
                            .then(res => {
                              var fileName = param.visitDate + "_차량출입일지.xlsx";         
                              const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', fileName);
                              document.body.appendChild(link);
                              link.click();
                              props.setLoading(false);
                            })
                            .catch((error)=>{
                              console.log(error);
                              props.setLoading(false);
                              alert("error");
                            })
                          }}>
                          다운로드
                          </Button>
                        </form>
                    </div> 
                </div>
            </div>
          </div>
        </section>
      </>
    )
}

export default ParkingHist;