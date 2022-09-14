import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './common/Footer';

const Home = () => {
    return(
      <>
        <section className="showcase">
          <div className="video-container">
              {/* <video src={process.env.PUBLIC_URL + '/resources/video/background.mp4'} poster={process.env.PUBLIC_URL + '/resources/images/placeholder.png'} autoPlay muted loop></video> */}
              {/* <img src="/resources/images/background.png"/> */}
          </div>
          <div className="content">
              <h2> PLAKOR 방문예약에 오신 것을 환영합니다.</h2>
              <Link to="/reservation" className="btn">방문신청</Link>
              &nbsp;
              <Link to="/search" className="btn">신청조회</Link>
              <h4 style={{paddingTop : "50px"}}>방문문의</h4>
              <hr/>
              <h6 className="fw-normal">대표전화 : 031-369-8400</h6>
              <h6 className="fw-normal">화성공장 담당자 &nbsp; : 031-369-8503</h6>
          </div>
        </section>    
        <section className="py-5">
          <div className="container px-5 my-5">
              <div className="row gx-5">
                <div className="col-lg-12 col-md-12 mb-5 mb-lg-0"><h2 className="fw-bolder mb-0">방문절차</h2></div>
                <div className="col-lg-12">
                    <img id="pc" src={process.env.PUBLIC_URL + '/resources/images/sub-reserve-item.png'} style={{width: "100%", height: "100%", paddingTop: "50px"}} alt=""/>
                </div>
                <div className="col-md-12">
                    <img id="mobile" src={process.env.PUBLIC_URL + '/resources/images/sub-reserve-item-m.png'} style={{width: "100%", height: "100%"}} alt=""/>
                </div>
              </div>
          </div>
        </section>
        <Footer></Footer>
      </>   
    )
}

export default Home;
